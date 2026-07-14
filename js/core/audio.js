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