#!/usr/bin/env python3
"""CLI utility to manage gallery access phone numbers in MongoDB.

Usage examples:
  python tools/gallery_access_cli.py add 9876543210 +919876543211
  python tools/gallery_access_cli.py add --file numbers.txt
  python tools/gallery_access_cli.py list --limit 50
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
import tkinter as tk
from tkinter import messagebox, scrolledtext, ttk

from dotenv import load_dotenv
from pymongo import MongoClient


PHONE_FIELDS = ("phone", "mobile", "mobileNo", "number", "contact")


def normalize_phone(raw: str, default_country_code: str = "+91") -> str:
    value = str(raw or "").strip()
    if not value:
        return ""
    if value.startswith("+"):
        return re.sub(r"\s+", "", value)

    digits = re.sub(r"\D+", "", value)
    if not digits:
        return ""
    if len(digits) == 10:
        return f"{default_country_code}{digits}"
    return f"+{digits}"


def last10_digits(value: str) -> str:
    normalized = normalize_phone(value)
    digits = re.sub(r"\D+", "", normalized)
    return digits[-10:]


def parse_numbers(raw_numbers: Iterable[str], file_path: str | None) -> list[str]:
    numbers: list[str] = []

    for item in raw_numbers:
        chunk = item.strip()
        if not chunk:
            continue
        if "," in chunk:
            numbers.extend(part.strip() for part in chunk.split(","))
        else:
            numbers.append(chunk)

    if file_path:
        content = Path(file_path).read_text(encoding="utf-8")
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "," in line:
                numbers.extend(part.strip() for part in line.split(","))
            else:
                numbers.append(line)

    cleaned = [n for n in numbers if n]
    return cleaned


def get_db_and_collection_name() -> tuple[MongoClient, str, str]:
    load_dotenv()

    mongo_uri = (
        os.getenv("MONGODB_URI")
        or os.getenv("MONGODB_URL")
        or os.getenv("MONGO_URI")
    )
    if not mongo_uri:
        raise RuntimeError(
            "Mongo URI not found in .env. Set MONGODB_URI (or MONGODB_URL/MONGO_URI)."
        )

    db_name = os.getenv("MONGODB_DB", "wedding_invite")
    collection_name = os.getenv("GALLERY_ACCESS_COLLECTION", "gallery_access")

    client = MongoClient(mongo_uri)
    return client, db_name, collection_name


def find_existing_by_number(collection, input_phone: str, input_last10: str):
    exact = collection.find_one(
        {
            "$or": [
                {"phone": input_phone},
                {"phone": input_last10},
                {"mobile": input_phone},
                {"mobile": input_last10},
                {"mobileNo": input_phone},
                {"mobileNo": input_last10},
                {"number": input_phone},
                {"number": input_last10},
                {"contact": input_phone},
                {"contact": input_last10},
            ]
        }
    )
    if exact:
        return exact

    # Fallback: compare last 10 digits against existing records.
    rows = collection.find(
        {},
        {
            "_id": 1,
            "phone": 1,
            "mobile": 1,
            "mobileNo": 1,
            "number": 1,
            "contact": 1,
        },
    ).limit(5000)

    for row in rows:
        for field in PHONE_FIELDS:
            if last10_digits(str(row.get(field, ""))) == input_last10:
                return row

    return None


def add_numbers_core(collection, numbers: list[str], default_country_code: str, dry_run: bool):
    inserted = 0
    skipped = 0
    logs: list[str] = []

    for original in numbers:
        normalized = normalize_phone(original, default_country_code=default_country_code)
        digits10 = last10_digits(normalized)

        if not normalized or not digits10:
            logs.append(f"SKIP invalid number: {original}")
            skipped += 1
            continue

        existing = find_existing_by_number(collection, normalized, digits10)
        if existing:
            logs.append(f"SKIP duplicate: {normalized}")
            skipped += 1
            continue

        doc = {
            "phone": normalized,
            "addedFrom": "python-cli",
            "createdAt": datetime.now(timezone.utc),
        }

        if dry_run:
            logs.append(f"DRY-RUN insert: {doc['phone']}")
            inserted += 1
            continue

        collection.insert_one(doc)
        logs.append(f"ADDED: {normalized}")
        inserted += 1

    logs.append(f"Done. Added: {inserted} | Skipped: {skipped}")
    return {
        "inserted": inserted,
        "skipped": skipped,
        "logs": logs,
    }


def fetch_recent_rows(collection, limit: int):
    return list(collection.find({}, {}).sort("createdAt", -1).limit(limit))


def find_ids_by_number(collection, input_phone: str, input_last10: str):
    ids = set()

    exact_rows = collection.find(
        {
            "$or": [
                {"phone": input_phone},
                {"phone": input_last10},
                {"mobile": input_phone},
                {"mobile": input_last10},
                {"mobileNo": input_phone},
                {"mobileNo": input_last10},
                {"number": input_phone},
                {"number": input_last10},
                {"contact": input_phone},
                {"contact": input_last10},
            ]
        },
        {"_id": 1},
    )
    for row in exact_rows:
        if "_id" in row:
            ids.add(row["_id"])

    # Fallback: compare by last 10 digits.
    rows = collection.find(
        {},
        {
            "_id": 1,
            "phone": 1,
            "mobile": 1,
            "mobileNo": 1,
            "number": 1,
            "contact": 1,
        },
    ).limit(5000)
    for row in rows:
        for field in PHONE_FIELDS:
            if last10_digits(str(row.get(field, ""))) == input_last10:
                if "_id" in row:
                    ids.add(row["_id"])
                break

    return list(ids)


def remove_numbers_core(collection, numbers: list[str], default_country_code: str, dry_run: bool):
    removed = 0
    skipped = 0
    logs: list[str] = []

    for original in numbers:
        normalized = normalize_phone(original, default_country_code=default_country_code)
        digits10 = last10_digits(normalized)

        if not normalized or not digits10:
            logs.append(f"SKIP invalid number: {original}")
            skipped += 1
            continue

        ids_to_remove = find_ids_by_number(collection, normalized, digits10)
        if not ids_to_remove:
            logs.append(f"SKIP not found: {normalized}")
            skipped += 1
            continue

        if dry_run:
            logs.append(f"DRY-RUN remove: {normalized} ({len(ids_to_remove)} record(s))")
            removed += len(ids_to_remove)
            continue

        delete_result = collection.delete_many({"_id": {"$in": ids_to_remove}})
        logs.append(f"REMOVED: {normalized} ({delete_result.deleted_count} record(s))")
        removed += int(delete_result.deleted_count)

    logs.append(f"Done. Removed: {removed} | Skipped: {skipped}")
    return {
        "removed": removed,
        "skipped": skipped,
        "logs": logs,
    }


def add_numbers(numbers: list[str], default_country_code: str, dry_run: bool) -> int:
    if not numbers:
        print("No numbers provided.")
        return 1

    client, db_name, collection_name = get_db_and_collection_name()
    inserted = 0
    skipped = 0

    try:
        db = client[db_name]
        collection = db[collection_name]

        result = add_numbers_core(collection, numbers, default_country_code, dry_run)
        inserted = result["inserted"]
        skipped = result["skipped"]
        for line in result["logs"]:
            print(line)
        return 0
    finally:
        client.close()


def list_numbers(limit: int) -> int:
    client, db_name, collection_name = get_db_and_collection_name()

    try:
        db = client[db_name]
        collection = db[collection_name]
        rows = fetch_recent_rows(collection, limit)

        if not rows:
            print("No records found.")
            return 0

        for idx, row in enumerate(rows, start=1):
            phone = row.get("phone") or row.get("mobile") or row.get("mobileNo") or row.get("number") or row.get("contact") or "-"
            created = row.get("createdAt")
            print(f"{idx}. {phone} | createdAt={created}")

        return 0
    finally:
        client.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Manage gallery access mobile numbers using .env Mongo credentials."
    )
    sub = parser.add_subparsers(dest="command", required=True)

    add_parser = sub.add_parser("add", help="Add one or more mobile numbers")
    add_parser.add_argument("numbers", nargs="*", help="Mobile numbers, space or comma separated")
    add_parser.add_argument("--file", help="Path to a text file with one number per line or comma separated")
    add_parser.add_argument("--country-code", default="+91", help="Default country code for 10-digit numbers")
    add_parser.add_argument("--dry-run", action="store_true", help="Validate and show inserts without writing")

    list_parser = sub.add_parser("list", help="List recent gallery access numbers")
    list_parser.add_argument("--limit", type=int, default=25, help="Max rows to show")

    remove_parser = sub.add_parser("remove", help="Remove one or more mobile numbers")
    remove_parser.add_argument("numbers", nargs="*", help="Mobile numbers, space or comma separated")
    remove_parser.add_argument("--file", help="Path to a text file with one number per line or comma separated")
    remove_parser.add_argument("--country-code", default="+91", help="Default country code for 10-digit numbers")
    remove_parser.add_argument("--dry-run", action="store_true", help="Validate and show removals without writing")

    sub.add_parser("gui", help="Open desktop GUI")

    return parser


def launch_gui() -> int:
    try:
        client, db_name, collection_name = get_db_and_collection_name()
    except Exception as exc:
        print(f"Failed to read .env/Mongo config: {exc}")
        return 1

    root = tk.Tk()
    root.title("Gallery Access Manager")
    root.geometry("760x560")

    frame = ttk.Frame(root, padding=12)
    frame.pack(fill="both", expand=True)

    header = ttk.Label(
        frame,
        text=f"DB: {db_name} | Collection: {collection_name}",
    )
    header.pack(anchor="w", pady=(0, 8))

    notebook = ttk.Notebook(frame)
    notebook.pack(fill="both", expand=True)

    add_tab = ttk.Frame(notebook, padding=10)
    list_tab = ttk.Frame(notebook, padding=10)
    notebook.add(add_tab, text="Add Numbers")
    notebook.add(list_tab, text="View Numbers")

    input_label = ttk.Label(add_tab, text="Enter mobile numbers (one per line or comma-separated):")
    input_label.pack(anchor="w")

    numbers_text = scrolledtext.ScrolledText(add_tab, height=10)
    numbers_text.pack(fill="both", expand=False, pady=(6, 10))

    controls = ttk.Frame(add_tab)
    controls.pack(fill="x", pady=(0, 10))

    ttk.Label(controls, text="Default country code:").pack(side="left")
    country_code_var = tk.StringVar(value="+91")
    country_entry = ttk.Entry(controls, textvariable=country_code_var, width=8)
    country_entry.pack(side="left", padx=(8, 12))

    dry_run_var = tk.BooleanVar(value=False)
    ttk.Checkbutton(controls, text="Dry run", variable=dry_run_var).pack(side="left")

    output_label = ttk.Label(add_tab, text="Output:")
    output_label.pack(anchor="w")
    output_text = scrolledtext.ScrolledText(add_tab, height=11, state="disabled")
    output_text.pack(fill="both", expand=True)

    tree = ttk.Treeview(list_tab, columns=("phone", "createdAt"), show="headings", height=14)
    tree.heading("phone", text="Phone")
    tree.heading("createdAt", text="Created At")
    tree.column("phone", width=230, anchor="w")
    tree.column("createdAt", width=360, anchor="w")
    tree.pack(fill="both", expand=True)

    list_controls = ttk.Frame(list_tab)
    list_controls.pack(fill="x", pady=(10, 0))
    ttk.Label(list_controls, text="Limit:").pack(side="left")
    limit_var = tk.StringVar(value="50")
    ttk.Entry(list_controls, textvariable=limit_var, width=8).pack(side="left", padx=(8, 10))

    db = client[db_name]
    collection = db[collection_name]
    tree_row_id_map: dict[str, object] = {}

    def append_output(lines: list[str]):
        output_text.configure(state="normal")
        for line in lines:
            output_text.insert("end", line + "\n")
        output_text.see("end")
        output_text.configure(state="disabled")

    def clear_output():
        output_text.configure(state="normal")
        output_text.delete("1.0", "end")
        output_text.configure(state="disabled")

    def do_add():
        raw = numbers_text.get("1.0", "end").strip()
        if not raw:
            messagebox.showwarning("Missing input", "Please enter at least one mobile number.")
            return

        nums = parse_numbers([raw], None)
        cc = country_code_var.get().strip() or "+91"

        try:
            result = add_numbers_core(collection, nums, cc, dry_run_var.get())
        except Exception as exc:
            messagebox.showerror("Database error", str(exc))
            return

        clear_output()
        append_output(result["logs"])
        refresh_list()

    def do_remove():
        raw = numbers_text.get("1.0", "end").strip()
        if not raw:
            messagebox.showwarning("Missing input", "Please enter at least one mobile number to remove.")
            return

        nums = parse_numbers([raw], None)
        cc = country_code_var.get().strip() or "+91"

        try:
            result = remove_numbers_core(collection, nums, cc, dry_run_var.get())
        except Exception as exc:
            messagebox.showerror("Database error", str(exc))
            return

        clear_output()
        append_output(result["logs"])
        refresh_list()

    def remove_selected_rows():
        selected = tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Please select at least one row to remove.")
            return

        if not messagebox.askyesno("Confirm remove", "Remove selected number(s) from gallery access?"):
            return

        ids_to_remove = [tree_row_id_map.get(item_id) for item_id in selected if tree_row_id_map.get(item_id) is not None]
        if not ids_to_remove:
            messagebox.showwarning("No records", "Unable to resolve selected records.")
            return

        try:
            delete_result = collection.delete_many({"_id": {"$in": ids_to_remove}})
        except Exception as exc:
            messagebox.showerror("Database error", str(exc))
            return

        clear_output()
        append_output([f"REMOVED selected rows: {delete_result.deleted_count}"])
        refresh_list()

    def refresh_list():
        tree_row_id_map.clear()
        for item in tree.get_children():
            tree.delete(item)

        try:
            limit = max(1, int(limit_var.get().strip() or "50"))
        except ValueError:
            limit = 50

        try:
            rows = fetch_recent_rows(collection, limit)
        except Exception as exc:
            messagebox.showerror("Database error", str(exc))
            return

        for row in rows:
            phone = row.get("phone") or row.get("mobile") or row.get("mobileNo") or row.get("number") or row.get("contact") or "-"
            created = row.get("createdAt")
            node_id = tree.insert("", "end", values=(phone, str(created)))
            tree_row_id_map[node_id] = row.get("_id")

    ttk.Button(controls, text="Remove Numbers", command=do_remove).pack(side="right", padx=(8, 0))
    ttk.Button(controls, text="Add Numbers", command=do_add).pack(side="right")
    ttk.Button(list_controls, text="Remove Selected", command=remove_selected_rows).pack(side="left", padx=(0, 8))
    ttk.Button(list_controls, text="Refresh", command=refresh_list).pack(side="left")

    def on_close():
        try:
            client.close()
        finally:
            root.destroy()

    root.protocol("WM_DELETE_WINDOW", on_close)
    refresh_list()
    root.mainloop()
    return 0


def main() -> int:
    if len(sys.argv) == 1:
        return launch_gui()

    parser = build_parser()
    args = parser.parse_args()

    if args.command == "add":
        numbers = parse_numbers(args.numbers, args.file)
        return add_numbers(numbers, default_country_code=args.country_code, dry_run=args.dry_run)

    if args.command == "list":
        return list_numbers(limit=max(1, args.limit))

    if args.command == "remove":
        numbers = parse_numbers(args.numbers, args.file)
        if not numbers:
            print("No numbers provided.")
            return 1

        client, db_name, collection_name = get_db_and_collection_name()
        try:
            db = client[db_name]
            collection = db[collection_name]
            result = remove_numbers_core(collection, numbers, args.country_code, args.dry_run)
            for line in result["logs"]:
                print(line)
            return 0
        finally:
            client.close()

    if args.command == "gui":
        return launch_gui()

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
