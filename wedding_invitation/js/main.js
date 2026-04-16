/**
 * Wedding Invitation — main.js
 * Nikhil & Prachi · May 18, 2025
 * Pure vanilla JS, no external libraries
 */

'use strict';

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(212,175,55,',   // gold
    'rgba(255,215,0,',    // bright gold
    'rgba(232,200,74,',   // mid gold
    'rgba(106,13,13,',    // maroon
    'rgba(255,255,255,',  // white
  ];

  const particles = Array.from({ length: 60 }, () => ({
    x:    Math.random() * window.innerWidth,
    y:    Math.random() * window.innerHeight,
    r:    Math.random() * 3 + 1,
    dx:   (Math.random() - 0.5) * 0.6,
    dy:   (Math.random() - 0.5) * 0.6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   PETAL FALLING
   ============================================================ */
function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left            = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 5 + 6) + 's';
    petal.style.animationDelay  = (Math.random() * 8) + 's';
    petal.style.width           = (Math.random() * 8 + 8) + 'px';
    petal.style.height          = (Math.random() * 10 + 12) + 'px';
    petal.style.opacity         = (Math.random() * 0.5 + 0.4).toString();
    petal.style.transform       = 'rotate(' + (Math.random() * 360) + 'deg)';
    container.appendChild(petal);
  }
}

/* ============================================================
   ENVELOPE ANIMATION SEQUENCE
   ============================================================ */
function startEnvelopeSequence() {
  const entryScreen   = document.getElementById('entry-screen');
  const envelopeScreen = document.getElementById('envelope-screen');
  const envFlap       = document.getElementById('env-flap');
  const envCard       = document.getElementById('env-card');
  const goldenBurst   = document.getElementById('golden-burst');
  const mainSite      = document.getElementById('main-site');
  const floatingBtns  = document.getElementById('floating-btns');

  // Step 1: swap screens
  entryScreen.classList.add('hidden');
  envelopeScreen.classList.remove('hidden');

  // Step 2: open flap
  setTimeout(() => {
    envFlap.classList.add('open');
  }, 500);

  // Step 3: slide up inner card
  setTimeout(() => {
    envCard.classList.add('visible');
  }, 1500);

  // Step 4: golden burst
  setTimeout(() => {
    goldenBurst.classList.add('active');
  }, 2500);

  // Step 5: reveal main site
  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    mainSite.classList.remove('hidden');
    if (floatingBtns) floatingBtns.style.display = 'flex';
    document.body.style.overflow = 'auto';
    initScrollObserver();
  }, 3500);
}

/* ============================================================
   COUNTDOWN TIMER  (target: May 18 2025 10:00 AM IST = UTC+5:30)
   ============================================================ */
function initCountdown() {
  const TARGET = new Date('2025-05-18T10:00:00+05:30').getTime();

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    elDays.textContent  = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(mins);
    elSecs.textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar   = document.getElementById('navbar');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Add 'scrolled' class on scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
function initScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   EVENT MODAL
   ============================================================ */
const EVENT_DATA = {
  haldi: {
    icon:   '🌼',
    title:  'Haldi Ceremony',
    time:   'May 15, 2025 · 10:00 AM',
    venue:  'Groom\'s Residence, FC Road, Pune',
    dress:  'Yellow / Traditional Indian',
    mapUrl: 'https://maps.google.com/?q=FC+Road+Pune',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+Ceremony+-+Nikhil+%26+Prachi&dates=20250515T100000/20250515T130000&location=Pune',
  },
  mehendi: {
    icon:   '🌿',
    title:  'Mehendi Night',
    time:   'May 16, 2025 · 4:00 PM',
    venue:  'Bride\'s Residence, Kothrud, Pune',
    dress:  'Green / Ethnic Wear',
    mapUrl: 'https://maps.google.com/?q=Kothrud+Pune',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehendi+Night+-+Nikhil+%26+Prachi&dates=20250516T160000/20250516T210000&location=Pune',
  },
  sangeet: {
    icon:   '🎶',
    title:  'Sangeet Ceremony',
    time:   'May 17, 2025 · 7:00 PM',
    venue:  'Royal Banquet Hall, Baner, Pune',
    dress:  'Cocktail / Festive Wear',
    mapUrl: 'https://maps.google.com/?q=Baner+Pune',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+-+Nikhil+%26+Prachi&dates=20250517T190000/20250517T230000&location=Pune',
  },
  wedding: {
    icon:   '💍',
    title:  'Wedding Ceremony',
    time:   'May 18, 2025 · 10:00 AM',
    venue:  'Shree Mangal Karyalay, Shivajinagar, Pune – 411005',
    dress:  'Traditional / Formal Indian Wear',
    mapUrl: 'https://maps.google.com/?q=Shivajinagar+Pune',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikhil+%26+Prachi+Wedding&dates=20250518T100000/20250518T230000&location=Pune',
  },
  reception: {
    icon:   '🥂',
    title:  'Wedding Reception',
    time:   'May 18, 2025 · 7:00 PM',
    venue:  'The Grand Palace, Koregaon Park, Pune',
    dress:  'Formal / Ethnic Wear',
    mapUrl: 'https://maps.google.com/?q=Koregaon+Park+Pune',
    calUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reception+-+Nikhil+%26+Prachi&dates=20250518T190000/20250518T230000&location=Pune',
  },
};

function openEventDetail(name) {
  const data  = EVENT_DATA[name];
  const modal = document.getElementById('event-modal');
  if (!data || !modal) return;

  document.getElementById('modal-icon').textContent  = data.icon;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-time').textContent  = data.time;
  document.getElementById('modal-venue').textContent = data.venue;
  document.getElementById('modal-dress').textContent = data.dress;
  document.getElementById('modal-map-btn').href      = data.mapUrl;
  document.getElementById('modal-cal-btn').href      = data.calUrl;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeEventDetail() {
  const modal = document.getElementById('event-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEventDetail();
    closeLightbox();
  }
});

/* ============================================================
   GALLERY TABS
   ============================================================ */
function initGalleryTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const items   = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const LIGHTBOX_ITEMS = [
  { label: 'Pre-Wedding 1',  cls: 'gp1' },
  { label: 'Pre-Wedding 2',  cls: 'gp2' },
  { label: 'Engagement',     cls: 'gp3' },
  { label: 'Pre-Wedding 3',  cls: 'gp4' },
  { label: 'Haldi Ceremony', cls: 'gp5' },
  { label: 'Mehendi Night',  cls: 'gp6' },
];

let lbIndex = 0;

function openLightbox(index) {
  lbIndex = index;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  renderLightboxItem();
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('hidden');
  document.body.style.overflow = '';
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length;
  renderLightboxItem();
}

function lbNext() {
  lbIndex = (lbIndex + 1) % LIGHTBOX_ITEMS.length;
  renderLightboxItem();
}

function renderLightboxItem() {
  const wrap = document.getElementById('lb-img-wrap');
  if (!wrap) return;
  const item = LIGHTBOX_ITEMS[lbIndex];
  wrap.innerHTML = `
    <div class="gallery-placeholder ${item.cls}" style="width:100%;height:100%;border-radius:16px;font-size:1rem;">
      <span>${item.label}</span>
    </div>`;
}

/* ============================================================
   RSVP FORM
   ============================================================ */
function submitRSVP(event) {
  event.preventDefault();
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');
  if (form)    form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
}

/* ============================================================
   WISHES
   ============================================================ */
function openWishForm() {
  const wrap = document.getElementById('wish-form-wrap');
  if (!wrap) return;
  wrap.classList.toggle('hidden');
  if (!wrap.classList.contains('hidden')) {
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function addWish() {
  const nameEl = document.getElementById('wish-name');
  const msgEl  = document.getElementById('wish-msg');
  const grid   = document.getElementById('wishes-grid');

  if (!nameEl || !msgEl || !grid) return;

  const name = nameEl.value.trim();
  const msg  = msgEl.value.trim();

  if (!name || !msg) {
    alert('Please enter your name and message.');
    return;
  }

  const card = document.createElement('div');
  card.className = 'wish-card fade-up visible';
  card.innerHTML = `
    <p class="wish-text">"${msg}"</p>
    <p class="wish-author">— ${name}</p>`;

  grid.prepend(card);

  // Reset form
  nameEl.value = '';
  msgEl.value  = '';
  document.getElementById('wish-form-wrap').classList.add('hidden');
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-btn');
  if (!audio) return;

  if (audio.paused) {
    audio.play().catch(() => {});
    if (btn) btn.textContent = '🔊';
  } else {
    audio.pause();
    if (btn) btn.textContent = '🎵';
  }
}

/* ============================================================
   SHARE INVITE
   ============================================================ */
function shareInvite() {
  const shareData = {
    title: 'Nikhil & Prachi Wedding Invitation',
    text:  "You're invited to Nikhil & Prachi's Wedding on May 18, 2025 in Pune!",
    url:   window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Invitation link copied to clipboard! 📋'))
      .catch(() => alert('Share this link: ' + window.location.href));
  }
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   ENTRY BUTTON
   ============================================================ */
function initEntryButton() {
  const btn = document.getElementById('open-btn');
  if (btn) {
    btn.addEventListener('click', startEnvelopeSequence);
  }
}

/* ============================================================
   DOMContentLoaded — INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scroll while on entry screen
  document.body.style.overflow = 'hidden';

  // Hide floating buttons until main site is shown
  const floatingBtns = document.getElementById('floating-btns');
  if (floatingBtns) floatingBtns.style.display = 'none';

  initParticles();
  initPetals();
  initCountdown();
  initNavbar();
  initSmoothScroll();
  initGalleryTabs();
  initEntryButton();

  // Scroll observer runs after main site is revealed (called in startEnvelopeSequence)
  // But also init here in case user lands directly on main site (dev mode)
  const mainSite = document.getElementById('main-site');
  if (mainSite && !mainSite.classList.contains('hidden')) {
    initScrollObserver();
    if (floatingBtns) floatingBtns.style.display = 'flex';
    document.body.style.overflow = 'auto';
  }
});

// Expose globals for inline onclick handlers in HTML
window.openEventDetail  = openEventDetail;
window.closeEventDetail = closeEventDetail;
window.openLightbox     = openLightbox;
window.closeLightbox    = closeLightbox;
window.lbPrev           = lbPrev;
window.lbNext           = lbNext;
window.submitRSVP       = submitRSVP;
window.openWishForm     = openWishForm;
window.addWish          = addWish;
window.toggleMusic      = toggleMusic;
window.shareInvite      = shareInvite;
window.scrollToTop      = scrollToTop;
