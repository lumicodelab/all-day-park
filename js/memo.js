/* ============================================================
   2) MEMO
============================================================ */
INIT.memo = function(){
  const board=document.getElementById('mmBoard');
  const COLORS=['#FDE68A','#BFDBFE','#C7F0D8','#F5C6D0','#E9D5FF','#FBD5A5'];
  let memos = load('park.memos', [{id:Date.now(),text:'여기에 메모를 적어요 ✏️',color:COLORS[0]}]);
  const persist=()=>save('park.memos',memos);
  function render(){
    board.innerHTML='';
    memos.forEach(m=>{
      const el=document.createElement('div');el.className='memo';el.style.background=m.color;
      const ta=document.createElement('textarea');ta.value=m.text;ta.placeholder='메모…';
      ta.oninput=()=>{m.text=ta.value;persist();};
      const bar=document.createElement('div');bar.className='memo-bar';
      COLORS.forEach(c=>{const s=document.createElement('span');s.className='memo-color';s.style.background=c;s.onclick=()=>{m.color=c;persist();render();};bar.appendChild(s);});
      const del=document.createElement('button');del.className='memo-del';del.textContent='🗑';
      del.onclick=()=>{memos=memos.filter(x=>x.id!==m.id);persist();render();};
      bar.appendChild(del);
      el.append(ta,bar);board.appendChild(el);
    });
  }
  document.getElementById('mmAdd').onclick=()=>{memos.unshift({id:Date.now(),text:'',color:COLORS[Math.floor(Math.random()*COLORS.length)]});persist();render();};
  render();
};