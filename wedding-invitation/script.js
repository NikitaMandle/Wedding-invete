/* NIKHIL & PRACHI — script.js */
// API key is stored server-side in Vercel environment variables.
// All AI requests go through /api/chat proxy — key never exposed to browser.
const CHAT_ENDPOINT = "/api/chat";

// ── CANVAS PARTICLES ──
function mkCanvas(id,n,cols){
  const cv=document.getElementById(id);if(!cv)return;
  const ctx=cv.getContext('2d');
  const resize=()=>{cv.width=cv.offsetWidth||window.innerWidth;cv.height=cv.offsetHeight||window.innerHeight};
  resize();window.addEventListener('resize',resize);
  const pts=Array.from({length:n},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.8+0.3,dx:(Math.random()-.5)*.28,dy:(Math.random()-.5)*.28,a:Math.random()*.45+.08,ph:Math.random()*Math.PI*2,c:cols[Math.floor(Math.random()*cols.length)]}));
  (function draw(){ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.ph+=.018;const a=p.a*(.7+.3*Math.sin(p.ph));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.globalAlpha=a;ctx.fill();p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>cv.width)p.dx*=-1;if(p.y<0||p.y>cv.height)p.dy*=-1});ctx.globalAlpha=1;requestAnimationFrame(draw)})();
}

// ── PETALS ──
function mkPetals(id,n){
  const c=document.getElementById(id);if(!c)return;
  const em=['🌹','🌸','🌺','🌷','✿','❀'];
  for(let i=0;i<n;i++){const p=document.createElement('div');p.className='ep';p.textContent=em[Math.floor(Math.random()*em.length)];p.style.left=Math.random()*100+'%';p.style.fontSize=(Math.random()*.8+.6)+'rem';p.style.animationDuration=(Math.random()*5+5)+'s';p.style.animationDelay=(Math.random()*4)+'s';c.appendChild(p);}
}

// ── LOADER ──
(function(){
  const loader=document.getElementById('loader');
  mkCanvas('lc',50,['#C9A84C','#C41E3A','#E8C97A','#8B1A2A']);
  let p=0;const iv=setInterval(()=>{p+=Math.random()*14+4;if(p>=100){p=100;clearInterval(iv);}},100);
  setTimeout(()=>{loader.classList.add('out');setTimeout(()=>{loader.style.display='none';showPhoto();},1000);},2600);
})();

// ── STEP 2: PHOTO REVEAL ──
function showPhoto(){
  const el=document.getElementById('photo-reveal');
  el.classList.remove('hidden');
  mkCanvas('pc',60,['#C9A84C','#C41E3A','#8B1A2A','#E8C97A']);
  // Petals go INSIDE the clipped container only
  const pp=document.getElementById('pp');
  if(pp){
    const em=['🌹','🌸','🌺','🌷','✿'];
    for(let i=0;i<12;i++){
      const p=document.createElement('div');p.className='ep';
      p.textContent=em[Math.floor(Math.random()*em.length)];
      p.style.left=Math.random()*100+'%';
      p.style.fontSize=(Math.random()*.6+.5)+'rem';
      p.style.animationDuration=(Math.random()*6+6)+'s';
      p.style.animationDelay=(Math.random()*5)+'s';
      pp.appendChild(p);
    }
  }
  document.getElementById('photo-cta-btn').addEventListener('click',startEnvelope);
}

// ── STEP 3: ENVELOPE ──
function startEnvelope(){
  const photo=document.getElementById('photo-reveal');
  const env=document.getElementById('envelope');
  playMusic();
  photo.style.transition='opacity .5s';photo.style.opacity='0';
  setTimeout(()=>{
    photo.classList.add('hidden');
    env.classList.remove('hidden');
    env.style.opacity='0';env.style.transition='opacity .5s';
    mkCanvas('envc',45,['#C9A84C','#C41E3A']);
    mkPetals('envp',14);
    setTimeout(()=>{env.style.opacity='1';},50);
    setTimeout(()=>{document.getElementById('eflap').classList.add('open');document.getElementById('eseal').classList.add('gone');},700);
    setTimeout(()=>{document.getElementById('ecrev').classList.add('up');},1900);
    setTimeout(()=>{document.getElementById('eburst').classList.add('on');},2700);
    setTimeout(()=>{
      env.style.opacity='0';
      setTimeout(()=>{env.classList.add('hidden');const main=document.getElementById('main');main.classList.remove('hidden');main.style.opacity='0';main.style.transition='opacity .7s';setTimeout(()=>{main.style.opacity='1';},50);initMain();},600);
    },3700);
  },500);
}

// ── MAIN INIT ──
function initMain(){
  mkCanvas('hc',60,['#C9A84C','#C41E3A','#8B1A2A']);
  initCountdown();initReveal();initNav();initGallery();
}

// ── COUNTDOWN ──
function initCountdown(){
  const t=new Date('2026-05-10T11:00:00+05:30').getTime();
  function tick(){
    const diff=t-Date.now();if(diff<=0)return;
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=String(v).padStart(2,'0')};
    set('cd-d',Math.floor(diff/86400000));set('cd-h',Math.floor((diff%86400000)/3600000));
    set('cd-m',Math.floor((diff%3600000)/60000));set('cd-s',Math.floor((diff%60000)/1000));
  }
  tick();setInterval(tick,1000);
}

// ── SCROLL REVEAL ──
function initReveal(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:.07});
  document.querySelectorAll('.reveal,.reveal-child').forEach(el=>obs.observe(el));
}

// ── NAV ──
function initNav(){
  window.addEventListener('scroll',()=>{
    document.getElementById('nav').classList.toggle('solid',window.scrollY>50);
    const fab=document.getElementById('fab-top-btn');
    if(fab) fab.classList.toggle('visible', window.scrollY>300);
  });
  document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}});});
}
function openNav(){document.getElementById('nav-panel').classList.add('open');document.body.style.overflow='hidden';}
function closeNav(){document.getElementById('nav-panel').classList.remove('open');document.body.style.overflow='';}

// ── GALLERY ──
function initGallery(){
  document.querySelectorAll('.gt').forEach(btn=>{btn.addEventListener('click',function(){document.querySelectorAll('.gt').forEach(b=>b.classList.remove('active'));this.classList.add('active');const c=this.dataset.c;document.querySelectorAll('.gi').forEach(i=>{i.style.display=(c==='all'||i.dataset.c===c)?'':'none';});});});
  document.querySelectorAll('.gi').forEach((el,i)=>el.addEventListener('click',()=>openLb(i)));
}
const lbBg=['#3d0808','#1a0303','#3d2d0d','#0d1a3d','#0d3d0d','#2d0d3d'];
const lbLbl=['Pre-Wedding 1','Pre-Wedding 2','Engagement','Pre-Wedding 3','Celebration','Joy'];
let lbI=0;
function openLb(i){lbI=i;showLb();document.getElementById('lb').classList.remove('hidden');}
function showLb(){const el=document.getElementById('lb-img');el.style.cssText='background:'+lbBg[lbI]+';display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.45);font-size:.82rem;letter-spacing:1px;';el.textContent=lbLbl[lbI];}
function closeLb(){document.getElementById('lb').classList.add('hidden');}
function lbP(){lbI=(lbI-1+lbBg.length)%lbBg.length;showLb();}
function lbN(){lbI=(lbI+1)%lbBg.length;showLb();}

// ── RSVP ──
function doRSVP(e){e.preventDefault();document.getElementById('rf').classList.add('hidden');document.getElementById('rsvp-ok').classList.remove('hidden');}

// ── WISHES ──
function toggleWF(){document.getElementById('wf').classList.toggle('hidden');}
function addWish(){
  const n=document.getElementById('wn').value.trim(),m=document.getElementById('wm').value.trim();
  if(!n||!m)return;
  const c=document.createElement('div');c.className='wc';
  c.innerHTML='<span class="wq">"</span><p>'+m+'</p><span class="wa">— '+n+'</span>';
  document.getElementById('wl').prepend(c);
  document.getElementById('wn').value='';document.getElementById('wm').value='';
  document.getElementById('wf').classList.add('hidden');
}

// ── MUSIC ──
let mOn=false;
function playMusic(){
  const a=document.getElementById('aud');a.volume=.35;
  a.play().then(()=>{mOn=true;updateMusicUI();}).catch(()=>{});
}
function toggleMusic(){
  const a=document.getElementById('aud');
  if(mOn){a.pause();mOn=false;}else{a.play().catch(()=>{});mOn=true;}
  updateMusicUI();
}
function updateMusicUI(){
  const wrap=document.getElementById('np-music');
  const icon=document.getElementById('npm-icon');
  const title=document.getElementById('npm-title');
  const toggle=document.getElementById('npm-toggle');
  if(mOn){wrap.classList.add('playing');icon.textContent='🎵';title.textContent='Stop Music';toggle.textContent='⏸';}
  else{wrap.classList.remove('playing');icon.textContent='🎵';title.textContent='Play Music';toggle.textContent='▶';}
}

// ── SHARE ──
function doShare(){
  const d={title:'Nikhil & Prachi Wedding',text:"You're invited to our wedding on 10 May 2026! 💍",url:window.location.href};
  if(navigator.share)navigator.share(d);
  else navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!')).catch(()=>{});
}
function scrollTop(){window.scrollTo({top:0,behavior:'smooth'});}

// ── CHATBOT (Groq AI) ──
let botOpen=false;
function toggleBot(){botOpen=!botOpen;document.getElementById('bot-win').classList.toggle('open',botOpen);if(botOpen)setTimeout(()=>document.getElementById('bot-inp').focus(),300);}
function botQ(t){document.getElementById('bot-inp').value=t;botSend();}
async function botSend(){
  const inp=document.getElementById('bot-inp'),t=inp.value.trim();
  if(!t)return;inp.value='';
  addBotMsg(t,'user');
  const tid=addTyping();
  try{
    const res=await fetch(CHAT_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:t})
    });
    removeTyping(tid);
    if(!res.ok)throw new Error('err');
    const d=await res.json();
    addBotMsg(d.reply,'bot');
  }catch(e){
    removeTyping(tid);
    addBotMsg(localReply(t),'bot');
  }
}
function localReply(m){
  const q=m.toLowerCase();
  if(q.match(/event|program|timing|schedule/))return'🎉 Events:\n🌿 Mehndi — 8 May, 4PM\n🎶 Sangeet — 9 May, 7PM\n💍 Wedding — 10 May, 11AM\n🥂 Reception — 10 May, 7PM\nAll at Sweta Lawn, Nigdi, Pune';
  if(q.match(/venue|location|where|address|sweta|nigdi|pune/))return'📍 Sweta Lawn\nMata Amritanandamayi Math\nNigdi, Pune – 411044';
  if(q.match(/dress|wear|attire|code/))return'👗 Dress Code:\n🌿 Mehndi: Yellow/Green\n🎶 Sangeet: Cocktail/Festive\n💍 Wedding: Traditional/Formal\n🥂 Reception: Ethnic/Formal';
  if(q.match(/rsvp|confirm|attend/))return'✉ Scroll to the RSVP section and fill in the form to confirm your attendance!';
  if(q.match(/date|when|may/))return'💍 Wedding: 10 May 2026\nMehndi: 8 May · Sangeet: 9 May · Reception: 10 May evening';
  if(q.match(/hi|hello|hey/))return'Namaste! 🙏 Welcome to Nikhil & Prachi\'s wedding! How can I help you?';
  return'I can help with events, venue, dress code, RSVP and more! What would you like to know? 🌹';
}
function addBotMsg(txt,role){
  const msgs=document.getElementById('bot-msgs');
  const d=document.createElement('div');d.className='bm '+role;
  d.innerHTML='<div class="bb">'+txt.replace(/\n/g,'<br/>')+'</div>';
  msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
}
function addTyping(){
  const msgs=document.getElementById('bot-msgs'),id='ty'+Date.now();
  const d=document.createElement('div');d.className='bm bot';d.id=id;
  d.innerHTML='<div class="bb"><div class="tdots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return id;
}
function removeTyping(id){const el=document.getElementById(id);if(el)el.remove();}
