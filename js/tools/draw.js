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