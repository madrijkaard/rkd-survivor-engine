import test from 'node:test';
import assert from 'node:assert/strict';
import { antonioPoints, antonioPath, antonioCenter, ANTONIO_NORTH } from '../src/antonio-data.js';
import { buildings, locationAt, clearLine, findPath, moveActor, walkable } from '../src/world.js';
import { footprintObstacle, hitsFootprint, buildingPlanPoint } from '../src/building-geometry.js';

test('a extensão preserva os vinte pontos antigos e ordena espacialmente os novos IDs',()=>{
  const old=[[1257,2345],[1224,2234],[1205,2109],[1182,1983],[1148,1863],[1095,1753],[1035,1627],[979,1503],[925,1369],[911,1227],[917,1092],[925,960],[926,832],[924,706],[917,577],[904,446],[897,314],[882,184],[868,47],[836,-80]];
  assert.deepEqual(antonioPoints.slice(0,20).map(p=>[p.x,p.y]),old);
  assert.equal(ANTONIO_NORTH.id,33);
  assert.deepEqual(antonioPath.filter(p=>p.id>20).map(p=>p.id),[33,32,31,30,29,28,27,26,25,23,24,22,34,21]);
});

test('é possível cruzar a Cônego, chegar à Henrique e voltar por caminhada e clique',()=>{
  const route=antonioPath.filter(p=>p.y>=2234).toReversed();
  for(const points of [route,route.toReversed()]){
    const actor={...points[0]};
    for(const dest of points.slice(1)){
      assert.ok(clearLine(actor,dest));
      const path=findPath(actor,dest);assert.ok(path?.length);
      for(const step of path){
        let count=0;
        while(Math.hypot(step.x-actor.x,step.y-actor.y)>.001){
          assert.ok(++count<1000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),s=Math.min(4,d);
          assert.ok(moveActor(actor,dx/d*s,dy/d*s));
        }
      }
      const here=locationAt(actor.x,actor.y);assert.equal(here.route.id,'antonio-alexandre');assert.equal(here.point.id,dest.id);
    }
  }
  assert.ok(findPath(ANTONIO_NORTH,{x:ANTONIO_NORTH.x+220,y:ANTONIO_NORTH.y}));
  assert.ok(walkable(ANTONIO_NORTH.x,ANTONIO_NORTH.y+90),'Braço curto representa a continuação do cruzamento');
  assert.equal(walkable(ANTONIO_NORTH.x,ANTONIO_NORTH.y+160),false,'Fim da cobertura na esquina');
});

test('casas e muros da extensão deixam a rua livre e as esquinas são volumes únicos',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let y=2415;y<4075;y+=8)for(const dx of [-50,0,50]){
    const x=antonioCenter(y)+dx;
    assert.equal(lots.find(o=>hitsFootprint(x,y,o,3)),undefined,`Lote sobre a rua em ${x},${y}`);
  }
  for(const id of ['cm-n06-jardim-rosa','cm-igreja-praca'])assert.equal(buildings.filter(b=>b.id===id).length,1);
  assert.equal(buildings.find(b=>b.id==='cm-n06-jardim-rosa').local.crossFacade.street,'antonio-alexandre');
  for(const b of buildings.filter(b=>b.id.startsWith('am-')&&!b.id.includes('esquina'))){
    const p=buildingPlanPoint(b,b.x+b.depth/2,b.y+b.length/2);
    assert.equal(walkable(p.x,p.y),false,b.id);
  }
});
