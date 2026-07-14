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