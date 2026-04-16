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
    initCountdown(); initReveal(); initNav(); initGallery();
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
  const PUNE_VENUE='Sweta Lawn, Mata Amritanandamayi Math, Nigdi, Pune – 411044';
  const PUNE_MAP='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7700!3d18.6500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e4b7c3b1a1%3A0xabc!2sNigdi%2C+Pune!5e0!3m2!1sen!2sin!4v1680000000000';
  const PUNE_URL='https://maps.google.com/?q=Mata+Amritanandamayi+Math+Nigdi+Pune';

  const EVDATA={
    // GROOM EVENTS (real data)
    g_gondhal:  {icon:'🪔',title:'Gondhal Ceremony',       date:'5 May 2026', time:'Evening',         venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Traditional Attire',        mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gondhal+Ceremony&dates=20260505T180000/20260505T220000&location=Rajapeth,+Amravati'},
    g_mehendi:  {icon:'🌿',title:'Mehendi Ceremony',       date:'6 May 2026', time:'Afternoon',        venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Casual / Traditional',       mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehendi+Ceremony&dates=20260506T140000/20260506T200000&location=Rajapeth,+Amravati'},
    g_haldi:    {icon:'🌼',title:'Haldi & Devkundi',       date:'7 May 2026', time:'Morning',          venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Yellow / White Traditional', mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+%26+Devkundi&dates=20260507T090000/20260507T140000&location=Rajapeth,+Amravati'},
    g_travel:   {icon:'�',title:'Departure to Pune',      date:'8 May 2026', time:'Morning',          venue:'Amravati → Pune',               dress:'Comfortable Travel Wear',    mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Travel+to+Pune&dates=20260508T080000/20260508T200000'},
    g_arrival:  {icon:'🏡',title:'Arrival & Preparations', date:'9 May 2026', time:'All Day',          venue:PUNE_VENUE,                      dress:'Comfortable',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Arrival+in+Pune&dates=20260509T100000/20260509T200000&location=Nigdi,+Pune'},
    g_wedding:  {icon:'💍',title:'Wedding Ceremony 💍',    date:'10 May 2026',time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Sherwani / Formal',          mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikhil+%26+Prachi+Wedding&dates=20260510T110000/20260510T180000&location=Sweta+Lawn,+Nigdi,+Pune'},
    g_return:   {icon:'🏠',title:'Return to Amravati',     date:'11 May 2026',time:'Morning',          venue:'Pune → Amravati',               dress:'Comfortable',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Return+to+Amravati&dates=20260511T080000/20260511T200000'},
    g_reception:{icon:'🥂',title:'Reception & Satyanarayan',date:'12 May 2026',time:'Evening',         venue:"Nikhil's Home, "+AMRAVATI_ADDR, dress:'Ethnic / Formal Elegant',    mapSrc:AMRAVATI_MAP,mapUrl:AMRAVATI_URL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reception+%26+Satyanarayan&dates=20260512T170000/20260512T235900&location=Rajapeth,+Amravati'},
    g_pune2:    {icon:'🙏',title:'Satyanarayan Pooja',     date:'14 May 2026',time:'Morning',          venue:PUNE_VENUE,                      dress:'Traditional',                mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Satyanarayan+Pooja&dates=20260514T100000/20260514T140000&location=Nigdi,+Pune'},
    // BRIDE EVENTS
    b_mehndi:   {icon:'🌿',title:'Mehndi Ceremony',        date:'8 May 2026', time:'4:00 PM onwards',  venue:PUNE_VENUE,                      dress:'Yellow / Green Traditional', mapSrc:PUNE_MAP,    mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehndi+Ceremony&dates=20260508T160000/20260508T210000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_sangeet:  {icon:'🎶',title:'Sangeet Night',          date:'9 May 2026', time:'7:00 PM onwards',  venue:PUNE_VENUE,                      dress:'Cocktail / Festive Colourful',mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+Night&dates=20260509T190000/20260509T235900&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_haldi:    {icon:'🌼',title:'Haldi Ceremony',         date:'9 May 2026', time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Yellow / Floral Traditional', mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+Ceremony&dates=20260509T110000/20260509T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_wedding:  {icon:'💍',title:'Wedding Ceremony 💍',    date:'10 May 2026',time:'11:00 AM',         venue:PUNE_VENUE,                      dress:'Bridal Lehenga / Traditional',mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony&dates=20260510T110000/20260510T140000&location=Sweta+Lawn,+Nigdi,+Pune'},
    b_vidaai:   {icon:'🌸',title:'Vidaai',                 date:'10 May 2026',time:'2:00 PM',          venue:PUNE_VENUE,                      dress:'Bridal Attire',               mapSrc:PUNE_MAP,   mapUrl:PUNE_URL,    calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vidaai&dates=20260510T140000/20260510T160000&location=Sweta+Lawn,+Nigdi,+Pune'},
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
      tag: 'College Days',
      title: 'आमची EDC प्रॅक्टिकल स्टोरी',
      body: `खूप वर्षांपूर्वीची गोष्ट आहे… कॉलेजचे दिवस… आणि त्या दिवसांची एक खास आठवण 💫

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
त्या दिवशीच्या त्या स्मोकमध्ये… मला माझं प्रेम सापडलं होतं ❤️`
    },
    {
      emoji: '🌄',
      tag: 'First Trip Together',
      title: 'चिचाटी ट्रिप आणि 5:45 ची ट्विस्ट',
      body: `तो दिवस अजूनही ताजा आहे…

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
पण त्या दिवसाची आठवण मात्र आजही माझ्या मनात fresh आहे ❤️`
    },
    {
      emoji: '🌴',
      tag: 'Goa Trip',
      title: 'गोवा ट्रिप… आणि प्रेमाची सुरुवात',
      body: `कोरोनानंतरचं ते वर्ष…
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
प्रेम हळूहळू सुरू झालं होतं… ❤️✨`
    }
  ];

  window.openStory = function(i){
    const s=STORIES[i]; if(!s)return;
    const m=el('story-modal'); if(!m)return;
    el('sm-emoji').textContent=s.emoji;
    el('sm-tag').textContent=s.tag;
    el('sm-title').textContent=s.title;
    el('sm-body').textContent=s.body;
    m.classList.remove('hidden'); m.style.display='flex';
    document.body.style.overflow='hidden';
    // Scroll to top of modal
    setTimeout(()=>{ const c=m.querySelector('.sm-card'); if(c) c.scrollTop=0; },50);
  };
  window.closeStory = function(){
    const m=el('story-modal'); if(!m)return;
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
  // Update WhatsApp link with actual page URL
  const waBtn=el('wa-share-btn');
  if(waBtn){
    const msg=encodeURIComponent("You're invited to Nikhil & Prachi's Wedding! 💍\n📅 10 May 2026 | Sweta Lawn, Nigdi, Pune\n\nOpen invitation → "+window.location.href);
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
    triggerConfetti();
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
  initLoader();

});
