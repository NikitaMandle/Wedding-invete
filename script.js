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
    // Show guest name on card immediately
    initGuestName();
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
    initCountdown(); initReveal(); initNav(); initGallery();
    initGuestName();
  }

  // ── GUEST NAME — reads ?guest=Name from URL ──
  function initGuestName(){
    try{
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('guest');
      if(!raw || !raw.trim()) return;
      const name = decodeURIComponent(raw.trim())
        .replace(/\+/g,' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      // Show in nav top-left
      const navG = el('nav-guest');
      if(navG){ navG.textContent='Welcome, '+name; navG.classList.add('visible'); }

      // Show on invitation card
      const cardWrap = el('inv-guest-wrap');
      const cardName = el('inv-guest-name');
      if(cardWrap && cardName){
        cardName.textContent = name;
        cardWrap.classList.remove('hidden');
      }
    }catch(e){}
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
      btn.addEventListener('click',function(){
        document.querySelectorAll('.gt').forEach(b=>b.classList.remove('active'));
        this.classList.add('active');
        const cat=this.dataset.c;
        document.querySelectorAll('.gi').forEach(i=>{ i.style.display=(cat==='all'||i.dataset.c===cat)?'':'none'; });
      });
    });
    document.querySelectorAll('.gi').forEach((e,i)=>e.addEventListener('click',()=>openLb(i)));
  }

  const lbBg=['#3d0808','#1a0303','#3d2d0d','#0d1a3d','#0d3d0d','#2d0d3d'];
  const lbLbl=['Pre-Wedding 1','Pre-Wedding 2','Engagement','Pre-Wedding 3','Celebration','Joy'];
  let lbI=0;
  function openLb(i){ lbI=i; showLb(); safe(()=>{ el('lb').classList.remove('hidden'); el('lb').style.display='flex'; }); }
  function showLb(){
    const e=el('lb-img'); if(!e)return;
    e.style.cssText='background:'+lbBg[lbI]+';display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:.8rem;letter-spacing:1px;';
    e.textContent=lbLbl[lbI];
    const cap=el('lb-caption'); if(cap) cap.textContent=lbLbl[lbI];
    const ctr=el('lb-counter'); if(ctr) ctr.textContent=(lbI+1)+' / '+lbBg.length;
  }
  window.closeLb = function(){ const l=el('lb'); if(l){l.classList.add('hidden');l.style.display='none';} };
  window.lbP     = function(){ lbI=(lbI-1+lbBg.length)%lbBg.length; showLb(); };
  window.lbN     = function(){ lbI=(lbI+1)%lbBg.length; showLb(); };
  window.openLb  = openLb;

  // ── TIMELINE TOGGLE ──
  window.switchTimeline = function(side){
    const tg=el('timeline-groom'), tb=el('timeline-bride');
    const bg=el('btn-groom'), bb=el('btn-bride');
    if(!tg||!tb) return;
    const hideEl=side==='groom'?tb:tg;
    const showEl=side==='groom'?tg:tb;
    hideEl.classList.add('tl-exit');
    setTimeout(()=>{
      hideEl.classList.add('hidden'); hideEl.classList.remove('tl-exit');
      showEl.classList.remove('hidden'); showEl.classList.add('tl-enter');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ showEl.classList.remove('tl-enter'); }));
    },280);
    if(bg) bg.classList.toggle('active',side==='groom');
    if(bb) bb.classList.toggle('active',side==='bride');
  };

  // ── EVENT DAYS COUNTDOWN ──
  const EVENT_DATES={
    g_gondhal:'2026-05-05',g_mehendi:'2026-05-06',g_haldi:'2026-05-07',
    g_travel:'2026-05-08',g_wedding:'2026-05-10',g_reception:'2026-05-12',
    b_haldi:'2026-05-07',b_mehndi:'2026-05-08',b_sangeet:'2026-05-09',
    b_wedding:'2026-05-10',b_vidaai:'2026-05-10',b_reception:'2026-05-10'
  };
  function initEventDays(){
    const now=Date.now();
    Object.entries(EVENT_DATES).forEach(([key,dateStr])=>{
      const el_d=el('days-'+key); if(!el_d)return;
      const diff=new Date(dateStr).getTime()-now;
      if(diff<=0){ el_d.textContent='Today! 🎉'; }
      else{
        const days=Math.ceil(diff/86400000);
        el_d.textContent=days===1?'Tomorrow!':days+' days away';
      }
    });
  }
  initEventDays();

  // ── ADD TO CALENDAR ──
  const CAL_URLS={
    g_gondhal:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gondhal+Ceremony&dates=20260505T180000/20260505T220000&location=Rajapeth,+Amravati',
    g_mehendi:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehendi+Ceremony&dates=20260506T140000/20260506T200000&location=Rajapeth,+Amravati',
    g_haldi:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+%26+Devkundi&dates=20260507T090000/20260507T140000&location=Rajapeth,+Amravati',
    g_travel:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Travel+to+Pune&dates=20260508T080000/20260508T200000',
    g_wedding:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikhil+%26+Prachi+Wedding&dates=20260510T110000/20260510T180000&location=Sweta+Lawn,+Nigdi,+Pune',
    g_reception:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reception+%26+Satyanarayan&dates=20260512T170000/20260512T235900&location=Rajapeth,+Amravati',
    b_haldi:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+Ceremony&dates=20260507T090000/20260507T130000&location=Sweta+Lawn,+Nigdi,+Pune',
    b_mehndi:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehndi+Ceremony&dates=20260508T160000/20260508T210000&location=Sweta+Lawn,+Nigdi,+Pune',
    b_sangeet:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+Night&dates=20260509T190000/20260509T235900&location=Sweta+Lawn,+Nigdi,+Pune',
    b_wedding:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony&dates=20260510T110000/20260510T140000&location=Sweta+Lawn,+Nigdi,+Pune',
    b_vidaai:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidaai&dates=20260510T140000/20260510T160000&location=Sweta+Lawn,+Nigdi,+Pune',
    b_reception:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception&dates=20260510T190000/20260510T235900&location=Sweta+Lawn,+Nigdi,+Pune',
  };
  window.addToCal=function(key){ const u=CAL_URLS[key]; if(u) window.open(u,'_blank'); };

  // ── EVENT MODAL ──
  const AMRAVATI='Nikhil\'s Home, Rajapeth Chatrapati Sahu Nagar, Near Shitla Mata Mandir, Amravati – 444607';
  const AMAP='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.0!2d77.7523!3d20.9374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd6a9e4b7c3b1a1%3A0xabc!2sRajapeth%2C+Amravati!5e0!3m2!1sen!2sin!4v1680000000000';
  const AURL='https://maps.google.com/?q=Rajapeth+Chatrapati+Sahu+Nagar+Amravati';
  const PUNE='Sweta Lawn, Mata Amritanandamayi Math, Nigdi, Pune – 411044';
  const PMAP='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7700!3d18.6500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e4b7c3b1a1%3A0xabc!2sNigdi%2C+Pune!5e0!3m2!1sen!2sin!4v1680000000000';
  const PURL='https://maps.google.com/?q=Mata+Amritanandamayi+Math+Nigdi+Pune';
  const EVDATA={
    g_gondhal: {icon:'🪔',title:'Gondhal Ceremony',      date:'5 May 2026', time:'Evening',         venue:AMRAVATI,dress:'Traditional Attire',        mapSrc:AMAP,mapUrl:AURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gondhal+Ceremony&dates=20260505T180000/20260505T220000'},
    g_mehendi: {icon:'🌿',title:'Mehendi Ceremony',      date:'6 May 2026', time:'Afternoon',        venue:AMRAVATI,dress:'Casual / Traditional',       mapSrc:AMAP,mapUrl:AURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehendi+Ceremony&dates=20260506T140000/20260506T200000'},
    g_haldi:   {icon:'🌼',title:'Haldi & Devkundi',      date:'7 May 2026', time:'Morning',          venue:AMRAVATI,dress:'Yellow / White Traditional', mapSrc:AMAP,mapUrl:AURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+%26+Devkundi&dates=20260507T090000/20260507T140000'},
    g_travel:  {icon:'🚂',title:'Departure to Pune',     date:'8 May 2026', time:'Morning',          venue:'Amravati → Pune',dress:'Comfortable',       mapSrc:AMAP,mapUrl:AURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Travel+to+Pune&dates=20260508T080000/20260508T200000'},
    g_wedding: {icon:'💍',title:'Wedding Ceremony 💍',   date:'10 May 2026',time:'11:00 AM',         venue:PUNE,   dress:'Sherwani / Formal',           mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikhil+%26+Prachi+Wedding&dates=20260510T110000/20260510T180000&location=Sweta+Lawn,+Nigdi,+Pune'},
    g_reception:{icon:'🥂',title:'Reception & Satyanarayan',date:'12 May 2026',time:'Evening',       venue:AMRAVATI,dress:'Ethnic / Formal Elegant',    mapSrc:AMAP,mapUrl:AURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reception+%26+Satyanarayan&dates=20260512T170000/20260512T235900'},
    b_mehndi:  {icon:'🌿',title:'Mehndi Ceremony',       date:'8 May 2026', time:'4:00 PM onwards',  venue:PUNE,   dress:'Yellow / Green Traditional',  mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehndi+Ceremony&dates=20260508T160000/20260508T210000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_haldi:   {icon:'🌼',title:'Haldi Ceremony',        date:'9 May 2026', time:'11:00 AM',         venue:PUNE,   dress:'Yellow / Floral Traditional', mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+Ceremony&dates=20260509T110000/20260509T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_sangeet: {icon:'🎶',title:'Sangeet Night',         date:'9 May 2026', time:'7:00 PM onwards',  venue:PUNE,   dress:'Cocktail / Festive Colourful',mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+Night&dates=20260509T190000/20260509T235900&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_wedding: {icon:'💍',title:'Wedding Ceremony 💍',   date:'10 May 2026',time:'11:00 AM',         venue:PUNE,   dress:'Bridal Lehenga / Traditional',mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony&dates=20260510T110000/20260510T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_vidaai:  {icon:'🌸',title:'Vidaai',                date:'10 May 2026',time:'2:00 PM',          venue:PUNE,   dress:'Bridal Attire',               mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidaai&dates=20260510T140000/20260510T160000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_reception:{icon:'🥂',title:'Wedding Reception',    date:'10 May 2026',time:'7:00 PM onwards',  venue:PUNE,   dress:'Ethnic / Formal Elegant',      mapSrc:PMAP,mapUrl:PURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception&dates=20260510T190000/20260510T235900&location=Sweta+Lawn,+Nigdi,+Pune'},
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

  // ── RSVP ──
  window.doRSVP = function(e){
    e.preventDefault();
    safe(()=>{ el('rf').classList.add('hidden'); el('rsvp-ok').classList.remove('hidden'); });
    triggerConfetti();
  };

  // ── WISHES ──
  window.toggleWF = function(){ safe(()=>el('wf').classList.toggle('hidden')); };
  window.addWish  = function(){
    const n=el('wn').value.trim(), m=el('wm').value.trim(); if(!n||!m)return;
    const c=document.createElement('div'); c.className='wc';
    c.innerHTML='<span class="wq">"</span><p>'+m+'</p><span class="wa">— '+n+'</span>';
    safe(()=>el('wl').prepend(c));
    el('wn').value=''; el('wm').value='';
    safe(()=>el('wf').classList.add('hidden'));
  };

  // ── MUSIC ──
  let mOn=false;
  function playMusic(){
    const a=el('aud'); if(!a)return;
    a.volume=.35;
    a.play().then(()=>{ mOn=true; updateMusicUI(); }).catch(()=>{});
  }
  window.toggleMusic = function(){
    const a=el('aud'); if(!a)return;
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

  // ── SHARE ──
  window.doShare = function(){
    const d={title:'Nikhil & Prachi Wedding',text:"You're invited! 10 May 2026 💍",url:window.location.href};
    if(navigator.share) navigator.share(d);
    else navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!')).catch(()=>{});
  };
  // WhatsApp with actual URL
  const waBtn=el('wa-share-btn');
  if(waBtn){ const msg=encodeURIComponent("You're invited to Nikhil & Prachi's Wedding! 💍\n📅 10 May 2026 | Sweta Lawn, Nigdi, Pune\n\nOpen invitation → "+window.location.href); waBtn.href='https://wa.me/?text='+msg; }

  // ── STORIES ──
  const STORIES=[
    {emoji:'💥',tag:'College Days',title:'आमची EDC प्रॅक्टिकल स्टोरी',body:`खूप वर्षांपूर्वीची गोष्ट आहे… कॉलेजचे दिवस… आणि त्या दिवसांची एक खास आठवण 💫

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
कारण त्या एका "स्पार्क"मध्येच आमच्या स्टोरीची सुरुवात झाली होती ✨`},
    {emoji:'🌄',tag:'First Trip Together',title:'चिचाटी ट्रिप आणि 5:45 ची ट्विस्ट',body:`तो दिवस अजूनही ताजा आहे…

मी आणि माझे मित्र सगळे मिळून अमरावतीजवळच्या प्रसिद्ध चिचाटीला जायचं ठरवलं — धबधबा, निसर्ग आणि मजा 💫

पण खरी मजा कुठे झाली माहिती आहे? 😄
मी प्राचीला चिचाटीला घेऊन गेलो… थेट उन्हाळ्यात! 🌞

जिथे पाणी असायला हवं होतं… तिथे फक्त दगड, कडक ऊन आणि कोरडं वातावरण!
पण तरीही… त्या सगळ्या "सुक्या" वातावरणातही…
आमची company मात्र एकदम फुल ऑन enjoyable होती ❤️

परत येताना…
प्राची माझ्या बाईकवर बसली होती… संध्याकाळचे ५ वाजले होते 🌅

मी थोडा हळू चालवत होतो… आणि तिला विचारलं,
"आपण हळू गेलो तर काही problem नाही ना?"
ती म्हणाली, "हो, काही problem नाही."

थोड्यावेळाने ती म्हणाली —
"मला काहीतरी सांगायचं आहे…"

बस! 😳 माझं heart beat एकदम वाढलं…
मनात हजार विचार सुरू — "काय सांगणार आहे? काही special आहे का?" ❤️🔥

आणि मग तो "moment" आला…
ती म्हणाली — "माझी last bus 5:45 ची आहे…" 😶

आणि माझं काय झालं? 😵
ज्याचं स्वप्न बघत होतो ते सगळं एका सेकंदात "फुसss!" 😂

मग काय… मी लगेच bike ची speed वाढवली 🚀
आणि ३० मिनिटांत ४० km cover करून bus stop ला पोचलो!

इतकं effort घेतलं… आणि ट्विस्ट बघा —
बसच ३० मिनिटांनी late होती! 🤣🤣

मग आम्ही तिथेच थांबलो… थोडा वेळ अजून एकत्र घालवला… गप्पा मारल्या… हसलो… 💛
त्या दिवसाची आठवण मात्र आजही माझ्या मनात fresh आहे ❤️`},
    {emoji:'🌴',tag:'Goa Trip',title:'गोवा ट्रिप… आणि प्रेमाची सुरुवात',body:`कोरोनानंतरचं ते वर्ष…
सगळे पुन्हा normal life मध्ये येत होते… आणि आमच्या मित्रांनी एक मोठा प्लॅन केला —
"गोवा ट्रिप!" 🌊🔥

सुरुवातीला मी या ट्रिपसाठी नाही म्हणालो होतो…
पण नंतर कळलं — प्राची पण येणार आहे… 😏

बस! माझा decision लगेच बदलला 😂
मी लगेच booking केलं… आणि ट्रिपसाठी तयार झालो ❤️

ट्रेन मात्र… ६ तास late! 😵
पण तिच्यासोबत वेळ कसा गेला ते कळलंच नाही…

गोव्यात एक मजेशीर moment… 😄
आम्ही दोघं एका shop मध्ये गेलो…
तिथे एक married couple होतं…
बायको आमच्याकडे बघत होती…
आणि अचानक तिच्या नवऱ्याला म्हणाली —
"बघ किती cute आहेत हे दोघं… तू का नाही असा?" 😂😂

नंतर beach वर एक photographer आला…
तो म्हणाला — "Sir, couple photo खिचाईये…"
मी म्हणालो, "नाही…"
मग तो प्राचीला म्हणाला — "Madam, photo खिचाईये…"
तीही म्हणाली, "नाही…"
आणि त्यावर तो म्हणाला —
"Madam ने नाही बोल दिया तो नहीं…" 😂😂

त्या Goa trip मध्ये…
काही official नव्हतं… काही बोललंही नव्हतं…
पण त्या सगळ्या moments मध्ये…
प्रेम हळूहळू सुरू झालं होतं… ❤️✨`}
  ];
  window.openStory=function(i){
    const s=STORIES[i]; if(!s)return;
    const m=el('story-modal'); if(!m)return;
    el('sm-emoji').textContent=s.emoji; el('sm-tag').textContent=s.tag;
    el('sm-title').textContent=s.title; el('sm-body').textContent=s.body;
    m.classList.remove('hidden'); m.style.display='flex';
    document.body.style.overflow='hidden';
    setTimeout(()=>{ const c=m.querySelector('.sm-card'); if(c) c.scrollTop=0; },50);
  };
  window.closeStory=function(){
    const m=el('story-modal'); if(!m)return;
    m.classList.add('hidden'); m.style.display='none';
    document.body.style.overflow='';
  };

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
    const qw=el('quiz-wrap'),qr=el('quiz-result');
    if(qw) qw.classList.remove('hidden');
    if(qr) qr.classList.add('hidden');
    showQ();
  }
  function showQ(){
    const q=QUIZ[qIdx];
    const qn=el('quiz-qnum'),qq=el('quiz-question'),qo=el('quiz-options'),qp=el('quiz-progress');
    if(qn) qn.textContent='Question '+(qIdx+1)+' of '+QUIZ.length;
    if(qq) qq.textContent=q.q;
    if(qp) qp.style.width=((qIdx+1)/QUIZ.length*100)+'%';
    if(qo){
      qo.innerHTML='';
      q.opts.forEach((opt,i)=>{
        const btn=document.createElement('button');
        btn.className='quiz-opt'; btn.textContent=opt;
        btn.onclick=()=>answerQ(i);
        qo.appendChild(btn);
      });
    }
  }
  function answerQ(i){
    const q=QUIZ[qIdx];
    document.querySelectorAll('.quiz-opt').forEach((o,idx)=>{
      o.classList.add('disabled');
      if(idx===q.ans) o.classList.add('correct');
      else if(idx===i) o.classList.add('wrong');
    });
    if(i===q.ans) score++;
    setTimeout(()=>{ qIdx++; if(qIdx<QUIZ.length) showQ(); else showResult(); },1200);
  }
  function showResult(){
    const qw=el('quiz-wrap'),res=el('quiz-result');
    if(qw) qw.classList.add('hidden');
    if(!res) return;
    res.classList.remove('hidden');
    const pct=Math.round(score/QUIZ.length*100);
    if(pct===100){ el('qr-icon').textContent='🏆'; el('qr-score').textContent='Perfect Score!'; el('qr-msg').textContent='You know Nikhil & Prachi better than they know themselves! 😄'; }
    else if(pct>=60){ el('qr-icon').textContent='🎉'; el('qr-score').textContent=score+' / '+QUIZ.length; el('qr-msg').textContent='Great job! You know them well! 👏'; }
    else{ el('qr-icon').textContent='😅'; el('qr-score').textContent=score+' / '+QUIZ.length; el('qr-msg').textContent='Not bad! But you should spend more time with them! 😄'; }
    triggerConfetti();
  }
  window.restartQuiz=startQuiz;
  startQuiz();

  // ── CONFETTI ──
  function triggerConfetti(){
    const cv=el('confetti-canvas'); if(!cv)return;
    cv.style.display='block'; cv.width=window.innerWidth; cv.height=window.innerHeight;
    const ctx=cv.getContext('2d');
    const pieces=Array.from({length:80},()=>({x:Math.random()*cv.width,y:-20,vx:(Math.random()-.5)*3,vy:Math.random()*3+2,r:Math.random()*4+2,c:['#C9A84C','#E8C97A','#C41E3A','#8B1A2A'][Math.floor(Math.random()*4)],rot:Math.random()*360,rotV:Math.random()*10-5}));
    let frame=0;
    (function draw(){ctx.clearRect(0,0,cv.width,cv.height);pieces.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.rot+=p.rotV;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.c;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);ctx.restore();});frame++;if(frame<180)requestAnimationFrame(draw);else cv.style.display='none';})();
  }

  // ── SECURITY — Token-based access control ──
  // Valid tokens — add/remove as needed. Share links like: ?guest=Rahul&token=np2026
  const VALID_TOKENS = ['np2026','nikhilprachi','wedding2026','sweta2026','invite2026'];
  function checkSecurity(){
    try{
      const p = new URLSearchParams(window.location.search);
      const token = p.get('token');
      // If no token param at all — allow (for localhost/testing)
      if(!p.has('token')) return true;
      // If token param exists, validate it
      return VALID_TOKENS.includes(token);
    }catch(e){ return true; }
  }
  function showSecurityLock(){
    const lock = el('security-lock');
    if(lock){
      lock.style.display='flex';
      safe(()=>mkCanvas('slc',40,['#C9A84C','#C41E3A']));
    }
  }

  // ── REMINDER NOTIFICATIONS ──
  window.setReminder = async function(daysBefore){
    const status = el('reminder-status');
    if(!('Notification' in window)){
      if(status) status.textContent = '❌ Notifications not supported on this browser';
      return;
    }
    const perm = await Notification.requestPermission();
    if(perm !== 'granted'){
      if(status) status.textContent = '❌ Please allow notifications to set reminders';
      return;
    }
    // Calculate reminder time
    const weddingDate = new Date('2026-05-10T08:00:00+05:30');
    const reminderDate = new Date(weddingDate.getTime() - daysBefore * 86400000);
    const now = Date.now();
    const delay = reminderDate.getTime() - now;
    if(delay <= 0){
      if(status) status.textContent = '⚠️ This date has already passed';
      return;
    }
    // Store reminder in localStorage
    const reminders = JSON.parse(localStorage.getItem('np_reminders')||'[]');
    reminders.push({daysBefore, reminderDate: reminderDate.toISOString()});
    localStorage.setItem('np_reminders', JSON.stringify(reminders));
    // Show immediate confirmation notification
    new Notification('Reminder Set! 🔔', {
      body: `We'll remind you ${daysBefore} day${daysBefore>1?'s':''} before Nikhil & Prachi's wedding!`,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💍</text></svg>'
    });
    if(status) status.textContent = `✅ Reminder set for ${daysBefore} day${daysBefore>1?'s':''} before the wedding!`;
    // Schedule the actual reminder using setTimeout (works while tab is open)
    if(delay < 2147483647){ // max setTimeout value
      setTimeout(()=>{
        new Notification('Wedding Tomorrow! 💍', {
          body: `Nikhil & Prachi's wedding is in ${daysBefore} day${daysBefore>1?'s':''}! 10 May 2026, Sweta Lawn, Pune`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💍</text></svg>'
        });
      }, delay);
    }
  };

  // ── SAVE THE DATE CANVAS ──
  function drawSaveDate(){
    const canvas = el('std-canvas'); if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W=400, H=220;
    // Background
    const bg = ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,'#1a0404'); bg.addColorStop(0.5,'#0e0202'); bg.addColorStop(1,'#1a0404');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Gold border
    ctx.strokeStyle='rgba(201,168,76,0.6)'; ctx.lineWidth=2;
    ctx.strokeRect(8,8,W-16,H-16);
    ctx.strokeStyle='rgba(201,168,76,0.2)'; ctx.lineWidth=1;
    ctx.strokeRect(14,14,W-28,H-28);
    // Rose decorations
    ctx.font='28px serif'; ctx.fillText('🌹',12,40); ctx.fillText('🌹',W-42,40);
    ctx.fillText('🌸',12,H-12); ctx.fillText('🌸',W-42,H-12);
    // Save the Date text
    ctx.fillStyle='rgba(201,168,76,0.7)';
    ctx.font='600 11px Cinzel,serif';
    ctx.textAlign='center';
    ctx.fillText('✦  SAVE THE DATE  ✦', W/2, 50);
    // Names
    ctx.fillStyle='#ffffff';
    ctx.font='italic 42px Georgia,serif';
    ctx.fillText('Nikhil', W/2-60, 105);
    ctx.fillStyle='#C9A84C';
    ctx.font='italic 32px Georgia,serif';
    ctx.fillText('&', W/2, 100);
    ctx.fillStyle='#ffffff';
    ctx.font='italic 42px Georgia,serif';
    ctx.fillText('Prachi', W/2+55, 105);
    // Divider
    ctx.strokeStyle='rgba(201,168,76,0.4)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(80,118); ctx.lineTo(W-80,118); ctx.stroke();
    // Date
    ctx.fillStyle='#C9A84C';
    ctx.font='600 16px Cinzel,serif';
    ctx.fillText('10 · MAY · 2026', W/2, 142);
    // Venue
    ctx.fillStyle='rgba(237,224,204,0.6)';
    ctx.font='12px Poppins,sans-serif';
    ctx.fillText('Sweta Lawn, Nigdi, Pune', W/2, 165);
    // Bottom
    ctx.fillStyle='rgba(201,168,76,0.4)';
    ctx.font='10px Poppins,sans-serif';
    ctx.fillText('Together Forever  💍', W/2, 195);
    // Update WhatsApp share link
    const waBtn = el('std-wa-btn');
    if(waBtn){
      const msg = encodeURIComponent("Save the Date! 💍\nNikhil & Prachi are getting married!\n📅 10 May 2026\n📍 Sweta Lawn, Nigdi, Pune\n\nOpen invitation → "+window.location.href);
      waBtn.href = 'https://wa.me/?text='+msg;
    }
  }
  window.downloadSaveDate = function(){
    const canvas = el('std-canvas'); if(!canvas) return;
    const link = document.createElement('a');
    link.download = 'Nikhil-Prachi-SaveTheDate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ── PWA INSTALL ──
  let pwaPrompt = null;
  window.addEventListener('beforeinstallprompt', e=>{
    e.preventDefault(); pwaPrompt=e;
    const card=el('pwa-card'); if(card) card.style.display='block';
  });
  window.installPWA = async function(){
    if(!pwaPrompt) return;
    pwaPrompt.prompt();
    const result = await pwaPrompt.userChoice;
    if(result.outcome==='accepted'){ const c=el('pwa-card'); if(c) c.style.display='none'; }
    pwaPrompt=null;
  };

  // ── START ──
  // Register service worker for PWA
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
  // Security check first
  if(!checkSecurity()){
    showSecurityLock();
  } else {
    initLoader();
    setTimeout(drawSaveDate, 500);
  }

});
