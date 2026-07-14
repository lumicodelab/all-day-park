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