/* NIKHIL & PRACHI — script.js — SIMPLIFIED RELIABLE VERSION */
'use strict';

// ── HELPERS ──
function el(id){ return document.getElementById(id); }
function hide(id){ var e=el(id); if(e){ e.style.display='none'; e.style.opacity='0'; } }
function show(id, disp){ var e=el(id); if(e){ e.style.display=disp||'block'; setTimeout(function(){ e.style.opacity='1'; },20); } }

// ── GUEST NAME ──
function initGuest(){
  try{
    var p=new URLSearchParams(window.location.search);
    var g=p.get('guest');
    var w=el('welcomeText');
    if(w && g && g.trim()){
      var name=decodeURIComponent(g.trim()).replace(/\+/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
      w.textContent='Welcome '+name+' \uD83C\uDF89';
    }
  }catch(e){}
}

// ── PARTICLES ──
function mkCanvas(id,n,cols){
  var cv=el(id); if(!cv)return;
  var ctx=cv.getContext('2d');
  function resize(){ cv.width=cv.offsetWidth||window.innerWidth; cv.height=cv.offsetHeight||window.innerHeight; }
  resize();
  window.addEventListener('resize',resize);
  var pts=[];
  for(var i=0;i<n;i++){
    pts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.5+0.3,dx:(Math.random()-.5)*.3,dy:(Math.random()-.5)*.3,a:Math.random()*.4+.1,ph:Math.random()*6.28,c:cols[Math.floor(Math.random()*cols.length)]});
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    for(var i=0;i<pts.length;i++){
      var p=pts[i]; p.ph+=.02;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.28);
      ctx.fillStyle=p.c; ctx.globalAlpha=p.a*(0.7+0.3*Math.sin(p.ph)); ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>cv.width)p.dx*=-1;
      if(p.y<0||p.y>cv.height)p.dy*=-1;
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── STEP 3: SHOW MAIN SITE ──
function showMain(){
  // Hide everything else
  var loader=el('loader'); if(loader) loader.style.display='none';
  var card=el('photo-reveal'); if(card) card.style.display='none';
  var env=el('envelope'); if(env) env.style.display='none';

  var main=el('main');
  if(!main){ alert('Error: main element not found'); return; }

  main.classList.remove('hidden');
  main.style.display='block';
  main.style.opacity='0';
  main.style.transition='opacity 0.6s';

  setTimeout(function(){ main.style.opacity='1'; }, 50);

  // Init main features
  try{ mkCanvas('hc',50,['#C9A84C','#C41E3A','#8B1A2A']); }catch(e){}
  initCountdown();
  initReveal();
  initNav();
  initGallery();
  initGuest();
}

// ── STEP 2: SHOW INVITATION CARD ──
function showCard(){
  var loader=el('loader'); if(loader) loader.style.display='none';

  var card=el('photo-reveal');
  if(!card){ showMain(); return; }

  card.style.display='flex';
  card.style.opacity='0';
  card.style.transition='opacity 0.6s';
  card.classList.remove('hidden');
  setTimeout(function(){ card.style.opacity='1'; }, 50);

  // Particles on card
  try{ mkCanvas('pc',40,['#C9A84C','#C41E3A','#8B1A2A']); }catch(e){}

  // Button click → go to main
  var btn=el('photo-cta-btn');
  if(btn){
    btn.onclick=function(){
      playMusic();
      card.style.opacity='0';
      setTimeout(function(){ showMain(); }, 600);
    };
  }

  // Also tap anywhere on card screen → go to main (fallback)
  card.addEventListener('click', function(e){
    if(e.target===btn || (btn && btn.contains(e.target))) return;
    // tapping background also works
  });
}

// ── STEP 1: LOADER ──
function initLoader(){
  var loader=el('loader');
  if(!loader){ showCard(); return; }

  try{ mkCanvas('lc',40,['#C9A84C','#C41E3A','#E8C97A']); }catch(e){}

  // Animate progress bar
  var bar=el('l-bar');
  var circle=el('l-prog-circle');
  var pct=0;
  var iv=setInterval(function(){
    pct+=Math.random()*12+4;
    if(pct>100) pct=100;
    if(bar) bar.style.width=pct+'%';
    if(circle) circle.style.strokeDashoffset=339-(pct/100)*339;
    if(pct>=100) clearInterval(iv);
  },100);

  // Exit loader after 2.5s — GUARANTEED
  var exited=false;
  function doExit(){
    if(exited) return;
    exited=true;
    clearInterval(iv);
    loader.style.transition='opacity 0.5s';
    loader.style.opacity='0';
    setTimeout(function(){ loader.style.display='none'; showCard(); }, 550);
  }

  setTimeout(doExit, 2500);
  setTimeout(doExit, 4000); // backup
}

// ── COUNTDOWN ──
function initCountdown(){
  var target=new Date('2026-05-10T11:00:00+05:30').getTime();
  function tick(){
    var diff=target-Date.now(); if(diff<=0)return;
    function set(id,v){ var e=el(id); if(e) e.textContent=String(v).padStart(2,'0'); }
    var d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000);
    var m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    set('cd-d',d); set('cd-h',h); set('cd-m',m); set('cd-s',s);
    set('hcd-d',d); set('hcd-h',h); set('hcd-m',m); set('hcd-s',s);
  }
  tick();
  setInterval(tick,1000);
}

// ── SCROLL REVEAL ──
function initReveal(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  },{threshold:0.07});
  document.querySelectorAll('.reveal,.reveal-child').forEach(function(e){ obs.observe(e); });
}

// ── NAV ──
function initNav(){
  window.addEventListener('scroll',function(){
    var nav=el('nav'); if(nav) nav.classList.toggle('solid',window.scrollY>50);
    var fab=el('fab-top-btn'); if(fab) fab.style.display=window.scrollY>300?'flex':'none';
  });
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });
}
window.openNav=function(){ var p=el('nav-panel'); if(p){ p.classList.add('open'); document.body.style.overflow='hidden'; } };
window.closeNav=function(){ var p=el('nav-panel'); if(p){ p.classList.remove('open'); document.body.style.overflow=''; } };

// ── GALLERY ──
function initGallery(){
  document.querySelectorAll('.gt').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.gt').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      var cat=this.dataset.c;
      document.querySelectorAll('.gi').forEach(function(i){ i.style.display=(cat==='all'||i.dataset.c===cat)?'':'none'; });
    });
  });
  document.querySelectorAll('.gi').forEach(function(e,i){ e.addEventListener('click',function(){ openLb(i); }); });
}
var lbBg=['#3d0808','#1a0303','#3d2d0d','#0d1a3d','#0d3d0d','#2d0d3d'];
var lbLbl=['Pre-Wedding 1','Pre-Wedding 2','Engagement','Pre-Wedding 3','Celebration','Joy'];
var lbI=0;
function openLb(i){ lbI=i; showLb(); var l=el('lb'); if(l){l.classList.remove('hidden');l.style.display='flex';} }
function showLb(){
  var e=el('lb-img'); if(!e)return;
  e.style.cssText='background:'+lbBg[lbI]+';display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:.8rem;';
  e.textContent=lbLbl[lbI];
  var c=el('lb-caption'); if(c) c.textContent=lbLbl[lbI];
  var ct=el('lb-counter'); if(ct) ct.textContent=(lbI+1)+' / '+lbBg.length;
}
window.closeLb=function(){ var l=el('lb'); if(l){l.classList.add('hidden');l.style.display='none';} };
window.lbP=function(){ lbI=(lbI-1+lbBg.length)%lbBg.length; showLb(); };
window.lbN=function(){ lbI=(lbI+1)%lbBg.length; showLb(); };
window.openLb=openLb;

// ── EVENT MODAL ──
var VENUE='Sweta Lawn, Mata Amritanandamayi Math, Nigdi, Pune \u2013 411044';
var MURL='https://maps.google.com/?q=Mata+Amritanandamayi+Math+Nigdi+Pune';
var MSRC='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7700!3d18.6500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e4b7c3b1a1%3A0xabc!2sNigdi%2C+Pune!5e0!3m2!1sen!2sin!4v1680000000000';
var EVDATA={
  mehndi:  {icon:'\uD83C\uDF3F',title:'Mehndi Ceremony',  date:'8 May 2026', time:'4:00 PM onwards',venue:VENUE,dress:'Yellow / Green Traditional', mapSrc:MSRC,mapUrl:MURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mehndi+Ceremony&dates=20260508T160000/20260508T210000&location=Sweta+Lawn,+Nigdi,+Pune'},
  sangeet: {icon:'\uD83C\uDFB6',title:'Sangeet Night',    date:'9 May 2026', time:'7:00 PM onwards',venue:VENUE,dress:'Cocktail / Festive Colourful',mapSrc:MSRC,mapUrl:MURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+Night&dates=20260509T190000/20260509T235900&location=Sweta+Lawn,+Nigdi,+Pune'},
  wedding: {icon:'\uD83D\uDC8D',title:'Wedding Ceremony', date:'10 May 2026',time:'11:00 AM',        venue:VENUE,dress:'Traditional / Formal',        mapSrc:MSRC,mapUrl:MURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nikhil+%26+Prachi+Wedding&dates=20260510T110000/20260510T180000&location=Sweta+Lawn,+Nigdi,+Pune'},
  reception:{icon:'\uD83E\uDD42',title:'Wedding Reception',date:'10 May 2026',time:'7:00 PM onwards',venue:VENUE,dress:'Ethnic / Formal Elegant',     mapSrc:MSRC,mapUrl:MURL,calUrl:'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception&dates=20260510T190000/20260510T235900&location=Sweta+Lawn,+Nigdi,+Pune'}
};
window.openEventModal=function(key){
  var d=EVDATA[key]; if(!d)return;
  var m=el('event-modal'); if(!m)return;
  el('em-icon').textContent=d.icon; el('em-title').textContent=d.title;
  el('em-date').textContent=d.date; el('em-time').textContent=d.time;
  el('em-venue').textContent=d.venue; el('em-dress').textContent=d.dress;
  el('em-map').src=d.mapSrc; el('em-dir-btn').href=d.mapUrl; el('em-cal-btn').href=d.calUrl;
  m.classList.remove('hidden'); m.style.display='flex';
  document.body.style.overflow='hidden';
};
window.closeEventModal=function(){
  var m=el('event-modal'); if(!m)return;
  m.classList.add('hidden'); m.style.display='none';
  document.body.style.overflow='';
};

// ── RSVP ──
window.doRSVP=function(e){
  e.preventDefault();
  var f=el('rf'); if(f) f.classList.add('hidden');
  var ok=el('rsvp-ok'); if(ok) ok.classList.remove('hidden');
};

// ── WISHES ──
window.toggleWF=function(){ var w=el('wf'); if(w) w.classList.toggle('hidden'); };
window.addWish=function(){
  var n=el('wn').value.trim(), m=el('wm').value.trim(); if(!n||!m)return;
  var c=document.createElement('div'); c.className='wc';
  c.innerHTML='<span class="wq">"</span><p>'+m+'</p><span class="wa">— '+n+'</span>';
  var wl=el('wl'); if(wl) wl.prepend(c);
  el('wn').value=''; el('wm').value='';
  var wf=el('wf'); if(wf) wf.classList.add('hidden');
};

// ── MUSIC ──
var mOn=false;
function playMusic(){
  var a=el('aud'); if(!a)return;
  a.volume=0.35;
  a.play().then(function(){ mOn=true; updateMusicUI(); }).catch(function(){});
}
window.toggleMusic=function(){
  var a=el('aud'); if(!a)return;
  if(mOn){ a.pause(); mOn=false; } else { a.play().catch(function(){}); mOn=true; }
  updateMusicUI();
};
function updateMusicUI(){
  var t=el('npm-title'); if(t) t.textContent=mOn?'Stop Music':'Play Music';
  var tg=el('npm-toggle'); if(tg) tg.textContent=mOn?'\u23F8':'\u25B6';
  var nb=el('nav-music-btn'); if(nb) nb.textContent=mOn?'\u23F8':'\uD83C\uDFB5';
  var fi=el('music-fab-icon'); if(fi) fi.textContent=mOn?'\u23F8':'\uD83C\uDFB5';
  var fl=el('music-fab-label'); if(fl) fl.textContent=mOn?'Stop Music':'Play Music';
  var nm=el('np-music'); if(nm) nm.classList.toggle('playing',mOn);
}

// ── SHARE ──
window.doShare=function(){
  var d={title:'Nikhil & Prachi Wedding',text:"You're invited! 10 May 2026",url:window.location.href};
  if(navigator.share) navigator.share(d);
  else{ try{ navigator.clipboard.writeText(window.location.href).then(function(){ alert('Link copied!'); }); }catch(e){} }
};

// ── START — runs when DOM is ready ──
document.addEventListener('DOMContentLoaded', function(){
  initLoader();
});
