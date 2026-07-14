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