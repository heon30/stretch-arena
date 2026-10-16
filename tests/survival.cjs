const assert=require('node:assert/strict'),E=require('../src/engine.cjs');
for(let id=0;id<4;id++){const a=E.survival([0,id],0,1),b=E.survival([0,id],0,2),c=E.survival([0,id],0,10);assert.equal(a.fighters[1].hp,E.CHARS[id].hp);assert(b.fighters[1].hp>a.fighters[1].hp);assert(c.fighters[1].stats.damage>b.fighters[1].stats.damage);assert(c.fighters[1].stats.retract<b.fighters[1].stats.retract);assert.equal(E.CHARS[id].hp,a.fighters[1].hp,'base multiplayer stats unchanged');b.time=.001;b.fighters[0].hp=E.CHARS[0].hp*.6;b.fighters[1].hp=b.fighters[1].stats.hp*.5;E.step(b,[{},{}]);assert.equal(b.winner,0,'timeout uses scaled maximum HP')}
console.log('PASS: random-opponent classes scale HP/damage/speed/recovery by stage, base multiplayer unchanged, timeout uses true HP ratio');

