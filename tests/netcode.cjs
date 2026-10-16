const assert=require('node:assert/strict'),E=require('../src/engine.cjs'),{create}=require('../src/netcode.cjs');
const g=E.create([0,1]),p=create(E);p.receive(g,0,0,0,180);let sent=[];
p.advance(E.STEP,0,()=>({move:1,jump:true,attack:true}),h=>sent.push(h),16);
assert(p.fighter(0).y<g.fighters[0].y);assert(p.fighter(0).attack);assert.equal(g.fighters[0].y,E.FLOOR);assert.equal(g.fighters[0].attack,null);
const authoritative=JSON.parse(JSON.stringify(g));E.step(authoritative,[sent[0].input,{}]);p.receive(authoritative,0,sent[0].seq,200,180);assert.equal(p.pending,0);assert.equal(p.fighter(0).y,authoritative.fighters[0].y);
for(let i=0;i<60;i++){p.advance(E.STEP,0,()=>({move:0}),h=>sent.push(h),220+i*17);E.step(authoritative,[{move:0},{}]);p.receive(authoritative,0,sent.at(-1).seq,220+i*17,180)}
assert.equal(p.pending,0);assert(Math.abs(p.fighter(0).x-authoritative.fighters[0].x)<.01);
authoritative.phase='paused';p.receive(authoritative,0,sent.at(-1).seq,1400,180);p.advance(.1,0,()=>({jump:true}),()=>assert.fail('paused input sent'),1500);
const next=E.survival([2,3],1,2);p.receive(next,0,sent.at(-1).seq,1600,180);assert.equal(p.fighter(0).id,2);assert.equal(p.pending,0);
p.reset();p.receive(g,1,0,0,180);p.advance(E.STEP,1,()=>({move:-1,jump:true}),h=>assert.equal(h.seq,1),16);assert(p.fighter(1).y<E.FLOOR);assert.equal(g.fighters[1].y,E.FLOOR);
console.log('PASS prediction, jump/attack before server reply, authoritative state isolation, acknowledgement, pause/round/reconnect and 2P slot');
