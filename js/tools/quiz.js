/* ============================================================
   4) QUIZ
============================================================ */
INIT.quiz = function(){
  const card=document.getElementById('quizCard');
  const TOPICS=QUIZ_DATA;
  
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