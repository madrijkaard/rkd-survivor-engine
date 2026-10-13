import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { julhoPoints } from '../src/julho-points.js';
import { JULHO_EAST, COELHO_MOUTH, julhoEastBuildings } from '../src/julho-east.js';
import { buildings, findPath, clearLine, moveActor, walkable, locationAt, imagePath } from '../src/world.js';
import { withCameraView, project, unproject } from '../src/projection.js';
import { buildingFootprint, footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { hasHomeWindows } from '../src/home-lighting.js';

const sequence=[19,20,21,22,23,24,25,26,28,27,29].map(id=>julhoPoints.find(p=>p.id===id));
test('Coelho: posições antigas preservadas, sequência completa e esquina reutilizada',async()=>{
  assert.deepEqual(julhoPoints.slice(0,18).map(p=>p.x),[0,-191,-319,-462,-604,-746,-890,-1047,-1202,-2223,-2171.2,-2038,-1917.8,-1793,-1670.8,-1548.5,-1426.2,-1337.6]);
  const manifest=JSON.parse(await readFile(new URL('../maps/vinte-e-oito-de-julho/manifest.json',import.meta.url)));
  assert.deepEqual(manifest.extensions.at(-1).routePointOrder,sequence.map(p=>p.id));
  assert.equal(manifest.extensions.at(-1).toStreet,'Rua Coelho Neto');
  assert.equal(JULHO_EAST.id,29);
  for(let i=1;i<sequence.length;i++)assert.ok(sequence[i].x>sequence[i-1].x&&sequence[i].x-sequence[i-1].x<180);
  for(let d=1;d<=8;d++)assert.deepEqual(await readFile(new URL('../'+imagePath(19,d,'vinte-e-oito-de-julho'),import.meta.url)),await readFile(new URL('../'+imagePath(20,d,'antonio-alexandre'),import.meta.url)));
  for(const b of julhoEastBuildings)for(const [p,d] of b.refs){assert.ok(sequence.some(v=>v.id===p));assert.ok(d>=1&&d<=8);}
});

test('Coelho: clique e caminhada percorrem todo o quarteirão e voltam nas quatro câmeras',()=>{
  for(let view=0;view<4;view++)withCameraView(view,()=>{
    const actor={x:836,y:-80};
    for(const dest of [...sequence,...sequence.slice().reverse()]){
      const screen=project(dest.x,dest.y),click=unproject(screen.x,screen.y),path=findPath(actor,click);
      assert.ok(path,`Sem caminho até ${dest.id}`);
      for(const p of path){assert.ok(clearLine(actor,p));let steps=0;while(Math.hypot(p.x-actor.x,p.y-actor.y)>.01){
        assert.ok(++steps<1500);const dx=p.x-actor.x,dy=p.y-actor.y,len=Math.hypot(dx,dy),s=Math.min(4,len);assert.ok(moveActor(actor,dx/len*s,dy/len*s));
      }}
      const here=locationAt(actor.x,actor.y);assert.equal(here.route.id,'vinte-e-oito-de-julho');assert.equal(here.point.id,dest.id);
    }
    assert.equal(locationAt(836,-80).route.id,'antonio-alexandre');
  });
});

test('Coelho: lotes fora dos passeios, esquinas únicas, interseção livre e limites do levantamento',()=>{
  const lots=buildings.map(b=>({...footprintObstacle(b),polygon:buildingFootprint(b)}));
  for(let x=950;x<JULHO_EAST.x-105;x+=11)for(let y=-194;y<=4;y+=11)assert.equal(lots.find(b=>hitsFootprint(x,y,b)),undefined,`${x}/${y}`);
  for(const id of ['aa-reabilitar','aa-school-last-wall','cinema'])assert.equal(buildings.filter(b=>b.id===id).length,1,id);
  for(const b of julhoEastBuildings){assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);if(b.residential===false)assert.equal(hasHomeWindows(b),false,b.id);}
  assert.ok(clearLine({x:950,y:-95},JULHO_EAST));
  for(const y of [-300,-95,150])assert.ok(walkable(JULHO_EAST.x,y));
  assert.equal(walkable(JULHO_EAST.x,COELHO_MOUTH.y-20),false);
  assert.ok(walkable(JULHO_EAST.x,COELHO_MOUTH.y+COELHO_MOUTH.h+20),"Coelho agora continua no sentido da Matriz");
  assert.equal(walkable(JULHO_EAST.x+150,-95),false,'O acesso de terra não representa outra rua mapeada');
});
