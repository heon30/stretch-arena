(function(root){
'use strict';
// Predict only the local display. Health, hits, rounds and rankings stay authoritative.
function create(E){
 const clone=g=>JSON.parse(JSON.stringify(g));
 let predicted=null,history=[],sequence=0,acc=0,errorX=0,errorY=0,identity='',lastAck=0;
 function simulate(g,input,slot){
  const controls=[{},{}];controls[slot]=input;
  const immunity=g.fighters.map(f=>f.inv);g.fighters.forEach(f=>f.inv=Infinity);
  g.time=60;E.step(g,controls);
  g.fighters.forEach((f,i)=>f.inv=Math.max(0,immunity[i]-E.STEP));
 }
 function reset(){predicted=null;history=[];sequence=0;acc=0;errorX=errorY=0;identity='';lastAck=0}
 function receive(g,slot,ack,now,rtt){
  const key=[g.round,g.map,...g.ids].join(':');
  if(key!==identity||g.phase!=='playing'||predicted?.phase!=='playing') {history=[];acc=0;errorX=errorY=0;identity=key;predicted=clone(g);lastAck=Number(ack)||0;return}
  const previous=predicted.fighters[slot],wasHP=previous.hp;
  if(Number.isFinite(ack)){lastAck=ack;history=history.filter(h=>h.seq>ack)}
  else history=history.filter(h=>h.at>now-Math.min(250,rtt||100)); // Compatible with older servers during rollout.
  predicted=clone(g);
  for(const h of history)simulate(predicted,h.input,slot);
  const next=predicted.fighters[slot],dx=previous.x+errorX-next.x,dy=previous.y+errorY-next.y;
  if(Math.hypot(dx,dy)<90&&wasHP===g.fighters[slot].hp){errorX=dx;errorY=dy}else errorX=errorY=0;
 }
 function advance(dt,slot,getInput,send,now){
  if(!predicted||predicted.phase!=='playing')return;
  acc+=Math.min(dt,.05);
  while(acc>=E.STEP){acc-=E.STEP;const input=getInput(),h={seq:++sequence,at:now,input};history.push(h);if(history.length>120)history.shift();simulate(predicted,input,slot);send(h)}
  const decay=Math.exp(-dt/0.045);errorX*=decay;errorY*=decay;
 }
 function fighter(slot){if(!predicted)return null;const f=predicted.fighters[slot];return{...f,x:Math.max(42,Math.min(E.W-42,f.x+errorX)),y:f.y+errorY}}
 return{reset,receive,advance,fighter,get pending(){return history.length},get ack(){return lastAck}};
}
if(typeof module!=='undefined'&&module.exports)module.exports={create};else root.ArenaNetcode={create};
})(typeof globalThis==='undefined'?this:globalThis);
