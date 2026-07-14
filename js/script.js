const CDARK = {red:'#b73f3a',yellow:'#a97e1d',blue:'#3f63a8',purple:'#8b4fa5',green:'#2f7a63',orange:'#b96f22',mint:'#3f8a48',rose:'#c25f76'};

/* Hand-drawn line icons (no emoji) */
const ICONS = {
  roulette:'<circle cx="12" cy="12" r="9"/><circle class="fill" cx="12" cy="12" r="1.6"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/>',
  memo:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><line x1="8.5" y1="8" x2="15.5" y2="8"/><line x1="8.5" y1="12" x2="15.5" y2="12"/><line x1="8.5" y1="16" x2="13" y2="16"/>',
  draw:'<path d="M4 20 h4 L19 9 l-4 -4 L4 16 z"/><line x1="14" y1="6" x2="18" y2="10"/>',
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.3 9.4a2.7 2.7 0 1 1 3.5 2.6c-.9 .4 -1.3 1 -1.3 2"/><circle class="fill" cx="11.5" cy="16.4" r="0.7"/>',
  ladder:'<line x1="8" y1="3.5" x2="8" y2="20.5"/><line x1="16" y1="3.5" x2="16" y2="20.5"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/>',
  timer:'<line x1="9" y1="3" x2="15" y2="3"/><line x1="12" y1="3" x2="12" y2="5"/><circle cx="12" cy="13" r="8"/><line x1="12" y1="13" x2="12" y2="9"/><line x1="12" y1="13" x2="15" y2="14.5"/>',
  random:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle class="fill" cx="8.5" cy="8.5" r="1.4"/><circle class="fill" cx="15.5" cy="8.5" r="1.4"/><circle class="fill" cx="12" cy="12" r="1.4"/><circle class="fill" cx="8.5" cy="15.5" r="1.4"/><circle class="fill" cx="15.5" cy="15.5" r="1.4"/>',
  coin:'<ellipse cx="12" cy="12" rx="9" ry="9"/><path d="M8 8.5 L10 15 L12 10.5 L14 15 L16 8.5"/><line x1="8.6" y1="12" x2="15.4" y2="12"/>',
  bulb:'<path d="M9 16.5a5 5 0 1 1 6 0 v1.5 h-6 z"/><line x1="9.5" y1="20.5" x2="14.5" y2="20.5"/>',
  flask:'<path d="M10 3 v6 L5.5 18 a1.5 1.5 0 0 0 1.4 2 h10.2 a1.5 1.5 0 0 0 1.4 -2 L14 9 V3"/><line x1="9" y1="3" x2="15" y2="3"/><line x1="8" y1="14" x2="16" y2="14"/>',
  column:'<line x1="4" y1="20.5" x2="20" y2="20.5"/><path d="M4 8 L12 3.5 L20 8"/><line x1="7" y1="9" x2="7" y2="18"/><line x1="12" y1="9" x2="12" y2="18"/><line x1="17" y1="9" x2="17" y2="18"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/>',
  smile:'<circle cx="12" cy="12" r="9"/><circle class="fill" cx="9" cy="10" r="0.9"/><circle class="fill" cx="15" cy="10" r="0.9"/><path d="M8.5 14.5 a4 4 0 0 0 7 0"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle class="fill" cx="12" cy="12" r="1.6"/>'
};
function paintIcons(){
  document.querySelectorAll('[data-icon]').forEach(el=>{
    const svg=ICONS[el.dataset.icon]; if(!svg||el.dataset.painted)return;
    el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+svg+'</svg>';
    el.dataset.painted='1';
  });
}

const inited = {};
function go(id){
  const target = document.querySelector('.screen[data-screen="'+id+'"]') ? id : 'home';
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.dataset.screen===target));
  document.body.dataset.screen = target;
  if(location.hash !== '#'+target) history.pushState(null,'','#'+target);
  window.scrollTo({top:0});
  if(!inited[target] && INIT[target]){
  if(target === 'home'){
    requestAnimationFrame(() => {
      INIT[target]();
      inited[target] = true;
    });
  } else {
    INIT[target]();
    inited[target] = true;
  }
}
  if(REOPEN[target]) REOPEN[target]();
}
window.addEventListener('popstate', ()=>{
  const id = location.hash.replace('#','') || 'home';
  go(id);
});

/* Build home tiles */
(function buildHome(){
  const wrap = document.getElementById('rides');
  RIDES.forEach(r=>{
    const b = document.createElement('button');
    b.className='ride';
    b.style.setProperty('--c','var(--'+r.c+')');
    b.style.setProperty('--c-dark', CDARK[r.c]);
    b.style.setProperty('--sh', CDARK[r.c]+'33');
    b.innerHTML =
      '<div class="ride-emoji" data-icon="'+r.id+'" style="background:var(--'+r.c+')"></div>'+
      '<div><div class="ride-name">'+r.name+'</div><div class="ride-desc">'+r.desc+'</div></div>'+
      '<div class="ride-tag">'+r.tag+' →</div>';
    b.onclick = ()=>go(r.id);
    wrap.appendChild(b);
  });
  const flags = document.getElementById('flags');
  ['red','yellow','blue','purple','green','orange','mint','rose'].forEach(c=>{
    const s=document.createElement('span'); s.style.borderTopColor='var(--'+c+')'; flags.appendChild(s);
  });
  paintIcons();
})();

/* Shared audio */
function makeAudio(){
  const AC = window.AudioContext||window.webkitAudioContext;
  if(!AC) return {resume(){},tick(){},ding(){},beep(){}};
  const ac = new AC();
  const env=(o,g,t,dur,vol)=>{g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.02);g.gain.exponentialRampToValueAtTime(0.0005,t+dur);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+0.05);};
  return {
    resume(){if(ac.state==='suspended')ac.resume();},
    tick(){const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(1200,t);g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.0008,t+0.05);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+0.06);},
    ding(){const t=ac.currentTime;[523.25,659.25,783.99].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;env(o,g,t+i*0.06,0.6,0.12);});},
    beep(f){const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=f||880;env(o,g,t,0.25,0.1);}
  };
}
let AUDIO=null;
function audio(){AUDIO=AUDIO||makeAudio();AUDIO.resume();return AUDIO;}

/* ============================================================
   Storage helpers
============================================================ */

/* Boot */
(function(){const id=location.hash.replace('#','')||'home';go(id);})();