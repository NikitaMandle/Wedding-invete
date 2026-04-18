/* NIKHIL & PRACHI — script.js */
'use strict';

function el(id){ return document.getElementById(id); }
function safe(fn){ try{ return fn(); }catch(e){ console.warn(e); } }

document.addEventListener('DOMContentLoaded', function(){

  // ── CANVAS PARTICLES ──
  function mkCanvas(id,n,cols){
    const cv=el(id); if(!cv)return;
    const ctx=cv.getContext('2d');
    function resize(){ cv.width=cv.offsetWidth||window.innerWidth; cv.height=cv.offsetHeight||window.innerHeight; }
    resize(); window.addEventListener('resize',resize);
    const pts=Array.from({length:n},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.8+0.3,dx:(Math.random()-.5)*.28,dy:(Math.random()-.5)*.28,a:Math.random()*.45+.08,ph:Math.random()*Math.PI*2,c:cols[Math.floor(Math.random()*cols.length)]}));
    (function draw(){ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.ph+=.018;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.globalAlpha=p.a*(.7+.3*Math.sin(p.ph));ctx.fill();p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>cv.width)p.dx*=-1;if(p.y<0||p.y>cv.height)p.dy*=-1;});ctx.globalAlpha=1;requestAnimationFrame(draw);})();
  }

  // ── PETALS ──
  function mkPetals(id,n){
    const c=el(id); if(!c)return;
    const em=['🌹','🌸','🌺','🌷','✿','❀'];
    for(let i=0;i<n;i++){const p=document.createElement('div');p.className='ep';p.textContent=em[Math.floor(Math.random()*em.length)];p.style.left=(Math.random()*100)+'%';p.style.fontSize=(Math.random()*.8+.6)+'rem';p.style.animationDuration=(Math.random()*5+5)+'s';p.style.animationDelay=(Math.random()*4)+'s';c.appendChild(p);}
  }

  // ── SHOW MAIN ──
  function showMain(){
    const main=el('main'); if(!main)return;
    main.style.display='block'; main.style.opacity='0'; main.style.transition='opacity 0.7s';
    main.classList.remove('hidden');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ main.style.opacity='1'; }));
    initMain();
  }

  // ── INVITATION CARD ──
  function showPhoto(){
    const screen=el('photo-reveal');
    if(!screen){ showMain(); return; }
    screen.style.display='flex'; screen.style.opacity='1'; screen.style.visibility='visible';
    screen.classList.remove('hidden');
    requestAnimationFrame(()=>safe(()=>mkCanvas('pc',60,['#C9A84C','#C41E3A','#8B1A2A','#E8C97A'])));
    const pp=el('pp');
    if(pp){ const em=['🌹','🌸','🌺','🌷','✿']; for(let i=0;i<12;i++){const p=document.createElement('div');p.className='ep';p.textContent=em[Math.floor(Math.random()*em.length)];p.style.left=(Math.random()*100)+'%';p.style.fontSize=(Math.random()*.6+.5)+'rem';p.style.animationDuration=(Math.random()*6+6)+'s';p.style.animationDelay=(Math.random()*5)+'s';pp.appendChild(p);} }
    const btn=el('photo-cta-btn');
    if(btn) btn.addEventListener('click',startEnvelope);
  }

  // ── ENVELOPE ──
  function startEnvelope(){
    const photo=el('photo-reveal'), env=el('envelope');
    if(!env){ showMain(); return; }
    safe(()=>playMusic());
    if(photo){ photo.style.transition='opacity 0.5s'; photo.style.opacity='0'; }
    setTimeout(()=>{
      if(photo) photo.style.display='none';
      env.style.display='flex'; env.style.opacity='0'; env.style.transition='opacity 0.5s';
      env.classList.remove('hidden');
      safe(()=>mkCanvas('envc',45,['#C9A84C','#C41E3A']));
      safe(()=>mkPetals('envp',14));
      setTimeout(()=>{ env.style.opacity='1'; },50);
      setTimeout(()=>{ safe(()=>el('eflap').classList.add('open')); safe(()=>el('eseal').classList.add('gone')); },700);
      setTimeout(()=>safe(()=>el('ecrev').classList.add('up')),1900);
      setTimeout(()=>safe(()=>el('eburst').classList.add('on')),2700);
      setTimeout(()=>{ env.style.opacity='0'; setTimeout(()=>{ env.style.display='none'; showMain(); },600); },3700);
    },500);
  }

  // ── LOADER ──
  function initLoader(){
    const loader=el('loader');
    if(!loader){ showPhoto(); return; }
    safe(()=>mkCanvas('lc',50,['#C9A84C','#C41E3A','#E8C97A','#8B1A2A']));
    let done=false;
    function exitNow(){
      if(done)return; done=true;
      loader.style.transition='opacity 0.6s'; loader.style.opacity='0';
      setTimeout(()=>{ loader.style.display='none'; showPhoto(); },650);
    }
    setTimeout(exitNow,2500);
    setTimeout(exitNow,4500);
  }

  // ── MAIN INIT ──
  function initMain(){
    safe(()=>mkCanvas('hc',60,['#C9A84C','#C41E3A','#8B1A2A']));
    initCountdown(); initReveal(); initNav(); initGallery(); initGalleryAccessGate(); initStoryCardsPreview(); initWishes();
  }

  // ── COUNTDOWN ──
  function initCountdown(){
    const target=new Date('2026-05-10T11:00:00+05:30').getTime();
    function tick(){
      const diff=target-Date.now(); if(diff<=0)return;
      const set=(id,v)=>{ const e=el(id); if(e) e.textContent=String(v).padStart(2,'0'); };
      set('cd-d',Math.floor(diff/86400000)); set('cd-h',Math.floor((diff%86400000)/3600000));
      set('cd-m',Math.floor((diff%3600000)/60000)); set('cd-s',Math.floor((diff%60000)/1000));
    }
    tick(); setInterval(tick,1000);
  }

  // ── SCROLL REVEAL ──
  function initReveal(){
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:.07});
    document.querySelectorAll('.reveal,.reveal-child').forEach(e=>obs.observe(e));
  }

  // ── NAV ──
  function initNav(){
    window.addEventListener('scroll',()=>{
      safe(()=>el('nav').classList.toggle('solid',window.scrollY>50));
      const fab=el('fab-top-btn');
      if(fab) fab.style.display=window.scrollY>300?'flex':'none';
    });
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{ const t=document.querySelector(a.getAttribute('href')); if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});} });
    });
  }
  window.openNav  = function(){ safe(()=>{ el('nav-panel').classList.add('open');    document.body.style.overflow='hidden'; }); };
  window.closeNav = function(){ safe(()=>{ el('nav-panel').classList.remove('open'); document.body.style.overflow=''; }); };

  // ── GALLERY ──
  function initGallery(){
    document.querySelectorAll('.gt').forEach(btn=>{
      btn.addEventListener('click', function(){
        applyGalleryFilter(this.dataset.c || 'all');
      });
    });
    applyGalleryFilter('all');
  }

  let galleryItems = [];
  let lbTileIndex = 0;
  let lbSlideIndex = 0;
  let lbSlides = [];

  function applyGalleryFilter(category){
    const cat = category || 'all';
    document.querySelectorAll('.gt').forEach((btn)=>{
      btn.classList.toggle('active', (btn.dataset.c || 'all') === cat);
    });
    const grid = el('gg');
    if(!grid) return;
    grid.querySelectorAll('.gi').forEach((item)=>{
      item.style.display = (cat === 'all' || item.dataset.c === cat) ? '' : 'none';
    });
  }

  function renderGalleryItems(items){
    const grid = el('gg');
    const note = el('gallery-note');
    if(!grid) return;

    galleryItems = Array.isArray(items) ? items : [];
    grid.innerHTML = '';

    galleryItems.forEach((item, index)=>{
      const gi = document.createElement('div');
      gi.className = item && item.size === 'lg' ? 'gi gi-lg' : 'gi';
      gi.dataset.c = item && item.category ? item.category : 'all';
      gi.addEventListener('click', ()=>openLb(index));

      const gp = document.createElement('div');
      const tileClass = item && item.tileClass ? item.tileClass : 'gp1';
      gp.className = 'gp ' + tileClass;

      const firstSlide = item && Array.isArray(item.slides) ? item.slides[0] : null;
      const coverImage = firstSlide && firstSlide.imageUrl ? firstSlide.imageUrl : (item && item.tileImage ? item.tileImage : '');
      if(coverImage){
        gp.style.backgroundImage = 'url("' + coverImage + '")';
        gp.style.backgroundSize = 'cover';
        gp.style.backgroundPosition = 'center';
      }

      const overlay = document.createElement('div');
      overlay.className = 'gp-overlay';
      overlay.innerHTML = '<span class="gp-label">'+escapeHtml((item && item.tileLabel) || 'Memory')+'</span><span class="gp-icon">🔍</span>';
      gp.appendChild(overlay);

      gi.appendChild(gp);
      grid.appendChild(gi);
    });

    applyGalleryFilter('all');
    if(note){
      note.textContent = galleryItems.length
        ? 'Private gallery unlocked.'
        : 'No gallery items available yet.';
    }
  }

  function openLb(tileIndex){
    if(!galleryUnlocked || !galleryItems.length) return;

    lbTileIndex = tileIndex;
    const selectedItem = galleryItems[lbTileIndex] || {};
    const slides = Array.isArray(selectedItem.slides) ? selectedItem.slides : [];

    lbSlides = slides.length ? slides : [{
      label: selectedItem.lightboxLabel || selectedItem.tileLabel || 'Memory',
      bg: selectedItem.bg || '#3d0808',
      imageUrl: selectedItem.tileImage || ''
    }];
    lbSlideIndex = 0;

    showLb();
    const lb = el('lb');
    if(lb){
      lb.classList.remove('hidden');
      lb.style.display = 'flex';
      lb.setAttribute('aria-hidden', 'false');
    }
  }

  function showLb(){
    if(!lbSlides.length) return;

    const tile = galleryItems[lbTileIndex] || {};
    const slide = lbSlides[lbSlideIndex] || {};
    const lbImg = el('lb-img');
    if(lbImg){
      const fallbackBg = (slide && slide.bg) || (tile && tile.bg) || '#3d0808';
      const imageUrl = slide && slide.imageUrl ? slide.imageUrl : '';
      lbImg.style.backgroundColor = fallbackBg;
      lbImg.style.backgroundImage = imageUrl ? 'url("'+imageUrl+'")' : 'none';
      lbImg.style.backgroundSize = 'cover';
      lbImg.style.backgroundPosition = 'center';
      lbImg.style.backgroundRepeat = 'no-repeat';
      lbImg.textContent = imageUrl ? '' : ((slide && slide.label) || (tile && tile.lightboxLabel) || 'Memory');
    }

    const caption = el('lb-caption');
    if(caption){
      caption.textContent = (tile && tile.tileLabel ? tile.tileLabel + ' - ' : '') + ((slide && slide.label) || (tile && tile.lightboxLabel) || 'Memory');
    }

    const counter = el('lb-counter');
    if(counter){
      counter.textContent = (lbSlideIndex + 1) + ' / ' + lbSlides.length;
    }
  }

  window.closeLb = function(){
    const lb = el('lb');
    if(lb){
      lb.classList.add('hidden');
      lb.style.display = 'none';
      lb.setAttribute('aria-hidden', 'true');
    }
    lbSlides = [];
    lbSlideIndex = 0;
  };

  window.lbP = function(){
    if(!lbSlides.length) return;
    lbSlideIndex = (lbSlideIndex - 1 + lbSlides.length) % lbSlides.length;
    showLb();
  };

  window.lbN = function(){
    if(!lbSlides.length) return;
    lbSlideIndex = (lbSlideIndex + 1) % lbSlides.length;
    showLb();
  };

  window.openLb = openLb;

  let galleryUnlocked = false;
  let galleryPromptShown = false;
  let galleryGateObserver = null;

  function setGalleryLockedState(locked){
    const gallery = el('s-gallery');
    if(!gallery) return;
    gallery.classList.toggle('gallery-locked', locked);
  }

  function showGalleryGate(){
    if(galleryUnlocked) return;
    const gate = el('gallery-gate');
    if(!gate) return;
    gate.classList.remove('hidden');
    gate.style.display = 'flex';
    gate.setAttribute('aria-hidden', 'false');
  }

  function hideGalleryGate(){
    const gate = el('gallery-gate');
    if(!gate) return;
    gate.classList.add('hidden');
    gate.style.display = 'none';
    gate.setAttribute('aria-hidden', 'true');
  }

  function vanishGalleryGateWithPetals(){
    const gate = el('gallery-gate');
    if(!gate){
      hideGalleryGate();
      return Promise.resolve();
    }

    const card = gate.querySelector('.gallery-gate-card');
    if(!card){
      hideGalleryGate();
      return Promise.resolve();
    }

    const petalsWrap = document.createElement('div');
    petalsWrap.className = 'gallery-gate-petal-burst';
    const petalChars = ['🌸','🌺','🌹','✿','❀','🌷'];

    for(let i=0;i<18;i++){
      const p = document.createElement('span');
      p.className = 'gate-petal';
      p.textContent = petalChars[Math.floor(Math.random()*petalChars.length)];
      p.style.setProperty('--dx', (Math.random()*220 - 110).toFixed(0) + 'px');
      p.style.setProperty('--dy', (-80 - Math.random()*180).toFixed(0) + 'px');
      p.style.setProperty('--rot', (Math.random()*480 - 240).toFixed(0) + 'deg');
      p.style.setProperty('--dur', (700 + Math.random()*450).toFixed(0) + 'ms');
      p.style.setProperty('--delay', (Math.random()*120).toFixed(0) + 'ms');
      p.style.setProperty('--size', (0.8 + Math.random()*0.7).toFixed(2) + 'rem');
      petalsWrap.appendChild(p);
    }

    gate.appendChild(petalsWrap);
    card.classList.add('gate-vanish');

    return new Promise((resolve)=>{
      setTimeout(()=>{
        card.classList.remove('gate-vanish');
        petalsWrap.remove();
        hideGalleryGate();
        resolve();
      }, 980);
    });
  }

  async function postGalleryApi(endpoint, payload){
    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const urls = ['/api/' + endpoint];

    if(isLocalHost){
      [3000, 3001, 3002, 3003, 3004, 3005].forEach((port)=>{
        const candidate = 'http://localhost:' + port + '/api/' + endpoint;
        if(!urls.includes(candidate)) urls.push(candidate);
      });
    }

    let lastError = null;
    for(const url of urls){
      try{
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if(!res.ok){
          if(res.status === 404) continue;
          throw new Error('Request failed with status ' + res.status);
        }

        return await res.json();
      }catch(err){
        lastError = err;
      }
    }

    if(lastError) throw lastError;
    throw new Error('No reachable gallery API endpoint');
  }

  async function loadGalleryForPhone(phone){
    const data = await postGalleryApi('gallery/items', { phone });
    if(!data || !data.authorized){
      return false;
    }

    renderGalleryItems(Array.isArray(data.items) ? data.items : []);
    return true;
  }

  async function verifyGalleryAccessInternal(){
    if(galleryUnlocked) return;

    const phoneEl = el('gallery-phone');
    const msgEl = el('gallery-gate-msg');
    const btn = el('gallery-verify-btn');
    const phoneRaw = phoneEl ? phoneEl.value : '';
    const phone = String(phoneRaw || '').trim();

    if(msgEl) msgEl.textContent = '';
    if(!phone || phone.replace(/\D+/g,'').length < 10){
      if(msgEl) msgEl.textContent = 'Please enter a valid mobile number.';
      return;
    }

    if(btn){
      btn.disabled = true;
      btn.textContent = 'Checking...';
    }

    try{
      const authorized = await loadGalleryForPhone(phone);
      if(authorized){
        galleryUnlocked = true;
        setGalleryLockedState(false);
        if(galleryGateObserver) galleryGateObserver.disconnect();
        await vanishGalleryGateWithPetals();
        return;
      }

      setGalleryLockedState(true);
      showGalleryGate();
      if(msgEl) msgEl.textContent = 'This number does not have gallery access.';
    }catch(_err){
      setGalleryLockedState(true);
      showGalleryGate();
      if(msgEl) msgEl.textContent = 'Unable to verify right now. Please try again.';
    }finally{
      if(btn){
        btn.disabled = false;
        btn.textContent = 'Unlock Gallery';
      }
    }
  }

  window.verifyGalleryAccess = function(e){
    if(e) e.preventDefault();
    verifyGalleryAccessInternal();
  };

  function initGalleryAccessGate(){
    const gallery = el('s-gallery');
    if(!gallery) return;

    galleryUnlocked = false;
    setGalleryLockedState(true);
    renderGalleryItems([]);

    galleryGateObserver = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(!entry.isIntersecting || galleryUnlocked) return;
        showGalleryGate();
        if(!galleryPromptShown){
          galleryPromptShown = true;
          const phoneEl = el('gallery-phone');
          if(phoneEl) setTimeout(()=>phoneEl.focus(), 180);
        }
      });
    }, { threshold: 0.35 });

    galleryGateObserver.observe(gallery);
  }

  // ── GUEST PERSONALIZATION ──
  // Usage: https://yoursite.com/?guest=Rahul+Sharma
  (function(){
    try{
      const p=new URLSearchParams(window.location.search);
      const raw=p.get('guest');
      const wt=el('welcomeText');
      if(wt && raw && raw.trim()){
        const name=decodeURIComponent(raw.trim()).replace(/\+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
        wt.textContent='Welcome '+name+' \uD83C\uDF89';
      }
    }catch(e){}
  })();

  // ── EVENT MODAL ──
  const AMRAVATI_ADDR='Rajapeth Chatrapati Sahu Nagar, Near Shitla Mata Mandir, Amravati – 444607';
  const AMRAVATI_MAP='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.0!2d77.7523!3d20.9374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd6a9e4b7c3b1a1%3A0xabc!2sRajapeth%2C+Amravati!5e0!3m2!1sen!2sin!4v1680000000000';
  const AMRAVATI_URL='https://maps.google.com/?q=Rajapeth+Chatrapati+Sahu+Nagar+Amravati';
  const PUNE_VENUE='Mata Amritanandamayi Math, Nigdi, Pune, Maharashtra - 411044';
  const PUNE_MAP='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7700!3d18.6500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e4b7c3b1a1%3A0xabc!2sNigdi%2C+Pune!5e0!3m2!1sen!2sin!4v1680000000000';
  const PUNE_URL='https://maps.google.com/?q=Mata+Amritanandamayi+Math+Nigdi+Pune';

  const EVDATA={
    // GROOM EVENTS (real data)
    g_gondhal:  {icon:'🪔',title:'Gondhal Ceremony',       date:'5 May 2026', time:'Evening',         venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Traditional Attire',        mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gondhal+Ceremony&dates=20260505T180000/20260505T220000&location=Rajapeth,+Amravati'},
    g_mehendi:  {icon:'🌿',title:'Mehendi Ceremony',       date:'6 May 2026', time:'Afternoon',        venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Casual / Traditional',       mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehendi+Ceremony&dates=20260506T140000/20260506T200000&location=Rajapeth,+Amravati'},
    g_haldi:    {icon:'🌼',title:'Haldi & Devkundi',       date:'7 May 2026', time:'Morning',          venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Yellow / White Traditional', mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+%26+Devkundi&dates=20260507T090000/20260507T140000&location=Rajapeth,+Amravati'},
    g_travel:   {icon:'�',title:'Departure to Pune',      date:'8 May 2026', time:'Morning',          venue:'Amravati → Pune',               dress:'Comfortable Travel Wear',    mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Travel+to+Pune&dates=20260508T080000/20260508T200000'},
    g_arrival:  {icon:'🏡',title:'Arrival & Preparations', date:'9 May 2026', time:'All Day',          venue:PUNE_VENUE,                      dress:'Comfortable',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Arrival+in+Pune&dates=20260509T100000/20260509T200000&location=Nigdi,+Pune'},
    g_wedding:  {icon:'💍',title:'Wedding Ceremony 💍',    date:'10 May 2026',time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Sherwani / Formal',          mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://www.google.com/maps/dir//Mata+Amritanandamayi+Math,+Nigdi+Pune,+Sector+No.+21,+Yamunagar,+Nigdi,+Sector+No.+21,+Talwade,+4AB,+Mata+Amrit+Dyan+Marg,+Kounteya+Housing+Society,+Sector+Number+21,+Yamuna+Nagar,+Nigdi,+Pimpri-Chinchwad,+Pune,+Maharashtra+411044/@18.6627487,73.7758721,17z/data=!4m16!1m7!3m6!1s0x3bc2b7623ad813e5:0x9772226b8180bf15!2sMata+Amritanandamayi+Math,+Nigdi+Pune!8m2!3d18.6627487!4d73.778447!16s%2Fg%2F1td7lrnk!4m7!1m0!1m5!1m1!1s0x3bc2b7623ad813e5:0x9772226b8180bf15!2m2!1d73.778425!2d18.6628231!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D'},
    g_return:   {icon:'🏠',title:'Return to Amravati',     date:'11 May 2026',time:'Morning',          venue:'Pune → Amravati',               dress:'Comfortable',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Return+to+Amravati&dates=20260511T080000/20260511T200000'},
    g_reception:{icon:'🥂',title:'Reception & Satyanarayan',date:'12 May 2026',time:'Evening',         venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Ethnic / Formal Elegant',    mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reception+%26+Satyanarayan&dates=20260512T170000/20260512T235900&location=Rajapeth,+Amravati'},
    g_amt2:    {icon:'🙏',title:'Satyanarayan Pooja',     date:'14 May 2026',time:'Morning',          venue:"Nikhil's Home, "+AMRAVATI_ADDR,  dress:'Traditional',                mapSrc:AMRAVATI_MAP,    mapUrl:AMRAVATI_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Satyanarayan+Pooja&dates=20260514T100000/20260514T140000&location=Rajapeth,+Amravati'},
    // BRIDE EVENTS
    b_mehndi:   {icon:'🌿',title:'Mehndi Ceremony',        date:'8 May 2026', time:'4:00 PM onwards',  venue:PUNE_VENUE,                      dress:'Yellow / Green Traditional', mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehndi+Ceremony&dates=20260508T160000/20260508T210000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_sangeet:  {icon:'🎶',title:'Sangeet Night',          date:'9 May 2026', time:'7:00 PM onwards',  venue:PUNE_VENUE,                      dress:'Cocktail / Festive Colourful',mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+Night&dates=20260509T190000/20260509T235900&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_haldi:    {icon:'🌼',title:'Haldi Ceremony',         date:'9 May 2026', time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Yellow / Floral Traditional', mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+Ceremony&dates=20260509T110000/20260509T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_wedding:  {icon:'💍',title:'Wedding Ceremony 💍',    date:'10 May 2026',time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Bridal Lehenga / Traditional',mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony&dates=20260510T110000/20260510T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_vidaai:   {icon:'🌸',title:'Vidaai',                 date:'10 May 2026',time:'2:00 PM',          venue:PUNE_VENUE,                      dress:'Bridal Attire',               mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidaai&dates=20260510T140000/20260510T160000&location=Sweta+Lawn,+Nigdi,+Pune'},
    g_pune2:    {icon:'🙏',title:'Satyanarayan Pooja',     date:'14 May 2026',time:'Morning',          venue:PUNE_VENUE,                      dress:'Traditional',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Satyanarayan+Pooja&dates=20260514T100000/20260514T140000&location=Nigdi,+Pune'},

  };

  window.openEventModal = function(key){
    const d=EVDATA[key]; if(!d)return;
    const m=el('event-modal'); if(!m)return;
    el('em-icon').textContent=d.icon; el('em-title').textContent=d.title;
    el('em-date').textContent=d.date; el('em-time').textContent=d.time;
    el('em-venue').textContent=d.venue; el('em-dress').textContent=d.dress;
    el('em-map').src=d.mapSrc; el('em-dir-btn').href=d.mapUrl; el('em-cal-btn').href=d.calUrl;
    m.classList.remove('hidden'); m.style.display='flex';
    document.body.style.overflow='hidden';
  };
  window.closeEventModal = function(){
    const m=el('event-modal'); if(!m)return;
    m.classList.add('hidden'); m.style.display='none';
    document.body.style.overflow='';
  };

  // ── TIMELINE TOGGLE (Groom / Bride) ──
  window.switchTimeline = function(side){
    const tg=el('timeline-groom'), tb=el('timeline-bride');
    const bg=el('btn-groom'), bb=el('btn-bride');
    if(!tg||!tb) return;

    const hideEl=side==='groom'?tb:tg;
    const showEl=side==='groom'?tg:tb;

    // Animate out
    hideEl.classList.add('tl-exit');
    setTimeout(()=>{
      hideEl.classList.add('hidden');
      hideEl.classList.remove('tl-exit');
      // Animate in
      showEl.classList.remove('hidden');
      showEl.classList.add('tl-enter');
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          showEl.classList.remove('tl-enter');
          showEl.classList.add('tl-visible');
          setTimeout(()=>showEl.classList.remove('tl-visible'),400);
        });
      });
    },300);

    // Toggle button states
    if(bg) bg.classList.toggle('active', side==='groom');
    if(bb) bb.classList.toggle('active', side==='bride');
  };

  // ── STORIES ──
  const STORIES = [
    {
      emoji: '💥',
      tagMr: 'कॉलेजचे दिवस',
      tagEn: 'College Days',
      titleMr: 'आमची EDC प्रॅक्टिकल स्टोरी',
      titleEn: 'Our EDC Practical Story',
      bodyMr: `खूप वर्षांपूर्वीची गोष्ट आहे… कॉलेजचे दिवस… आणि त्या दिवसांची एक खास आठवण 💫

त्या दिवशी आमचा EDC (Electronic Devices and Communication) चा प्रॅक्टिकल एक्झाम होता. खरं सांगायचं तर… मी अजिबात तयार नव्हतो 😅 डोक्यात काहीच नव्हतं… आणि थोडा टेन्शनमध्येही होतो.

सरांनी ४-५ जणांचे ग्रुप बनवले… आणि नशिबाने प्राची माझ्या ग्रुपमध्ये आली.

त्या क्षणी माझ्या मित्रांनी कानात सांगितलं,
"अरे, प्राची खूप ब्रिलियंट आहे… स्टडीमध्ये पण टॉप… आणि प्रॅक्टिकलमध्ये तर एकदम प्रो!"

बस! माझ्या चेहऱ्यावर स्माईल आली 😎
मनात विचार आला — "झालं! आता आपला प्रॅक्टिकल तर मस्त जाणार!"

प्रॅक्टिकल सुरू झाला… आणि प्राची पूर्ण कॉन्फिडन्सने लीड घेत होती. ती एकेक वायर जोडत होती, सर्किट सेट करत होती… आणि मी बाजूला उभा राहून तिच्याकडे इम्प्रेस होऊन बघत होतो 😄

पण अचानक…
ती एक वायर जोडते… आणि धाडकन! 💥
किटमधून स्पार्क आला… धूर निघायला लागला… सगळे एकदम घाबरले!

क्षणभर सगळे शॉकमध्ये… आणि मी? 😆
मी तर अजूनच इम्प्रेस झालो!

त्या सीननंतर मी लगेच माझा फोन काढला… आणि आईला कॉल केला 😜
आणि म्हटलं — "आई… बहु मिळाली!" 😂❤️

तो दिवस आजही आठवला की हसू येतं…
कारण त्या एका "स्पार्क"मध्येच आमच्या स्टोरीची सुरुवात झाली होती ✨

आजही मी तिला चिडवायला ही स्टोरी सांगतो…
पण खरं सांगायचं तर…
त्या दिवशीच्या त्या स्मोकमध्ये… मला माझं प्रेम सापडलं होतं ❤️`,
      bodyEn: `This goes back to our college days 🎓, and it is still one of our favorite memories ✨.

    On that day, we had our EDC (Electronic Devices and Communication) practical exam 🧪. Honestly, I was totally unprepared 😅 and very nervous 😬.

    Our professor made groups of 4-5 students, and luckily Prachi ended up in my group 🍀.

    My friends immediately told me, "Prachi is brilliant in studies and a pro in practicals" 😎.

    I smiled and thought, "Great, our practical is going to be smooth now!" 😌

    The practical started and she confidently took the lead, connecting wires and setting up the circuit 🔌. I was quietly standing there, already impressed 👀.

    Then suddenly... spark! 💥 Smoke started coming out of the kit and everyone panicked 😱.

    Everyone was shocked. And me? I got even more impressed 😄.

    Right after that scene, I called my mother and joked, "Maa, I found your daughter-in-law!" 😂❤️

    Even today, that memory makes us laugh 🤍. In that one spark, our story had already begun ✨.`
    },
    {
      emoji: '🌄',
      tagMr: 'पहिली ट्रिप',
      tagEn: 'First Trip Together',
      titleMr: 'चिचाटी ट्रिप आणि 5:45 ची ट्विस्ट',
      titleEn: 'Chichaati Trip and the 5:45 Twist',
      bodyMr: `तो दिवस अजूनही ताजा आहे…

मी आणि माझे मित्र सगळे मिळून अमरावतीजवळच्या प्रसिद्ध चिचाटीला जायचं ठरवलं — धबधबा, निसर्ग आणि मजा 💫

पण खरी मजा कुठे झाली माहिती आहे? 😄
मी प्राचीला चिचाटीला घेऊन गेलो… थेट उन्हाळ्यात! 🌞

जिथे पाणी असायला हवं होतं… तिथे फक्त दगड, कडक ऊन आणि कोरडं वातावरण!
आजूबाजूला काहीच नव्हतं… ना धबधबा, ना थंड हवा…

पण तरीही… त्या सगळ्या "सुक्या" वातावरणातही…
आमची company मात्र एकदम फुल ऑन enjoyable होती ❤️

परत येताना…
प्राची माझ्या बाईकवर बसली होती… संध्याकाळचे ५ वाजले होते 🌅

मी थोडा हळू चालवत होतो… आणि तिला विचारलं,
"आपण हळू गेलो तर काही problem नाही ना?"
ती म्हणाली, "हो, काही problem नाही."

मी पुन्हा विचारलं… ती पुन्हा म्हणाली, "हो ना, काही problem नाही."

थोड्यावेळाने ती म्हणाली —
"मला काहीतरी सांगायचं आहे…"

बस! 😳
माझं heart beat एकदम वाढलं…
मनात हजार विचार सुरू — "काय सांगणार आहे? काही special आहे का?" ❤️🔥

मी तर full nervous झालो होतो…
आणि मग तो "moment" आला…

ती म्हणाली — "माझी last bus 5:45 ची आहे…" 😶

आणि माझं काय झालं? 😵
ज्याचं स्वप्न बघत होतो ते सगळं एका सेकंदात "फुसss!" 😂

मग काय… मी लगेच bike ची speed वाढवली 🚀
आणि ३० मिनिटांत ४० km cover करून bus stop ला पोचलो!

इतकं effort घेतलं… आणि ट्विस्ट बघा —
बसच ३० मिनिटांनी late होती! 🤣🤣

मग आम्ही तिथेच थांबलो… थोडा वेळ अजून एकत्र घालवला… गप्पा मारल्या… हसलो… 💛

आणि मग तो moment आला…
जिथे तिला "sayonara" म्हणावं लागलं…

ती बसमध्ये बसली… आणि मी परत निघालो…
पण त्या दिवसाची आठवण मात्र आजही माझ्या मनात fresh आहे ❤️`,
      bodyEn: `That day is still fresh in my memory 💫.

    My friends and I planned a trip to Chichaati near Amravati, expecting waterfalls and nature 🌿.

    The funny part? I took Prachi there in peak summer 🌞.

    Where there should have been water, there were only rocks, heat, and dry land 🪨.

    But even in that dry setting, our company made everything beautiful ❤️.

    On the way back, she was sitting on my bike 🏍️. It was around 5 PM 🌅.

    I kept asking if it was okay to go slowly. She said yes 🙂.

    After some time she said, "I want to tell you something..." 😳

    My heartbeat shot up and I thought maybe something special was coming 💓.

    Then she said, "My last bus is at 5:45" 🚌.

    My romantic dream broke in one second 😂.

    I sped up 🚀, covered around 40 km in 30 minutes, and dropped her at the bus stop.

    And the twist? The bus was 30 minutes late 🤣.

    So we got some extra time together, talked, laughed, and made another unforgettable memory 🤍.`
    },
    {
      emoji: '🌴',
      tagMr: 'गोवा ट्रिप',
      tagEn: 'Goa Trip',
      titleMr: 'गोवा ट्रिप… आणि प्रेमाची सुरुवात',
      titleEn: 'Goa Trip... Where Love Began',
      bodyMr: `कोरोनानंतरचं ते वर्ष…
सगळे पुन्हा normal life मध्ये येत होते… आणि आमच्या मित्रांनी एक मोठा प्लॅन केला —
"गोवा ट्रिप!" 🌊🔥

सुरुवातीला मी या ट्रिपसाठी नाही म्हणालो होतो…
पण नंतर कळलं — प्राची पण येणार आहे… 😏

बस! माझा decision लगेच बदलला 😂
मी लगेच booking केलं… आणि ट्रिपसाठी तयार झालो ❤️

ट्रॅव्हलचा दिवस आला…
मी अमरावतीहून Madgaon Express पकडली… आणि पुण्याला पोचलो.
तिथे सगळे friends भेटले… आणि ती पण होती…

मी तिच्याकडे बघत होतो…
आणि माझ्या मनात butterflies उडत होते 🦋

ट्रेन मात्र… ६ तास late! 😵
पण तिच्यासोबत वेळ कसा गेला ते कळलंच नाही…

दुसऱ्या दिवशी… आम्ही शेवटी Goa ला पोचलो! 🌴✨

नेहमीप्रमाणे… प्राची माझ्या बाईकवर होती 😜
आणि आम्ही Goa explore करत होतो…

एक मजेशीर moment… 😄
आम्ही दोघं एका shop मध्ये गेलो…
आम्ही इतके close दिसत होतो की… आम्ही couple वाटत होतो!

तिथे एक married couple होतं…
बायको shopping करत होती… आणि नवरा बाहेर उभा होता…
ती बायको आमच्याकडे बघत होती…
आणि अचानक तिच्या नवऱ्याला म्हणाली —
"बघ किती cute आहेत हे दोघं… तू का नाही असा?" 😂😂

आम्ही तर एकदम shy झालो…
आणि त्या situation मध्ये आम्ही सगळेच हसू लागलो 😄

नंतर आम्ही beach वर गेलो… 🌅
sunset enjoy करत होतो… पाण्यात खेळत होतो…

तेवढ्यात एक photographer आला…
तो म्हणाला — "Sir, couple photo खिचाईये…"
मी म्हणालो, "नाही…"
तो पुन्हा insist करायला लागला…
मग तो प्राचीला म्हणाला — "Madam, photo खिचाईये…"
तीही म्हणाली, "नाही…"

आणि त्यावर तो म्हणाला —
"Madam ने नाही बोल दिया तो नहीं…" 😂😂

त्या Goa trip मध्ये…
काही official नव्हतं… काही बोललंही नव्हतं…
पण त्या सगळ्या moments मध्ये…
प्रेम हळूहळू सुरू झालं होतं… ❤️✨`,
      bodyEn: `After COVID, life was getting normal again and our friends planned a big Goa trip 🌊🔥.

    At first I said no 🙅. Then I found out Prachi was coming 😏.

    I changed my decision immediately, booked my ticket, and got ready 🎒.

    I came from Amravati by train to Pune 🚆, met all my friends, and she was there too.

    The train was 6 hours late 😵, but with her around, time flew ⏳❤️.

    Next day we finally reached Goa 🌴✨.

    As always, she sat behind me on the bike 🏍️ and we explored the city.

    At one shop, we looked so close that people thought we were already a couple 😄.

    A married woman even told her husband, "Look how cute they are. Why can't you be like that?" 😂

    We got shy and everyone laughed 😅.

    Later, at the beach, a photographer kept insisting on taking our couple photos 📸.

    We both kept saying no, and that became another funny moment 🤭.

    Nothing was official then, and nothing was spoken clearly,
    but in those little Goa moments, love had already started growing ❤️✨.`
    },
    {
      emoji: '🎂',
      tagMr: 'Birthday Surprise',
      tagEn: 'Birthday Surprise',
      titleMr: 'अलिबाग ट्रिप… आणि Kiwi Cake',
      titleEn: 'Alibag Trip… and Kiwi Cake',
      bodyMr: `🎂 अलिबाग ट्रिप… आणि Kiwi Cake ❤️🌊
काही महिने गेले होते…
आमच्या भेटी, बोलणं… हळूहळू सगळं वाढत होतं 💫
आणि मला खूप दिवसांपासून प्राचीला भेटायचं होतं…
ती पुण्यात… आणि मी अमरावतीत…
मग एक प्लॅन ठरला —
“चल, अलिबागला जाऊया!” 🌴
खरं सांगायचं तर…
तो फक्त ट्रिप नव्हता…
तो तिच्या birthday चा surprise plan होता 🎁❤️
पण माझं आणि surprise चं equation थोडं वेगळंच आहे 😅
मी surprise द्यायला जातो… आणि उलट मला surprise मिळतो!
मी तिला सांगितलं —
“Friends सोबत अलिबागला जाऊया…”
आणि ती तयार झाली 😄
आम्ही अलिबागला पोचलो…
beach, sunset, travel… सगळं एकदम perfect 🌅✨
एक भन्नाट experience म्हणजे —
दुपारी समुद्राचं पाणी इतकं मागे गेलं होतं की…
आम्ही थेट किल्ल्यापर्यंत चालत गेलो! 🏝️
पहिल्यांदाच असं काही बघितलं… आणि तो moment खूप special वाटला ❤️
आता खरी story… 😄
23 एप्रिल — तिचा birthday 🎂
मी ठरवलं होतं —
आज काहीतरी special surprise द्यायचं!
संध्याकाळी मी cake घ्यायला बाहेर पडलो…
पण almost सगळे shops बंद 😵
शेवटी एक दुकान सापडलं…
आणि तिथे फक्त एकच cake उरला होता…
मी विचार केला —
“Kiwi cake आहे… healthy आहे… unique आहे…
ती नक्की impressed होईल!” 😎
रात्री 12 वाजता…
आम्ही celebration सुरू केलं 🎉
तिने cake cut केला…
मी तिला एक piece दिला…
ती माझ्याकडे बघते… आणि विचारते —
“हा कसला cake आहे?”
मी full confidence मध्ये —
“Kiwi…” 😄
ती थोडी pause झाली…
आणि मग मोठ्याने हसू लागली 😂😂
मी पण हसू लागलो…
पण आतून? — full embarrassment! 😅
“Birthday ला kiwi cake कोण आणतं?” 🤦‍♂️
पण तिची खास गोष्ट म्हणजे —
तिने तो moment इतका gracefully handle केला…
की सगळं awkwardness fun मध्ये बदललं ❤️
आम्ही हसलो, enjoy केलं…
आणि तो birthday एकदम special बनला ✨
आजही…
इतक्या वर्षांनी…
ती मला अजूनही “Kiwi cake” वरून चिडवते 😂
आणि मी?
मी पण enjoy करतो… ❤️
त्या दिवसानंतर एक lesson शिकलो —
“Experimental food नको!” 😜
पण खरं सांगायचं तर…
त्या Kiwi cake च्या रात्री…
आमच्या story ची खरी सुरुवात झाली होती… ❤️✨`,
      bodyEn: `It had been a few months, and with every meeting and conversation, our bond kept growing 💫.

    Prachi was in Pune and I was in Amravati, and I had really wanted to meet her for a long time.

    So we made a plan: "Let's go to Alibag!" 🌴

    Honestly, it was not just a trip.
    It was secretly a birthday surprise plan for her 🎁❤️.

    But my equation with surprises is always funny 😅.
    Whenever I try to give a surprise, somehow I end up getting surprised myself.

    I told her, "Let's go to Alibag with friends..." and she agreed 😄.

    We reached Alibag and everything felt perfect:
    beach, sunset, travel vibes... all of it 🌅✨.

    One amazing experience was in the afternoon when the sea water had gone so far back that we could actually walk all the way to the fort 🏝️.
    It was my first time seeing something like that, and that moment felt truly special ❤️.

    Then came the real story 😄.
    23 April - her birthday 🎂.

    I had decided: today I have to make it special.

    In the evening, I went out to buy a cake.
    But almost all shops were closed 😵.

    Finally I found one shop, and there was only one cake left.

    I told myself confidently,
    "It is Kiwi cake... healthy, unique...
    She will definitely be impressed!" 😎

    At 12 midnight, we started the celebration 🎉.
    She cut the cake, I gave her a piece,
    and she looked at me and asked,
    "What cake is this?"

    With full confidence, I said,
    "Kiwi..." 😄

    She paused for a second,
    and then burst out laughing 😂😂.

    I laughed too,
    but inside? Full embarrassment! 😅
    "Who brings Kiwi cake on a birthday?" 🤦‍♂️

    But her best quality is this:
    she handled that moment so gracefully,
    that all awkwardness turned into fun ❤️.

    We laughed, enjoyed, and that birthday became truly special ✨.

    Even today,
    after all these years,
    she still teases me about the "Kiwi cake" 😂.

    And me?
    I enjoy it too... ❤️

    I learned one lesson that day:
    "No experimental food on birthdays!" 😜

    But honestly,
    that Kiwi-cake night
    became the real beginning of our story ❤️✨.`
    }
  ];

  let storyLang = 'mr';
  let activeStoryIndex = null;
  let storiesExpanded = false;

  function updateStoryPreviewState(){
    const cards = Array.from(document.querySelectorAll('.story-cards .story-card'));
    const btn = el('story-see-more-btn');

    cards.forEach((card, idx)=>{
      const show = storiesExpanded || idx < 2;
      card.style.display = show ? '' : 'none';
    });

    if(btn){
      if(cards.length <= 2){
        btn.style.display = 'none';
      } else {
        btn.style.display = 'inline-flex';
        btn.textContent = storiesExpanded ? 'Show Less Stories' : 'See More Stories';
      }
    }
  }

  function initStoryCardsPreview(){
    storiesExpanded = false;
    updateStoryPreviewState();
  }

  window.toggleStoryCards = function(){
    storiesExpanded = !storiesExpanded;
    updateStoryPreviewState();
  };

  function renderStoryLanguageState(){
    const isMr = storyLang === 'mr';
    const mrBtns = [el('story-lang-mr'), el('sm-lang-mr')];
    const enBtns = [el('story-lang-en'), el('sm-lang-en')];
    mrBtns.forEach(b=>{ if(b) b.classList.toggle('active', isMr); });
    enBtns.forEach(b=>{ if(b) b.classList.toggle('active', !isMr); });
  }

  function renderStoryModal(){
    if(activeStoryIndex===null) return;
    const s = STORIES[activeStoryIndex]; if(!s) return;
    const isMr = storyLang === 'mr';
    el('sm-emoji').textContent = s.emoji;
    el('sm-tag').textContent = isMr ? s.tagMr : s.tagEn;
    el('sm-title').textContent = isMr ? s.titleMr : s.titleEn;
    el('sm-body').textContent = isMr ? s.bodyMr : s.bodyEn;
  }

  window.setStoryLang = function(lang){
    storyLang = (lang === 'en') ? 'en' : 'mr';
    renderStoryLanguageState();
    renderStoryModal();
  };

  window.openStory = function(i){
    const s=STORIES[i]; if(!s)return;
    const m=el('story-modal'); if(!m)return;
    activeStoryIndex=i;
    renderStoryLanguageState();
    renderStoryModal();
    m.classList.remove('hidden'); m.style.display='flex';
    document.body.style.overflow='hidden';
    // Scroll to top of modal
    setTimeout(()=>{ const c=m.querySelector('.sm-card'); if(c) c.scrollTop=0; },50);
  };
  window.closeStory = function(){
    const m=el('story-modal'); if(!m)return;
    m.classList.add('hidden'); m.style.display='none';
    activeStoryIndex = null;
    document.body.style.overflow='';
  };

  // ── RSVP ──
  window.doRSVP = async function(e){
    e.preventDefault();
    const form = el('rf');
    if(!form) return;
    const data = new FormData(form);
    const payload = {
      fullName: (data.get('fullName') || '').toString().trim(),
      phone: (data.get('phone') || '').toString().trim(),
      attendance: (data.get('attendance') || '').toString().trim(),
      event: (data.get('event') || '').toString().trim(),
      guestCount: Number((data.get('guestCount') || '').toString().trim() || 1),
      note: (data.get('note') || '').toString().trim()
    };

    if(!payload.fullName || !payload.attendance){
      alert('Please fill your name and attendance status.');
      return;
    }

    if(payload.attendance === 'yes' && !payload.phone){
      alert('Please add a phone number so the morning reminder can be queued.');
      return;
    }

    try{
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }catch(_err){
      // Keep UI flow smooth even if API is temporarily unavailable
    }

    const okBox = el('rsvp-ok');
    const okMsg = okBox ? okBox.querySelector('p') : null;
    if(okMsg){
      okMsg.textContent = payload.attendance === 'yes'
        ? 'Your daily 8 AM reminder is queued until 10 May.'
        : 'Thank you for your response!';
    }

    safe(()=>{ el('rf').classList.add('hidden'); el('rsvp-ok').classList.remove('hidden'); });
    triggerConfetti();
  };

  // ── WISHES ──
  function escapeHtml(text){
    return String(text)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function appendWishCard(name, message){
    const c=document.createElement('div');
    c.className='wc';
    c.innerHTML='<span class="wq">"</span><p>'+escapeHtml(message)+'</p><span class="wa">— '+escapeHtml(name)+'</span>';
    safe(()=>el('wl').prepend(c));
  }

  const WISH_PREVIEW_LIMIT = 3;
  let wishesExpanded = false;
  let wishesStore = [];

  function collectWishesFromDom(){
    const wl = el('wl');
    if(!wl) return [];
    return Array.from(wl.querySelectorAll('.wc')).map((card)=>{
      const msg = (card.querySelector('p')?.textContent || '').trim();
      const by = (card.querySelector('.wa')?.textContent || '').replace(/^—\s*/, '').trim();
      return { name: by, message: msg };
    }).filter((w)=>w.name && w.message);
  }

  function updateWishesPreviewButton(){
    const btn = el('wishes-see-more-btn');
    if(!btn) return;
    if(wishesStore.length <= WISH_PREVIEW_LIMIT){
      btn.style.display = 'none';
      return;
    }
    btn.style.display = 'block';
    btn.textContent = wishesExpanded ? 'Show Less Wishes' : 'See More Wishes';
  }

  function renderWishes(){
    const wl = el('wl');
    if(!wl) return;
    wl.innerHTML = '';

    const visible = wishesExpanded ? wishesStore : wishesStore.slice(0, WISH_PREVIEW_LIMIT);
    visible.forEach((w)=>{
      const c=document.createElement('div');
      c.className='wc';
      c.innerHTML='<span class="wq">"</span><p>'+escapeHtml(w.message)+'</p><span class="wa">— '+escapeHtml(w.name)+'</span>';
      wl.appendChild(c);
    });

    updateWishesPreviewButton();
  }

  async function initWishes(){
    wishesExpanded = false;
    try{
      const res = await fetch('/api/wishes');
      if(!res.ok) throw new Error('wishes fetch failed');
      const data = await res.json();
      if(!Array.isArray(data.wishes)) throw new Error('invalid wishes payload');

      wishesStore = data.wishes
        .filter((w)=>w && w.name && w.message)
        .map((w)=>({ name: String(w.name).trim(), message: String(w.message).trim() }));
    }catch(_err){
      wishesStore = collectWishesFromDom();
    }
    renderWishes();
  }

  window.toggleWishesExpanded = function(){
    wishesExpanded = !wishesExpanded;
    renderWishes();
  };

  window.toggleWF = function(){ safe(()=>el('wf').classList.toggle('hidden')); };
  window.addWish  = async function(){
    const n=el('wn').value.trim(), m=el('wm').value.trim(); if(!n||!m)return;

    try{
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, message: m })
      });
      if(!res.ok){
        alert('Wish save failed. Please try again.');
        return;
      }
    }catch(_err){
      alert('Wish save failed. Please try again.');
      return;
    }

    wishesStore.unshift({ name: n, message: m });
    renderWishes();
    el('wn').value=''; el('wm').value='';
    safe(()=>el('wf').classList.add('hidden'));
  };

  // ── MUSIC ──
  let mOn=false;
  let autoPausedByVisibility = false;
  function playMusic(){
    const a=el('aud'); if(!a)return;
    a.volume=.35;
    a.play().then(()=>{ mOn=true; updateMusicUI(); }).catch(()=>{});
  }
  function pauseMusicForBackground(){
    const a=el('aud'); if(!a)return;
    if(mOn && !a.paused){
      autoPausedByVisibility = true;
      a.pause();
      mOn=false;
      updateMusicUI();
    }
  }
  function resumeMusicAfterBackground(){
    const a=el('aud'); if(!a)return;
    if(!autoPausedByVisibility) return;
    autoPausedByVisibility = false;
    a.play().then(()=>{ mOn=true; updateMusicUI(); }).catch(()=>{});
  }
  window.toggleMusic = function(){
    const a=el('aud'); if(!a)return;
    autoPausedByVisibility = false;
    if(mOn){ a.pause(); mOn=false; } else { a.play().catch(()=>{}); mOn=true; }
    updateMusicUI();
  };
  function updateMusicUI(){
    const wrap=el('np-music'), title=el('npm-title'), toggle=el('npm-toggle');
    if(wrap)   wrap.classList.toggle('playing',mOn);
    if(title)  title.textContent=mOn?'Stop Music':'Play Music';
    if(toggle) toggle.textContent=mOn?'⏸':'▶';
    const fabIcon=el('music-fab-icon'), fabLabel=el('music-fab-label'), fabBtn=el('music-fab');
    if(fabIcon)  fabIcon.textContent=mOn?'⏸':'🎵';
    if(fabLabel) fabLabel.textContent=mOn?'Stop Music':'Play Music';
    if(fabBtn)   fabBtn.style.borderColor=mOn?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.25)';
  }

  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) pauseMusicForBackground();
    else resumeMusicAfterBackground();
  });
  window.addEventListener('pagehide', pauseMusicForBackground);
  window.addEventListener('blur', ()=>{ if(document.hidden) pauseMusicForBackground(); });
  window.addEventListener('focus', ()=>{ if(!document.hidden) resumeMusicAfterBackground(); });

  // ── SHARE ──
  window.doShare = function(){
    const d={title:'Nikhil & Prachi Wedding',text:"You're invited! 10 May 2026 💍",url:window.location.href};
    if(navigator.share) navigator.share(d);
    else navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!')).catch(()=>{});
  };
  // Update WhatsApp link with actual page URL
  const waBtn=el('wa-share-btn');
  if(waBtn){
    const msg=encodeURIComponent("You're invited to Nikhil & Prachi's Wedding! 💍\n📅 10 May 2026 | Mata Amritanandamayi Math, Nigdi, Pune\n\nOpen invitation → "+window.location.href);
    waBtn.href='https://wa.me/?text='+msg;
  }

  // ── WEDDING QUIZ ──
  const QUIZ=[
    {q:'Where did Nikhil and Prachi first meet?',opts:['College EDC Lab','Coffee Shop','Friend\'s Party','Online'],ans:0},
    {q:'What caused the "spark" in their first meeting?',opts:['Love at first sight','Circuit short circuit 💥','A joke','Music'],ans:1},
    {q:'Where did Nikhil take Prachi on their first trip?',opts:['Goa','Chichaati','Mumbai','Lonavala'],ans:1},
    {q:'What was the famous "5:45" twist?',opts:['Train time','Her last bus time','Sunset time','Dinner reservation'],ans:1},
    {q:'When is the wedding?',opts:['10 April 2026','10 May 2026','10 June 2026','10 July 2026'],ans:1}
  ];
  let qIdx=0,score=0;
  function startQuiz(){
    qIdx=0;score=0;
    el('quiz-wrap').classList.remove('hidden');
    el('quiz-result').classList.add('hidden');
    showQ();
  }
  function showQ(){
    const q=QUIZ[qIdx];
    el('quiz-qnum').textContent='Question '+(qIdx+1)+' of '+QUIZ.length;
    el('quiz-question').textContent=q.q;
    el('quiz-progress').style.width=((qIdx+1)/QUIZ.length*100)+'%';
    const opts=el('quiz-options');
    opts.innerHTML='';
    q.opts.forEach((opt,i)=>{
      const btn=document.createElement('button');
      btn.className='quiz-opt';
      btn.textContent=opt;
      btn.onclick=()=>answerQ(i);
      opts.appendChild(btn);
    });
  }
  function answerQ(i){
    const q=QUIZ[qIdx];
    const opts=document.querySelectorAll('.quiz-opt');
    opts.forEach((o,idx)=>{
      o.classList.add('disabled');
      if(idx===q.ans) o.classList.add('correct');
      else if(idx===i) o.classList.add('wrong');
    });
    if(i===q.ans) score++;
    setTimeout(()=>{
      qIdx++;
      if(qIdx<QUIZ.length) showQ();
      else showResult();
    },1200);
  }
  function showResult(){
    el('quiz-wrap').classList.add('hidden');
    const res=el('quiz-result');
    res.classList.remove('hidden');
    const pct=Math.round(score/QUIZ.length*100);
    if(pct===100){ el('qr-icon').textContent='🏆'; el('qr-score').textContent='Perfect Score!'; el('qr-msg').textContent='You know Nikhil & Prachi better than they know themselves! 😄'; }
    else if(pct>=60){ el('qr-icon').textContent='🎉'; el('qr-score').textContent=score+' / '+QUIZ.length; el('qr-msg').textContent='Great job! You know them well! 👏'; }
    else{ el('qr-icon').textContent='😅'; el('qr-score').textContent=score+' / '+QUIZ.length; el('qr-msg').textContent='Not bad! But you should spend more time with them! 😄'; }
    saveQuizResult(score, QUIZ.length, pct);
    triggerConfetti();
  }

  async function saveQuizResult(scoreValue, totalValue, percentValue){
    try{
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: scoreValue,
          total: totalValue,
          percent: percentValue
        })
      });
    }catch(_err){
      // Silent fallback
    }
  }
  window.restartQuiz=startQuiz;
  startQuiz();

  // ── CONFETTI ──
  function triggerConfetti(){
    const cv=el('confetti-canvas'); if(!cv)return;
    cv.style.display='block';
    cv.width=window.innerWidth; cv.height=window.innerHeight;
    const ctx=cv.getContext('2d');
    const pieces=Array.from({length:80},()=>({
      x:Math.random()*cv.width,y:-20,
      vx:(Math.random()-.5)*3,vy:Math.random()*3+2,
      r:Math.random()*4+2,
      c:['#C9A84C','#E8C97A','#C41E3A','#8B1A2A'][Math.floor(Math.random()*4)],
      rot:Math.random()*360,rotV:Math.random()*10-5
    }));
    let frame=0;
    function draw(){
      ctx.clearRect(0,0,cv.width,cv.height);
      pieces.forEach(p=>{
        p.y+=p.vy; p.x+=p.vx; p.rot+=p.rotV;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);
        ctx.restore();
      });
      frame++;
      if(frame<180) requestAnimationFrame(draw);
      else cv.style.display='none';
    }
    draw();
  }

  // ── START ──
  (function hardenMediaProtection(){
    document.body.classList.add('capture-guard-enabled');

    const blockEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const setShield = (active) => {
      document.body.classList.toggle('capture-shield-on', Boolean(active));
    };

    const clearClipboard = async () => {
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText('');
        }
      }catch(_err){
        // Clipboard clear may fail due to browser permissions.
      }
    };

    const lockScreenshotKey = async () => {
      try{
        if(navigator.keyboard && navigator.keyboard.lock){
          await navigator.keyboard.lock(['PrintScreen']);
        }
      }catch(_err){
        // Keyboard lock may require browser support, secure context, and user gesture.
      }
    };

    const unlockScreenshotKey = () => {
      try{
        if(navigator.keyboard && navigator.keyboard.unlock){
          navigator.keyboard.unlock();
        }
      }catch(_err){
        // Ignore unlock errors.
      }
    };

    const tryLockOnInteraction = () => {
      lockScreenshotKey();
      window.removeEventListener('pointerdown', tryLockOnInteraction, true);
      window.removeEventListener('keydown', tryLockOnInteraction, true);
    };

    window.addEventListener('pointerdown', tryLockOnInteraction, true);
    window.addEventListener('keydown', tryLockOnInteraction, true);

    document.addEventListener('contextmenu', blockEvent, { capture:true });
    document.addEventListener('dragstart', blockEvent, { capture:true });
    document.addEventListener('copy', blockEvent, { capture:true });
    document.addEventListener('cut', blockEvent, { capture:true });
    document.addEventListener('selectstart', blockEvent, { capture:true });

    document.addEventListener('keydown', (e) => {
      const key = String(e.key || '').toLowerCase();
      const metaOrCtrl = e.metaKey || e.ctrlKey;

      if(key === 'printscreen'){
        e.preventDefault();
        clearClipboard();
        return;
      }

      if(metaOrCtrl && ['c','x','s','p','u'].includes(key)){
        e.preventDefault();
        return;
      }

      if(metaOrCtrl && e.shiftKey && ['i','j','c','s','5','3','4'].includes(key)){
        e.preventDefault();
        return;
      }

      if(e.key === 'F12'){
        e.preventDefault();
      }
    }, { capture:true });

    document.addEventListener('visibilitychange', ()=>{
      setShield(document.hidden);
      if(!document.hidden) lockScreenshotKey();
    });

    window.addEventListener('blur', ()=>setShield(true));
    window.addEventListener('focus', ()=>{
      setShield(false);
      lockScreenshotKey();
    });
    window.addEventListener('pagehide', ()=>setShield(true));
    window.addEventListener('pageshow', ()=>setShield(false));
    window.addEventListener('beforeunload', unlockScreenshotKey);
  })();

  initLoader();

});

