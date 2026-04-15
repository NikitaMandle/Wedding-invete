/* ═══════════════════════════════════════════
   NIKHIL & PRACHI WEDDING — script.js
═══════════════════════════════════════════ */

const NVIDIA_API_KEY = "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";

const WEDDING_CONTEXT = `You are a friendly wedding assistant for Nikhil and Prachi's wedding. Answer questions warmly and helpfully. Here is all the wedding information:

COUPLE: Nikhil & Prachi
WEDDING DATE: 10 May 2026

EVENTS:
1. Mehndi Ceremony — 8 May 2026, 4:00 PM onwards, Sweta Lawn, Nigdi, Pune. Dress: Yellow/Green Traditional
2. Sangeet Night — 9 May 2026, 7:00 PM onwards, Sweta Lawn, Nigdi, Pune. Dress: Cocktail/Festive Colourful
3. Wedding Ceremony — 10 May 2026, 11:00 AM, Sweta Lawn, Nigdi, Pune. Dress: Traditional/Formal
4. Wedding Reception — 10 May 2026, 7:00 PM onwards, Sweta Lawn, Nigdi, Pune. Dress: Ethnic/Formal Elegant

VENUE: Sweta Lawn, Mata Amritanandamayi Math, Nigdi, Pune - 411044, Maharashtra, India
GOOGLE MAPS: https://maps.google.com/?q=Mata+Amritanandamayi+Math+Nigdi+Pune

OUR STORY:
- 2021: Nikhil and Prachi began their journey, building a relationship filled with shared memories, laughter and dreams
- 2023: Nikhil proposed and Prachi said yes
- 2026: They are getting married on 10 May 2026

RSVP: Guests can fill the RSVP form on the website to confirm attendance.

Keep answers short, warm and helpful. Use emojis occasionally. If asked something not related to the wedding, politely redirect to wedding topics.`;

// ── LOADER ──────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const petalContainer = document.getElementById('loader-petals');
  const emojis = ['🌹','🌸','🌺','🌷','✿','❀'];

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'loader-petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (Math.random() * 1.2 + 0.7) + 'rem';
    p.style.animationDuration = (Math.random() * 4 + 4) + 's';
    p.style.animationDelay = (Math.random() * 3) + 's';
    petalContainer.appendChild(p);
  }

  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) { progress = 100; clearInterval(iv); }
    bar.style.width = progress + '%';
  }, 100);

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      initReveal();
      initCountdown();
      initParticles();
      autoPlayMusic();
    }, 900);
  }, 2600);
})();

// ── AUTO PLAY MUSIC ──────────────────────────
function autoPlayMusic() {
  const audio = document.getElementById('bg-music');
  audio.volume = 0.35;
  const tryPlay = () => {
    audio.play().then(() => {
      musicOn = true;
      document.getElementById('music-btn').classList.add('playing');
      document.getElementById('music-btn').textContent = '⏸';
    }).catch(() => {});
  };
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
  tryPlay();
}

// ── PARTICLES ───────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    dx: (Math.random() - 0.5) * 0.28, dy: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.45 + 0.08,
    color: Math.random() > 0.5 ? '#C9A84C' : '#C41E3A'
  }));
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
}

// ── SCROLL REVEAL ────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed', 'visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal-section, .fade-up').forEach(el => obs.observe(el));
}

// ── COUNTDOWN ───────────────────────────────
function initCountdown() {
  const target = new Date('2026-05-10T11:00:00+05:30').getTime();
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00'); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
}

// ── TOP NAV ──────────────────────────────────
function toggleMenu() {
  document.getElementById('nav-drawer').classList.toggle('open');
  document.getElementById('nav-overlay').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('nav-drawer').classList.remove('open');
  document.getElementById('nav-overlay').classList.remove('open');
}
window.addEventListener('scroll', () => {
  document.getElementById('top-nav').classList.toggle('scrolled', window.scrollY > 40);
});

// ── GALLERY TABS ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gtab').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.gtab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;
      document.querySelectorAll('.g-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

// ── LIGHTBOX ─────────────────────────────────
const lbBgs = ['#3d0808','#1a0303','#3d2d0d','#0d1a3d','#0d3d0d','#2d0d3d'];
const lbLabels = ['Pre-Wedding 1','Pre-Wedding 2','Engagement','Pre-Wedding 3','Celebration','Joy'];
let lbIdx = 0;
function openLightbox(i) { lbIdx = i; showLb(); document.getElementById('lightbox').classList.remove('hidden'); }
function showLb() {
  const el = document.getElementById('lb-img');
  el.style.cssText = 'background:' + lbBgs[lbIdx] + ';display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.85rem;';
  el.textContent = lbLabels[lbIdx];
}
function closeLightbox() { document.getElementById('lightbox').classList.add('hidden'); }
function lbPrev() { lbIdx = (lbIdx - 1 + lbBgs.length) % lbBgs.length; showLb(); }
function lbNext() { lbIdx = (lbIdx + 1) % lbBgs.length; showLb(); }
document.querySelectorAll('.g-item').forEach((el, i) => el.addEventListener('click', () => openLightbox(i)));

// ── RSVP ─────────────────────────────────────
function submitRSVP(e) {
  e.preventDefault();
  document.getElementById('rsvp-form').classList.add('hidden');
  document.getElementById('rsvp-success').classList.remove('hidden');
}

// ── WISHES ───────────────────────────────────
function toggleWishForm() { document.getElementById('wish-form-wrap').classList.toggle('hidden'); }
function addWish() {
  const name = document.getElementById('wish-name').value.trim();
  const msg  = document.getElementById('wish-msg').value.trim();
  if (!name || !msg) return;
  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = '<div class="wish-quote">&#10077;</div><p class="wish-text">' + msg + '</p><p class="wish-author">— ' + name + '</p>';
  document.getElementById('wishes-list').prepend(card);
  document.getElementById('wish-name').value = '';
  document.getElementById('wish-msg').value  = '';
  document.getElementById('wish-form-wrap').classList.add('hidden');
}

// ── MUSIC ─────────────────────────────────────
let musicOn = false;
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-btn');
  if (musicOn) {
    audio.pause(); btn.textContent = '🎵'; btn.classList.remove('playing'); musicOn = false;
  } else {
    audio.play().catch(() => {}); btn.textContent = '⏸'; btn.classList.add('playing'); musicOn = true;
  }
}

// ── SHARE ─────────────────────────────────────
function shareInvite() {
  const data = { title: 'Nikhil & Prachi Wedding', text: "You're invited to our wedding on 10 May 2026! 💍", url: window.location.href };
  if (navigator.share) { navigator.share(data); }
  else { navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!')).catch(() => {}); }
}

// ── SCROLL TOP ────────────────────────────────
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── CHATBOT ───────────────────────────────────
let chatOpen = false;
let chatHistory = [];

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatbot-window').classList.toggle('open', chatOpen);
  if (chatOpen) document.getElementById('chat-input').focus();
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  const typingId = appendTyping();

  try {
    const messages = [
      { role: 'system', content: WEDDING_CONTEXT },
      ...chatHistory.slice(-8)
    ];

    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + NVIDIA_API_KEY
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      })
    });

    removeTyping(typingId);

    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const reply = data.choices[0].message.content;
    chatHistory.push({ role: 'assistant', content: reply });
    appendMsg(reply, 'bot');
  } catch (err) {
    removeTyping(typingId);
    appendMsg("I'm having trouble connecting right now. Please try again or scroll down to find the information you need! 🌹", 'bot');
  }
}

function appendMsg(text, role) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + role;
  div.innerHTML = '<div class="msg-bubble">' + text.replace(/\n/g,'<br/>') + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping() {
  const msgs = document.getElementById('chat-messages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg bot msg-typing';
  div.id = id;
  div.innerHTML = '<div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
