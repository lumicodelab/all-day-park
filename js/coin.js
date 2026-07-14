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