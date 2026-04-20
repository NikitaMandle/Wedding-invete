require('dotenv').config();

const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
const twilio = require('twilio');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;
const dbName = process.env.MONGODB_DB || 'wedding_invite';
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;
const IST_OFFSET_MINUTES = 330;
let twilioAuthValid = null;
let twilioAuthError = '';

function galleryItemsResponse(authorized) {
  return { authorized: !!authorized, items: authorized ? GALLERY_ITEMS : [] };
}

const GALLERY_ITEMS = [
  {
    category: 'pre',
    tileClass: 'gp1',
    tileLabel: 'Pre-Wedding',
    lightboxLabel: 'Pre-Wedding 1',
    bg: '#3d0808',
    size: 'lg',
    tileImage: '/public/gallery/slide-1.jpeg',
    slides: [
      { label: 'Pre-Wedding 1', bg: '#3d0808', imageUrl: '/public/gallery/slide-1.jpeg' },
      { label: 'Pre-Wedding 1 - Portrait', bg: '#5a0d12', imageUrl: '/public/gallery/slide-2.jpeg' },
      { label: 'Pre-Wedding 1 - Candid', bg: '#2c0508', imageUrl: '/public/gallery/slide-3.jpeg' }
    ]
  },
  {
    category: 'pre',
    tileClass: 'gp2',
    tileLabel: 'Together',
    lightboxLabel: 'Pre-Wedding 2',
    bg: '#1a0303',
    tileImage: '/public/gallery/slide-4.jpeg',
    slides: [
      { label: 'Pre-Wedding 2', bg: '#1a0303', imageUrl: '/public/gallery/slide-4.jpeg' },
      { label: 'Together - Smile', bg: '#2c0606', imageUrl: '/public/gallery/slide-5.jpeg' },
      // { label: 'Together - Walk', bg: '#3f0a0a', imageUrl: '/public/gallery/slide-6.jpeg' }
    ]
  },
  {
    category: 'ev',
    tileClass: 'gp3',
    tileLabel: 'Engagement',
    lightboxLabel: 'Engagement',
    bg: '#3d2d0d',
    tileImage: '/public/gallery/slide-7.jpeg',
    slides: [
      { label: 'Engagement Ring', bg: '#3d2d0d', imageUrl: '/public/gallery/slide-7.jpeg' },
      { label: 'Engagement Stage', bg: '#5d4514', imageUrl: '/public/gallery/slide-8.jpeg' },
      { label: 'Engagement Family', bg: '#2e220a', imageUrl: '/public/gallery/slide-9.jpeg' }
    ]
  },
  {
    category: 'pre',
    tileClass: 'gp4',
    tileLabel: 'Moments',
    lightboxLabel: 'Pre-Wedding 3',
    bg: '#0d1a3d',
    tileImage: '/public/gallery/slide-10.jpeg',
    slides: [
      { label: 'Pre-Wedding 3', bg: '#0d1a3d', imageUrl: '/public/gallery/slide-10.jpeg' },
      { label: 'Moments - Sunset', bg: '#162a63', imageUrl: '/public/gallery/slide-11.jpeg' },
      { label: 'Moments - Pose', bg: '#091229', imageUrl: '/public/gallery/slide-12.jpeg' }
    ]
  },
  {
    category: 'ev',
    tileClass: 'gp5',
    tileLabel: 'Celebration',
    lightboxLabel: 'Celebration',
    bg: '#0d3d0d',
    tileImage: '/public/gallery/slide-13.jpeg',
    slides: [
      { label: 'Celebration Lights', bg: '#0d3d0d', imageUrl: '/public/gallery/slide-13.jpeg' },
      { label: 'Celebration Dance', bg: '#186418', imageUrl: '/public/gallery/slide-14.jpeg' },
      { label: 'Celebration Cheers', bg: '#0a2b0a', imageUrl: '/public/gallery/slide-15.jpeg' },
      { label: 'Celebration Cheers', bg: '#0a2b0a', imageUrl: '/public/gallery/slide-19.jpeg' }
    ]
  },
  {
    category: 'ev',
    tileClass: 'gp6',
    tileLabel: 'Joy',
    lightboxLabel: 'Joy',
    bg: '#2d0d3d',
    tileImage: '/public/gallery/slide-16.jpeg',
    slides: [
      { label: 'Joyful Moment', bg: '#2d0d3d', imageUrl: '/public/gallery/slide-16.jpeg' },
      { label: 'Joy - Friends', bg: '#4a1764', imageUrl: '/public/gallery/slide-17.jpeg' },
      { label: 'Joy - Finale', bg: '#220a2e', imageUrl: '/public/gallery/slide-18.jpeg' }
    ]
  }
];

function normalizePhone(input, defaultCountryCode = '+91') {
  const raw = String(input || '').trim();
  if (!raw) return '';
  if (raw.startsWith('+')) return raw.replace(/\s+/g, '');
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `${defaultCountryCode}${digits}`;
  return `+${digits}`;
}

function extractLast10Digits(value) {
  const normalized = normalizePhone(value || '');
  const digits = String(normalized).replace(/\D+/g, '');
  return digits.slice(-10);
}

async function hasGalleryAccess(db, phoneInput) {
  const inputPhone = normalizePhone(phoneInput);
  const inputLast10 = extractLast10Digits(inputPhone);
  if (!inputLast10) return false;

  const galleryAccessCollection = db.collection('gallery_access');

  const exact = await galleryAccessCollection.findOne({
    $or: [
      { phone: inputPhone },
      { phone: inputLast10 },
      { mobile: inputPhone },
      { mobile: inputLast10 },
      { mobileNo: inputPhone },
      { mobileNo: inputLast10 },
      { number: inputPhone },
      { number: inputLast10 },
      { contact: inputPhone },
      { contact: inputLast10 }
    ]
  });

  if (exact) return true;

  const rows = await galleryAccessCollection
    .find({}, { projection: { _id: 0, phone: 1, mobile: 1, mobileNo: 1, number: 1, contact: 1 } })
    .limit(5000)
    .toArray();

  return rows.some((row) => {
    const candidates = [row.phone, row.mobile, row.mobileNo, row.number, row.contact];
    return candidates.some((candidate) => extractLast10Digits(candidate) === inputLast10);
  });
}

async function ensureTwilioReady() {
  if (!twilioClient || !twilioFrom) {
    twilioAuthValid = false;
    twilioAuthError = 'Twilio not configured';
    return false;
  }
  if (twilioAuthValid !== null) return twilioAuthValid;

  try {
    await twilioClient.api.accounts(twilioSid).fetch();
    twilioAuthValid = true;
    twilioAuthError = '';
    return true;
  } catch (err) {
    twilioAuthValid = false;
    twilioAuthError = err && err.message ? err.message : 'Twilio authentication failed';
    console.error(`Twilio authentication check failed: ${twilioAuthError}`);
    return false;
  }
}

function toIstDateParts(date = new Date()) {
  const ist = new Date(date.getTime() + IST_OFFSET_MINUTES * 60000);
  return {
    year: ist.getUTCFullYear(),
    month: ist.getUTCMonth(),
    day: ist.getUTCDate(),
    hour: ist.getUTCHours(),
    minute: ist.getUTCMinutes(),
    second: ist.getUTCSeconds()
  };
}

function makeIstDate(year, monthIndex, day, hour, minute = 0, second = 0) {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, second) - IST_OFFSET_MINUTES * 60000);
}

function getNextMorningEight(date = new Date()) {
  const parts = toIstDateParts(date);
  const todayEightIst = makeIstDate(parts.year, parts.month, parts.day, 8, 0, 0);
  if (date.getTime() < todayEightIst.getTime()) return todayEightIst;
  return makeIstDate(parts.year, parts.month, parts.day + 1, 8, 0, 0);
}

function addIstDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

let cachedDb = null;
let usingInMemoryDb = false;
let memoryIdCounter = 1;

function nextMemoryId() {
  const id = memoryIdCounter;
  memoryIdCounter += 1;
  return `mem_${id}`;
}

function createInMemoryDb() {
  const store = {
    rsvps: [],
    wishes: [],
    quiz_results: [],
    reminders: []
  };

  function matchesFilter(doc, filter = {}) {
    for (const [key, expected] of Object.entries(filter)) {
      if (expected && typeof expected === 'object' && '$lte' in expected) {
        if (!(doc[key] <= expected.$lte)) return false;
        continue;
      }
      if (doc[key] !== expected) return false;
    }
    return true;
  }

  function applyProjection(doc, projection = null) {
    if (!projection) return { ...doc };
    const includeKeys = Object.entries(projection)
      .filter(([, value]) => value === 1)
      .map(([key]) => key);
    const excludeKeys = Object.entries(projection)
      .filter(([, value]) => value === 0)
      .map(([key]) => key);

    if (includeKeys.length > 0) {
      const picked = {};
      for (const key of includeKeys) {
        if (key in doc) picked[key] = doc[key];
      }
      return picked;
    }

    const cloned = { ...doc };
    for (const key of excludeKeys) delete cloned[key];
    return cloned;
  }

  return {
    collection(name) {
      if (!store[name]) store[name] = [];
      const records = store[name];

      return {
        async createIndex() {
          return null;
        },
        async insertOne(document) {
          const insertedId = nextMemoryId();
          records.push({ ...document, _id: insertedId });
          return { insertedId };
        },
        find(filter = {}, options = {}) {
          let rows = records.filter((doc) => matchesFilter(doc, filter));

          const cursor = {
            sort(sortSpec = {}) {
              const [field, direction] = Object.entries(sortSpec)[0] || [];
              if (field) {
                rows = [...rows].sort((a, b) => {
                  const left = a[field];
                  const right = b[field];
                  if (left === right) return 0;
                  if (left == null) return 1;
                  if (right == null) return -1;
                  if (left > right) return direction >= 0 ? 1 : -1;
                  return direction >= 0 ? -1 : 1;
                });
              }
              return cursor;
            },
            limit(limitCount = rows.length) {
              rows = rows.slice(0, limitCount);
              return cursor;
            },
            async toArray() {
              return rows.map((doc) => applyProjection(doc, options.projection));
            }
          };

          return cursor;
        },
        async updateOne(filter = {}, update = {}) {
          const idx = records.findIndex((doc) => matchesFilter(doc, filter));
          if (idx < 0) return { matchedCount: 0, modifiedCount: 0 };

          const next = { ...records[idx] };
          if (update.$set && typeof update.$set === 'object') {
            Object.assign(next, update.$set);
          }
          if (update.$inc && typeof update.$inc === 'object') {
            for (const [field, incBy] of Object.entries(update.$inc)) {
              const current = Number(next[field] || 0);
              next[field] = current + Number(incBy || 0);
            }
          }
          records[idx] = next;
          return { matchedCount: 1, modifiedCount: 1 };
        }
      };
    }
  };
}

const memoryDb = createInMemoryDb();

async function getDb() {
  if (cachedDb) return cachedDb;
  if (usingInMemoryDb) return memoryDb;
  if (!mongoUri) {
    usingInMemoryDb = true;
    console.warn('Mongo URI not configured. Using in-memory storage (non-persistent).');
    return memoryDb;
  }

  try {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 7000,
      family: 4
    });

    await client.connect();
    cachedDb = client.db(dbName);

    await Promise.all([
      cachedDb.collection('rsvps').createIndex({ createdAt: -1 }),
      cachedDb.collection('wishes').createIndex({ createdAt: -1 }),
      cachedDb.collection('quiz_results').createIndex({ createdAt: -1 }),
      cachedDb.collection('reminders').createIndex({ nextRunAt: 1 }),
      cachedDb.collection('reminders').createIndex({ status: 1, nextRunAt: 1 }),
      cachedDb.collection('reminders').createIndex({ status: 1, sentAt: 1 })
    ]);

    return cachedDb;
  } catch (err) {
    usingInMemoryDb = true;
    console.error(`Mongo connection failed (${err.message}). Falling back to in-memory storage.`);
    return memoryDb;
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(ROOT));

app.options('/api/*', (req, res) => {
  setCors(res);
  res.status(200).end();
});

app.post('/api/rsvp', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const body = req.body || {};

    const fullName = String(body.fullName || '').trim();
    const attendance = String(body.attendance || '').trim();
    const phone = normalizePhone(body.phone);
    const event = String(body.event || '').trim();
    const note = String(body.note || '').trim();
    const guestCountRaw = Number(body.guestCount || 1);
    const guestCount = Number.isFinite(guestCountRaw) ? Math.min(Math.max(guestCountRaw, 1), 10) : 1;

    if (!fullName || !attendance) {
      return res.status(400).json({ error: 'fullName and attendance are required' });
    }

    const result = await db.collection('rsvps').insertOne({
      fullName,
      attendance,
      phone,
      event,
      note,
      guestCount,
      source: 'web',
      createdAt: new Date()
    });

    if (attendance.toLowerCase() === 'yes' && phone) {
      const nextRunAt = getNextMorningEight();
      const endAt = new Date('2026-05-10T08:00:00+05:30');
      await db.collection('reminders').insertOne({
        fullName,
        phone,
        channel: 'sms',
        recurrence: 'daily',
        nextRunAt,
        endAt,
        message: 'Daily reminder: Nikhil & Prachi wedding is on 10 May 2026.',
        status: 'pending',
        deliveryStatus: 'queued',
        sentCount: 0,
        source: 'rsvp',
        rsvpId: String(result.insertedId),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send an immediate confirmation SMS, while keeping daily reminders scheduled.
      const twilioReady = await ensureTwilioReady();
      if (twilioReady) {
        try {
          await twilioClient.messages.create({
            body: 'Thanks for confirming your RSVP! Daily reminders for Nikhil & Prachi wedding are scheduled.',
            from: twilioFrom,
            to: phone
          });
        } catch (smsErr) {
          console.error(`RSVP immediate SMS failed for ${phone}:`, smsErr.message);
        }
      } else {
        console.error(`RSVP immediate SMS skipped for ${phone}: ${twilioAuthError || 'Twilio authentication failed'}`);
      }
    }

    return res.status(200).json({ ok: true, id: String(result.insertedId) });
  } catch (err) {
    console.error('RSVP API error:', err.message);
    return res.status(500).json({ error: 'Unable to save RSVP' });
  }
});

app.get('/api/wishes', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const wishes = await db
      .collection('wishes')
      .find({}, { projection: { _id: 0, name: 1, message: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return res.status(200).json({ wishes });
  } catch (err) {
    console.error('Wishes GET API error:', err.message);
    return res.status(500).json({ error: 'Unable to fetch wishes' });
  }
});

app.post('/api/wishes', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const body = req.body || {};

    const name = String(body.name || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !message) {
      return res.status(400).json({ error: 'name and message are required' });
    }

    const result = await db.collection('wishes').insertOne({
      name: name.slice(0, 80),
      message: message.slice(0, 600),
      source: 'web',
      createdAt: new Date()
    });

    return res.status(200).json({ ok: true, id: String(result.insertedId) });
  } catch (err) {
    console.error('Wishes POST API error:', err.message);
    return res.status(500).json({ error: 'Unable to save wish' });
  }
});

app.post('/api/gallery/verify', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const body = req.body || {};

    if (!extractLast10Digits(body.phone)) {
      return res.status(400).json({ authorized: false, error: 'phone is required' });
    }

    const authorized = await hasGalleryAccess(db, body.phone);

    return res.status(200).json({ authorized });
  } catch (err) {
    console.error('Gallery verify API error:', err.message);
    return res.status(500).json({ authorized: false, error: 'Unable to verify access' });
  }
});

app.post('/api/gallery/items', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const body = req.body || {};

    if (!extractLast10Digits(body.phone)) {
      return res.status(400).json({ authorized: false, error: 'phone is required', items: [] });
    }

    const authorized = await hasGalleryAccess(db, body.phone);
    if (!authorized) {
      return res.status(200).json(galleryItemsResponse(false));
    }

    return res.status(200).json(galleryItemsResponse(true));
  } catch (err) {
    console.error('Gallery items API error:', err.message);
    return res.status(500).json({ authorized: false, error: 'Unable to load gallery', items: [] });
  }
});

app.post('/api/quiz', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const body = req.body || {};

    const scoreRaw = Number(body.score || 0);
    const totalRaw = Number(body.total || 0);
    const percentRaw = Number(body.percent || 0);
    const score = Number.isFinite(scoreRaw) ? scoreRaw : 0;
    const total = Number.isFinite(totalRaw) ? totalRaw : 0;
    const percent = Number.isFinite(percentRaw) ? percentRaw : 0;

    if (total <= 0) {
      return res.status(400).json({ error: 'Invalid quiz result payload' });
    }

    const result = await db.collection('quiz_results').insertOne({
      score,
      total,
      percent,
      source: 'web',
      createdAt: new Date()
    });

    return res.status(200).json({ ok: true, id: String(result.insertedId) });
  } catch (err) {
    console.error('Quiz API error:', err.message);
    return res.status(500).json({ error: 'Unable to save quiz result' });
  }
});

app.get('/api/reminders', async (req, res) => {
  setCors(res);
  try {
    const db = await getDb();
    const reminders = await db
      .collection('reminders')
      .find({}, { projection: { _id: 0, fullName: 1, phone: 1, channel: 1, nextRunAt: 1, endAt: 1, recurrence: 1, message: 1, status: 1, deliveryStatus: 1, sentCount: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ nextRunAt: 1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ reminders });
  } catch (err) {
    console.error('Reminders GET API error:', err.message);
    return res.status(500).json({ error: 'Unable to fetch reminders' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

function startServer(port, retriesLeft) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }
    throw err;
  });
}

async function pollDueReminders() {
  try {
    const db = cachedDb || (usingInMemoryDb ? memoryDb : null);
    if (!db) return;
    const now = new Date();
    const due = await db.collection('reminders').find({ status: 'pending', nextRunAt: { $lte: now } }).limit(50).toArray();
    for (const item of due) {
      await db.collection('reminders').updateOne(
        { _id: item._id, status: 'pending' },
        { $set: { status: 'sending', deliveryStatus: 'sending', updatedAt: new Date() } }
      );

      const toPhone = normalizePhone(item.phone);
      const twilioReady = await ensureTwilioReady();

      if (!twilioReady || !toPhone) {
        await db.collection('reminders').updateOne(
          { _id: item._id },
          {
            $set: {
              status: 'failed',
              deliveryStatus: twilioReady ? 'not_configured' : 'auth_failed',
              updatedAt: new Date(),
              error: twilioReady ? 'Phone missing or invalid' : (twilioAuthError || 'Twilio authentication failed')
            }
          }
        );
        console.log(`[Reminder skipped] ${item.fullName} - ${twilioReady ? 'Phone missing or invalid' : 'Twilio auth failed'}`);
        continue;
      }

      try {
        await twilioClient.messages.create({
          body: item.message,
          from: twilioFrom,
          to: toPhone
        });

        const sentCount = Number(item.sentCount || 0) + 1;
        const nextRunAt = addIstDays(item.nextRunAt, 1);
        const isLastRun = nextRunAt.getTime() > new Date(item.endAt || '2026-05-10T08:00:00+05:30').getTime();

        await db.collection('reminders').updateOne(
          { _id: item._id },
          {
            $set: {
              status: isLastRun ? 'completed' : 'pending',
              deliveryStatus: 'sent',
              nextRunAt: isLastRun ? item.nextRunAt : nextRunAt,
              sentAt: new Date(),
              updatedAt: new Date()
            },
            $inc: { sentCount: 1 }
          }
        );
        console.log(`[Reminder sent] ${item.fullName} ${item.phone} -> ${item.message}`);
      } catch (sendErr) {
        await db.collection('reminders').updateOne(
          { _id: item._id },
          { $set: { status: 'failed', deliveryStatus: 'failed', updatedAt: new Date(), error: sendErr.message } }
        );
        console.error(`[Reminder failed] ${item.fullName} ${item.phone}:`, sendErr.message);
      }
    }
  } catch (err) {
    console.error('Reminder poll error:', err.message);
  }
}

if (require.main === module) {
  setInterval(pollDueReminders, 60000);
  startServer(PORT, 10);
}

module.exports = app;
