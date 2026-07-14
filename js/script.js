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
   3) DRAWING
============================================================ */
INIT.draw = function(){
  const canvas=document.getElementById('dwCanvas'), ctx=canvas.getContext('2d');
  const COLORS=['#3a332c','#e8615b','#F2A65A','#F2C14E','#5FB49C','#7C9EDB','#C58BD6','#ffffff'];
  let color=COLORS[0], penSize=6, eraseSize=20, drawing=false, erase=false, last=null;
  const sw=document.getElementById('dwSwatches');
  const eraseBtn=document.getElementById('dwErase');
  const ring=document.getElementById('dwRing');
  const penChip=document.getElementById('dwPenChip');
  const eraseChip=document.getElementById('dwEraseChip');
  const penInput=document.getElementById('dwPenSize');
  const eraseInput=document.getElementById('dwEraseSize');
  const custom=document.getElementById('dwCustom');
  function clearActive(){[...sw.children].forEach(x=>x.classList.remove('active'));}
  function curSize(){return erase?eraseSize:penSize;}
  function curDiameter(){return Math.max(1,curSize());}
  function syncRing(){const d=curDiameter();ring.style.width=d+'px';ring.style.height=d+'px';ring.classList.toggle('erasing',erase);}
  function setErase(on){erase=on;eraseBtn.classList.toggle('active',erase);syncRing();}
  COLORS.forEach((c,i)=>{const b=document.createElement('div');b.className='sw'+(i===0?' active':'');b.style.background=c;b.onclick=()=>{color=c;setErase(false);clearActive();b.classList.add('active');};sw.appendChild(b);});
 function applyCustomColor(e){
  color = e.target.value;
  setErase(false);
  drawing = false;
  last = null;
}

custom.oninput = e => {
    const v = e.target.value.trim();

    if(/^#[0-9A-Fa-f]{6}$/.test(v)){
        color = v;
        setErase(false);
        drawing = false;
        last = null;
        custom.style.borderColor = v;
    }
};
  penInput.oninput=e=>{penSize=+e.target.value;penChip.textContent=penSize;setErase(false);syncRing();};
  eraseInput.oninput=e=>{eraseSize=+e.target.value;eraseChip.textContent=eraseSize;setErase(true);syncRing();};
  eraseBtn.onclick=()=>setErase(!erase);
  document.getElementById('dwClear').onclick=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);};
  document.getElementById('dwSave').onclick=()=>{const a=document.createElement('a');a.download='그림.png';a.href=canvas.toDataURL('image/png');a.click();};

  function fit(){
    const w=canvas.clientWidth||600, h=Math.round(w*0.62);
    const dpr=window.devicePixelRatio||1;
    // preserve existing drawing
    const prev=canvas.width?ctx.getImageData(0,0,canvas.width,canvas.height):null;
    canvas.style.height=h+'px'; canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h);
  }
  function pos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
  function showRing(p){ring.style.display='block';ring.style.left=p.x+'px';ring.style.top=p.y+'px';}
  function start(e){drawing=true;last=pos(e);showRing(last);e.preventDefault();}
  function move(e){const p=pos(e);showRing(p);if(!drawing)return;ctx.strokeStyle=erase?'#fff':color;ctx.lineWidth=curDiameter();ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault();}
  function end(){
  drawing=false;
  last=null;
  ring.style.display='none';
}
 canvas.addEventListener('mousedown',start);
canvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',end);

window.addEventListener('blur',end);
document.addEventListener('mouseleave',end);

canvas.addEventListener('mouseenter',()=>{ring.style.display='block';});
canvas.addEventListener('mouseleave',()=>{end(); ring.style.display='none';});

canvas.addEventListener('touchstart',start,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
canvas.addEventListener('touchend',end);
canvas.addEventListener('touchcancel',end);
  syncRing(); fit();
  REOPEN.draw=()=>{if(!canvas.width)fit();};
};

/* ============================================================
   4) QUIZ
============================================================ */
INIT.quiz = function(){
  const card=document.getElementById('quizCard');
  const TOPICS=[
    {key:'common', name:'상식', emoji:'💡', c:'#F2A65A', qs:[
      {q:'대한민국의 수도는?',opts:['부산','서울','인천','대전'],a:1,d:1},
      {q:'1년은 며칠일까요? (평년)',opts:['360','364','365','366'],a:2,d:1},
      {q:'신호등 색이 아닌 것은?',opts:['빨강','노랑','파랑','초록'],a:2,d:1},
      {q:'태양계에서 가장 큰 행성은?',opts:['지구','토성','목성','화성'],a:2,d:2},
      {q:'무지개에서 파장이 가장 긴 색은?',opts:['보라','초록','빨강','파랑'],a:2,d:2},
      {q:'대한민국 국회의원의 임기는 몇 년일까요?',opts:['3년','4년','5년','6년'],a:1,d:2},
      {q:'우리 몸에서 가장 작은 뼈가 있는 곳은?',opts:['손끝','귓속','발가락','코'],a:1,d:3},
      {q:'다이아몬드는 어떤 원소로 이루어져 있을까요?',opts:['규소','탄소','산소','철'],a:1,d:3},
      {q:'번개가 친 뒤 천둥이 늦게 들리는 이유는?',opts:['빛보다 소리가 느려서','소리가 반사돼서','귀가 늦게 반응해서','전기가 약해서'],a:0,d:3},
    ]},
    {key:'science', name:'과학', emoji:'🔬', c:'#5FB49C', qs:[
      {q:'물의 화학식은?',opts:['CO₂','O₂','H₂O','NaCl'],a:2,d:1},
      {q:'사람의 심장은 몇 개의 방으로 이루어져 있나요?',opts:['2','3','4','5'],a:2,d:1},
      {q:'식물이 광합성으로 흡수하는 기체는?',opts:['산소','이산화탄소','질소','수소'],a:1,d:1},
      {q:'빛의 속도는 약 초속 몇 km일까요?',opts:['3천','3만','30만','300만'],a:2,d:2},
      {q:'성인의 정상 체온은 약 몇 ℃일까요?',opts:['34.5','36.5','38.5','40.5'],a:1,d:2},
      {q:'소리가 가장 빠르게 전달되는 매질은?',opts:['공기','물','철','진공'],a:2,d:2},
      {q:'원자에서 음(−)전하를 띠는 입자는?',opts:['양성자','중성자','전자','광자'],a:2,d:3},
      {q:'DNA의 이중나선 구조를 밝힌 과학자는?',opts:['멘델','왓슨과 크릭','다윈','파스퇴르'],a:1,d:3},
      {q:'뉴턴의 운동 제2법칙이 나타내는 관계는?',opts:['F = ma','E = mc²','V = IR','PV = nRT'],a:0,d:3},
    ]},
    {key:'history', name:'역사', emoji:'🏛️', c:'#C58BD6', qs:[
      {q:'훈민정음을 창제한 왕은?',opts:['태조','세종대왕','정조','광개토대왕'],a:1,d:1},
      {q:'거북선을 이끈 조선의 장군은?',opts:['강감찬','이순신','권율','김유신'],a:1,d:1},
      {q:'고려를 세운 인물은?',opts:['왕건','이성계','견훤','궁예'],a:0,d:1},
      {q:'대한민국 임시정부가 수립된 해는?',opts:['1910','1919','1945','1948'],a:1,d:2},
      {q:'삼국시대에 속하지 않는 나라는?',opts:['고구려','백제','신라','발해'],a:3,d:2},
      {q:'조선을 건국한 인물은?',opts:['정몽주','이성계','최영','정도전'],a:1,d:2},
      {q:'조선의 법전 《경국대전》을 완성·반포한 왕은?',opts:['태종','세조','성종','중종'],a:2,d:3},
      {q:'평양 천도를 단행한 고구려의 왕은?',opts:['장수왕','소수림왕','미천왕','고국천왕'],a:0,d:3},
      {q:'제1차 세계대전의 직접적 계기가 된 사건은?',opts:['진주만 공습','사라예보 사건','러시아 혁명','베르사유 조약'],a:1,d:3},
    ]},
    {key:'world', name:'세계', emoji:'🌍', c:'#7C9EDB', qs:[
      {q:'세계에서 가장 큰 대양은?',opts:['대서양','태평양','인도양','북극해'],a:1,d:1},
      {q:'에펠탑이 있는 도시는?',opts:['런던','로마','파리','베를린'],a:2,d:1},
      {q:'미국의 수도는?',opts:['뉴욕','워싱턴 D.C.','LA','시카고'],a:1,d:1},
      {q:'세계에서 가장 높은 산은?',opts:['K2','에베레스트','한라산','후지산'],a:1,d:2},
      {q:'가장 인구가 많은 대륙은?',opts:['아프리카','유럽','아시아','남아메리카'],a:2,d:2},
      {q:'세계에서 가장 긴 강은?',opts:['아마존강','나일강','양쯔강','미시시피강'],a:1,d:2},
      {q:'호주의 수도는?',opts:['시드니','멜버른','캔버라','브리즈번'],a:2,d:3},
      {q:'유로화를 사용하지 않는 나라는?',opts:['독일','프랑스','스위스','스페인'],a:2,d:3},
      {q:'세계에서 국토 면적이 가장 넓은 나라는?',opts:['중국','미국','캐나다','러시아'],a:3,d:3},
    ]},
    {key:'fun', name:'넌센스', emoji:'🤪', c:'#e8615b', qs:[
      {q:'세상에서 가장 뜨거운 과일은?',opts:['천도복숭아','불수감','핫도그','열대과일'],a:0,d:1},
      {q:'문은 문인데 못 여는 문은?',opts:['소문','대문','정문','뒷문'],a:0,d:1},
      {q:'개가 사람을 가르치면?',opts:['개인교습','멍멍교실','도그스쿨','핫도그'],a:0,d:1},
      {q:'왕이 넘어지면?',opts:['킹콩','왕자','넘어진왕','폐하'],a:0,d:2},
      {q:'아몬드가 죽으면?',opts:['다이아몬드','호두','피스타치오','땅콩'],a:0,d:2},
      {q:'가장 빠른 닭은?',opts:['후다닥','통닭','번개닭','치킨런'],a:0,d:2},
      {q:'세상에서 가장 억울한 도형은?',opts:['삼각형','사다리꼴','원','마름모'],a:1,d:3},
      {q:'소가 웃으면 한 마디로?',opts:['우하하','소리','와우','음메'],a:1,d:3},
      {q:'발이 두 개 달린 소는?',opts:['이발소','한우','젖소','황소'],a:0,d:3},
    ]},
  ];
  const DIFFS=[{v:0,name:'전체'},{v:1,name:'쉬움'},{v:2,name:'보통'},{v:3,name:'어려움'}];
  let diff=0;
  const filt=qs=>diff===0?qs:qs.filter(q=>q.d===diff);

  let quiz=[], idx=0, score=0, answered=false, curTopic=null;

  function menu(){
    card.innerHTML=
      '<div class="quiz-q" style="text-align:center;margin-bottom:14px;">주제를 골라주세요</div>'+
      '<div class="tabs" id="qzDiff" style="margin-bottom:18px;"></div>'+
      '<div class="topic-grid" id="qzTopics"></div>';
    const dbox=document.getElementById('qzDiff');
    DIFFS.forEach(d=>{
      const b=document.createElement('button');b.className='tab'+(d.v===diff?' active':'');b.textContent=d.name;
      b.onclick=()=>{diff=d.v;menu();};
      dbox.appendChild(b);
    });
    const g=document.getElementById('qzTopics');
  const ICONKEY={common:'bulb',science:'flask',history:'column',world:'globe',fun:'smile'};
    TOPICS.forEach(t=>{
      const cnt=filt(t.qs).length;
      const b=document.createElement('button');b.className='topic-card';b.style.setProperty('--tc',t.c);
      b.disabled=cnt===0;
      b.innerHTML='<span class="topic-emoji" data-icon="'+ICONKEY[t.key]+'" style="background:'+t.c+'"></span>'+
        '<span class="topic-name">'+t.name+'</span><span class="topic-meta">'+cnt+'문제</span>';
      b.onclick=()=>startTopic(t);
      g.appendChild(b);
    });
    const all=document.createElement('button');all.className='topic-card all';all.style.setProperty('--tc','#3a332c');
    const total=TOPICS.reduce((n,t)=>n+filt(t.qs).length,0);
    all.innerHTML='<span class="topic-emoji" data-icon="target" style="background:#3a332c"></span>'+
      '<span class="topic-name">전체 도전</span><span class="topic-meta">'+Math.min(total,10)+'문제 · 랜덤</span>';
    all.onclick=()=>startTopic({name:'전체',c:'#3a332c',qs:shuffle(TOPICS.flatMap(t=>filt(t.qs))).slice(0,10)});
    g.appendChild(all);
    paintIcons();
  }
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function startTopic(t){curTopic=t;quiz=shuffle(filt(t.qs));idx=0;score=0;answered=false;render();}

  function render(){
    if(idx>=quiz.length){
      const full=score===quiz.length;
      const pct=Math.round(score/quiz.length*100);
      card.innerHTML='<div style="text-align:center;padding:16px;">'+
        '<div class="score-badge" style="background:'+curTopic.c+'"><div><b>'+score+'</b><span>/'+quiz.length+'</span></div></div>'+
        '<div class="quiz-q" style="margin-top:14px">'+(full?'만점입니다!':pct>=60?'잘했어요!':'좋은 도전이었어요')+'</div>'+
        '<p class="hint">'+curTopic.name+' · 정답 '+score+'/'+quiz.length+'</p>'+
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">'+
        '<button class="btn" id="qzRe">다시 풀기</button>'+
        '<button class="btn ghost" id="qzMenu">주제 선택</button></div></div>';
      document.getElementById('qzRe').onclick=()=>startTopic(curTopic);
      document.getElementById('qzMenu').onclick=menu;
      return;
    }
    const cur=quiz[idx], c=curTopic.c;
    card.innerHTML=
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'+
        '<span class="topic-pill" style="background:'+c+'22;color:'+c+'">'+curTopic.name+'</span>'+
        '<button class="btn ghost sm" id="qzBack">← 주제</button></div>'+
      '<div class="progressbar"><i style="width:'+(idx/quiz.length*100)+'%;background:'+c+'"></i></div>'+
      '<div style="display:flex;justify-content:space-between;margin:14px 0 4px;" class="hint"><span>문제 '+(idx+1)+' / '+quiz.length+'</span><span>점수 '+score+'</span></div>'+
      '<div class="quiz-q">'+cur.q+'</div>'+
      '<div class="quiz-opts" id="qzOpts"></div>';
    document.getElementById('qzBack').onclick=menu;
    const box=document.getElementById('qzOpts');
    cur.opts.forEach((o,i)=>{
      const b=document.createElement('button');b.className='opt';b.textContent=o;
      b.onclick=()=>{
        if(answered)return; answered=true; const a=audio();
        [...box.children].forEach(c=>c.disabled=true);
        if(i===cur.a){b.classList.add('correct');score++;a.beep(880);}
        else{b.classList.add('wrong');box.children[cur.a].classList.add('correct');a.beep(200);}
        setTimeout(()=>{idx++;answered=false;render();},900);
      };
      box.appendChild(b);
    });
  }
  menu();
  REOPEN.quiz=()=>{if(idx>=quiz.length||!curTopic)menu();};
};

/* ============================================================
   5) LADDER (Ghost leg)
============================================================ */
INIT.ladder = function(){
  const canvas=document.getElementById('ldCanvas'), ctx=canvas.getContext('2d');
  const namesBox=document.getElementById('ldNames'), resBox=document.getElementById('ldResults');
  const resultEl=document.getElementById('ldResult');
  const PAL=['#E8615B','#5FB49C','#7C9EDB','#C58BD6','#F2A65A','#6FBF73'];
  let n=3, names=['A','B','C'], results=['🍫','🥤','💸'], rungs=[], animating=false;

  function buildInputs(){
    const mk=(box,arr,key)=>{box.innerHTML='';arr.forEach((v,i)=>{const inp=document.createElement('input');inp.className='field';inp.value=v;inp.style.borderLeft='5px solid '+PAL[i%PAL.length];inp.oninput=e=>arr[i]=e.target.value;box.appendChild(inp);});};
    mk(namesBox,names);mk(resBox,results);
  }
  function genRungs(){
    rungs=[]; const rows=8;
    for(let r=0;r<rows;r++){for(let c=0;c<n-1;c++){ if(Math.random()<0.32){ if(!rungs.some(x=>x.row===r&&(x.col===c-1||x.col===c+1))) rungs.push({row:r,col:c}); } }}
  }
  function layout(){
    const dpr=window.devicePixelRatio||1, w=canvas.clientWidth||520, h=340;
    canvas.style.height=h+'px'; canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); return {w,h};
  }
  const rows=8;
  function colX(w,i){const pad=w*0.09;return pad+(w-2*pad)*(i/(n-1||1));}
  function rowY(h,r){const top=40,bot=h-40;return top+(bot-top)*(r/(rows));}
  function draw(path){
    const {w,h}=layout();
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth=3;ctx.strokeStyle='#e2d8c8';
    for(let i=0;i<n;i++){const x=colX(w,i);ctx.beginPath();ctx.moveTo(x,rowY(h,0));ctx.lineTo(x,rowY(h,rows));ctx.stroke();}
    rungs.forEach(rg=>{const x0=colX(w,rg.col),x1=colX(w,rg.col+1),y=rowY(h,rg.row+0.5);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();});
    // caps
    for(let i=0;i<n;i++){const x=colX(w,i);[0,rows].forEach(r=>{ctx.beginPath();ctx.arc(x,rowY(h,r),6,0,7);ctx.fillStyle=PAL[i%PAL.length];ctx.fill();});}
    if(path){ctx.lineWidth=5;ctx.strokeStyle=path.color;ctx.beginPath();path.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}
  }
  function trace(start){
    const {w,h}=layout(); let col=start; const pts=[{x:colX(w,col),y:rowY(h,0)}];
    for(let r=0;r<rows;r++){
      pts.push({x:colX(w,col),y:rowY(h,r+0.5)});
      const left=rungs.find(x=>x.row===r&&x.col===col-1), right=rungs.find(x=>x.row===r&&x.col===col);
      if(right){col++;pts.push({x:colX(w,col),y:rowY(h,r+0.5)});}
      else if(left){col--;pts.push({x:colX(w,col),y:rowY(h,r+0.5)});}
    }
    pts.push({x:colX(w,col),y:rowY(h,rows)});
    return {col,pts};
  }
  function run(start){
    if(animating)return; animating=true; resultEl.textContent='';
    const t=trace(start), full=t.pts, col=t.color=PAL[start%PAL.length];
    let i=1; const seg=[full[0]];
    (function step(){
      if(i<full.length){seg.push(full[i]);draw({pts:seg.slice(),color:col});i++;setTimeout(step,90);}
      else{animating=false;audio().ding();resultEl.innerHTML='<span style="color:'+col+'">'+ (names[start]||'?') +'</span> → '+(results[t.col]||'?');}
    })();
  }
  function setN(v){n=Math.max(2,Math.min(6,v));
    while(names.length<n){names.push(String.fromCharCode(65+names.length));}names=names.slice(0,n);
    while(results.length<n){results.push('🎁');}results=results.slice(0,n);
    buildInputs();genRungs();draw();resultEl.textContent='';
  }
  namesBox.addEventListener('click',e=>{});
  // clicking a name input's top cap: use buttons row instead -> click name to run
  namesBox.addEventListener('dblclick',()=>{});
  document.getElementById('ldPlus').onclick=()=>setN(n+1);
  document.getElementById('ldMinus').onclick=()=>setN(n-1);
  document.getElementById('ldShuffle').onclick=()=>{genRungs();draw();resultEl.textContent='';};
  document.getElementById('ldRunAll').onclick=()=>{
    const map=names.map((nm,i)=>nm+' → '+(results[trace(i).col]||'?'));
    resultEl.style.fontSize='16px';resultEl.innerHTML=map.join('<br>');
  };
  // click on canvas top area to pick a lane
  canvas.addEventListener('click',e=>{
    const {w,h}=layout(); const r=canvas.getBoundingClientRect(); const x=e.clientX-r.left;
    let best=0,bd=1e9; for(let i=0;i<n;i++){const d=Math.abs(colX(w,i)-x);if(d<bd){bd=d;best=i;}}
    resultEl.style.fontSize='22px'; run(best);
  });
  buildInputs();genRungs();
  REOPEN.ladder=()=>draw();
  draw();
};

/* ============================================================
   6) TIMER / STOPWATCH
============================================================ */
INIT.timer = function(){
  const tabs=document.querySelectorAll('[data-screen="timer"] .tab');
  const swPane=document.getElementById('swPane'), tmPane=document.getElementById('tmPane');
  tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');
    const m=t.dataset.mode; swPane.style.display=m==='stopwatch'?'':'none'; tmPane.style.display=m==='timer'?'':'none';});

  // Stopwatch
  const swClock=document.getElementById('swClock');
  let swRun=false, swStart=0, swAcc=0, swRAF=null, laps=[];
  const fmt=ms=>{const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,cs=Math.floor(ms/10)%100;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'<small>.'+String(cs).padStart(2,'0')+'</small>';};
  function swTick(){const ms=swAcc+(swRun?performance.now()-swStart:0);swClock.innerHTML=fmt(ms);if(swRun)swRAF=requestAnimationFrame(swTick);}
  document.getElementById('swStart').onclick=function(){
    if(swRun){swAcc+=performance.now()-swStart;swRun=false;this.textContent='시작';document.getElementById('swLap').disabled=true;cancelAnimationFrame(swRAF);}
    else{swStart=performance.now();swRun=true;this.textContent='정지';document.getElementById('swLap').disabled=false;swTick();}
  };
  document.getElementById('swLap').onclick=()=>{const ms=swAcc+(swRun?performance.now()-swStart:0);laps.unshift(ms);renderLaps();};
  document.getElementById('swReset').onclick=()=>{swRun=false;swAcc=0;laps=[];cancelAnimationFrame(swRAF);swClock.innerHTML=fmt(0);document.getElementById('swStart').textContent='시작';document.getElementById('swLap').disabled=true;renderLaps();};
  function renderLaps(){const box=document.getElementById('swLaps');box.innerHTML='';laps.forEach((ms,i)=>{const d=document.createElement('div');d.className='lap';d.innerHTML='<span>랩 '+(laps.length-i)+'</span><span>'+fmt(ms).replace(/<\/?small>/g,'')+'</span>';box.appendChild(d);});}
  swClock.innerHTML=fmt(0);

  // Timer
  const tmClock=document.getElementById('tmClock');
  let tmRun=false, tmEnd=0, tmRAF=null, tmLeft=300000;
  const fmt2=ms=>{ms=Math.max(0,ms);const m=Math.floor(ms/60000),s=Math.ceil(ms/1000)%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');};
  function setFromInputs(){const m=+document.getElementById('tmMin').value||0,s=+document.getElementById('tmSec').value||0;tmLeft=(m*60+s)*1000;tmClock.textContent=fmt2(tmLeft);}
  document.getElementById('tmMin').oninput=()=>{if(!tmRun)setFromInputs();};
  document.getElementById('tmSec').oninput=()=>{if(!tmRun)setFromInputs();};
  function tmTick(){const left=tmEnd-performance.now();tmClock.textContent=fmt2(left);
    if(left<=0){tmRun=false;document.getElementById('tmStart').textContent='시작';const a=audio();[0,300,600].forEach(d=>setTimeout(()=>a.beep(660),d));tmClock.textContent='00:00';return;}
    tmRAF=requestAnimationFrame(tmTick);}
  document.getElementById('tmStart').onclick=function(){
    if(tmRun){tmLeft=tmEnd-performance.now();tmRun=false;this.textContent='시작';cancelAnimationFrame(tmRAF);}
    else{if(tmLeft<=0)setFromInputs();if(tmLeft<=0)return;tmEnd=performance.now()+tmLeft;tmRun=true;this.textContent='정지';audio();tmTick();}
  };
  document.getElementById('tmReset').onclick=()=>{tmRun=false;cancelAnimationFrame(tmRAF);setFromInputs();document.getElementById('tmStart').textContent='시작';};
  setFromInputs();
};

/* ============================================================
   7) RANDOM NUMBER
============================================================ */
INIT.random = function(){
  const big=document.getElementById('rnBig'), chips=document.getElementById('rnChips'), btn=document.getElementById('rnDraw');
  btn.onclick=()=>{
    let lo=parseInt(document.getElementById('rnMin').value,10), hi=parseInt(document.getElementById('rnMax').value,10);
    let cnt=Math.max(1,parseInt(document.getElementById('rnCount').value,10)||1);
    const uniq=document.getElementById('rnUnique').checked;
    if(isNaN(lo)||isNaN(hi))return; if(lo>hi){const t=lo;lo=hi;hi=t;}
    const span=hi-lo+1; if(uniq)cnt=Math.min(cnt,span);
    const a=audio();
    const pick=()=>{
      if(uniq){const pool=[];for(let i=lo;i<=hi;i++)pool.push(i);for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,cnt).sort((x,y)=>x-y);}
      return Array.from({length:cnt},()=>lo+Math.floor(Math.random()*span));
    };
    // roll animation
    let ticks=0; chips.innerHTML='';
    const iv=setInterval(()=>{
      const r=lo+Math.floor(Math.random()*span); big.textContent=r; a.tick(); ticks++;
      if(ticks>16){clearInterval(iv);const out=pick();a.ding();
        if(cnt===1){big.textContent=out[0];chips.innerHTML='';}
        else{big.textContent='';chips.innerHTML='';out.forEach(v=>{const c=document.createElement('div');c.className='chip';c.textContent=v;chips.appendChild(c);});}
      }
    },70);
  };
};

/* ============================================================
   8) COIN FLIP
============================================================ */
INIT.coin = function(){
  const el=document.getElementById('coinEl'), resEl=document.getElementById('coinResult');
  const btn=document.getElementById('coinFlip');
  const fEl=document.getElementById('coinFront'), bEl=document.getElementById('coinBack'), tEl=document.getElementById('coinTotal');
  let deg=0, flipping=false;
  let tally=load('park.coin',{front:0,back:0});
  function paint(){fEl.textContent=tally.front;bEl.textContent=tally.back;tEl.textContent=tally.front+tally.back;}
  function flip(){
    if(flipping)return; flipping=true; btn.disabled=true; resEl.textContent=''; const a=audio();
    const back=Math.random()<0.5;
    const base=Math.ceil(deg/360)*360;
    deg=base+360*5+(back?180:0);
    if(deg<=base)deg+=360;
    el.style.transform='rotateY('+deg+'deg)';
    let ticks=0; const iv=setInterval(()=>{a.tick();if(++ticks>10)clearInterval(iv);},170);
    setTimeout(()=>{
      flipping=false; btn.disabled=false; clearInterval(iv);
      if(back){tally.back++;resEl.textContent='뒤!';}else{tally.front++;resEl.textContent='앞!';}
      save('park.coin',tally); paint(); a.ding();
    },2350);
  }
  btn.onclick=flip;
  document.getElementById('coinReset').onclick=()=>{tally={front:0,back:0};save('park.coin',tally);paint();resEl.textContent='';};
  paint();
};

/* ============================================================
   Storage helpers
============================================================ */

/* Boot */
(function(){const id=location.hash.replace('#','')||'home';go(id);})();