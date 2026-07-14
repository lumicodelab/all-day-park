/* ============================================================
   1) ROULETTE
============================================================ */
INIT.roulette = function(){
  const TAU=Math.PI*2;
  const PAL=['#F2A65A','#E8615B','#5FB49C','#7C9EDB','#C58BD6','#F2C14E','#6FBF73','#EB8DA0'];
  const canvas=document.getElementById('rlWheel'), ctx=canvas.getContext('2d');
  const listEl=document.getElementById('rlList'), countEl=document.getElementById('rlCount');
  const resEl=document.getElementById('rlResult'), spinBtn=document.getElementById('rlSpin');
  let items = load('park.roulette', ['짜장면','초밥','치킨']);
  let rot=0, spinning=false, winner=null;

  const pmod=(a,m)=>((a%m)+m)%m;
  const widx=(r,n)=> n<=0?0: Math.floor(pmod(-r,TAU)/(TAU/n))%n;
  function fit(t,max){if(ctx.measureText(t).width<=max)return t;let s=t;while(s.length>1&&ctx.measureText(s+'…').width>max)s=s.slice(0,-1);return s+'…';}
  function draw(){
    const dpr=window.devicePixelRatio||1, css=canvas.clientWidth||320, px=Math.round(css*dpr);
    if(canvas.width!==px){canvas.width=px;canvas.height=px;}
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,css,css);
    const cx=css/2,cy=css/2,r=css/2-3,n=items.length; if(!n)return; const seg=TAU/n;
    for(let i=0;i<n;i++){const a0=-Math.PI/2+rot+i*seg;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a0,a0+seg);ctx.closePath();ctx.fillStyle=PAL[i%PAL.length];ctx.fill();ctx.strokeStyle='#faf6ef';ctx.lineWidth=3;ctx.stroke();}
    ctx.font='600 15px "Space Grotesk",system-ui,sans-serif';
    for(let i=0;i<n;i++){const mid=-Math.PI/2+rot+(i+0.5)*seg;ctx.save();ctx.translate(cx,cy);ctx.rotate(mid);ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(fit(String(items[i]),r-26),r-16,0);ctx.restore();}
    ctx.beginPath();ctx.arc(cx,cy,44,0,TAU);ctx.fillStyle='#faf6ef';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(58,51,44,.10)';ctx.stroke();
  }
  function renderList(){
    countEl.textContent=items.length; listEl.innerHTML='';
    items.forEach((t,i)=>{
      const row=document.createElement('div');row.className='row';
      const dot=document.createElement('span');dot.className='dot';dot.style.background=PAL[i%PAL.length];
      const inp=document.createElement('input');inp.value=t;inp.oninput=e=>{items[i]=e.target.value;save('park.roulette',items);};
      const del=document.createElement('button');del.className='del';del.textContent='×';
      del.onclick=()=>{items.splice(i,1);winner=null;save('park.roulette',items);renderList();res('');draw();};
      row.append(dot,inp,del);listEl.appendChild(row);
    });
  }
  function res(v){resEl.textContent=v||'';}
  function spin(){
    if(spinning||items.length<2)return; const a=audio();
    const start=rot, delta=(6+Math.random()*3)*TAU+Math.random()*TAU, target=start+delta, n=items.length, dur=4300, t0=performance.now();
    let last=-1; spinning=true; winner=null; spinBtn.disabled=true; res('');
    (function step(now){
      const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3); rot=start+delta*e; draw();
      const s=widx(rot,n); if(s!==last){last=s;a.tick();}
      if(p<1)requestAnimationFrame(step);
      else{rot=target;winner=widx(rot,n);spinning=false;spinBtn.disabled=false;a.ding();res(items[winner]);}
    })(performance.now());
  }
  spinBtn.onclick=spin;
  document.getElementById('rlAdd').onclick=()=>{items.push('새 항목');save('park.roulette',items);renderList();draw();};
  window.addEventListener('resize',()=>{if(document.body.dataset.screen==='roulette')draw();});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(draw);
  renderList(); draw();
  REOPEN.roulette=draw;
};