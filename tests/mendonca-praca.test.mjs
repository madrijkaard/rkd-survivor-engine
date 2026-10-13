import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mendoncaPoints, CROSS_Y } from '../src/mendonca-data.js';
import { MENDONCA_WEST_END, ALCEBIADES_MOUTH, mendoncaPracaBuildings } from '../src/mendonca-praca.js';
import { START, crossPoints, buildings, findPath, clearLine, moveActor, locationAt, walkable, WORLD_BOUNDS } from '../src/world.js';
import { FERNANDO_X } from '../src/fernando-data.js';
import { MENDONCA_ROAD } from '../src/road-profiles.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { footprintObstacle, hitsFootprint } from '../src/building-geometry.js';

test('Cônego/Praça: preserva 22 posições, reutiliza a esquina e mantém 64 fotos novas distintas',async()=>{
  assert.deepEqual(mendoncaPoints.filter(p=>p.id<=22).map(p=>p.x),[0,141,287,429,569,713,852,990,1127,1272,1424,1571,1721,1863,2015,-162,-315,-489,-652,-813,-971,-1132]);
  const m=JSON.parse(await readFile(new URL('../maps/conego-mendonca/manifest.json',import.meta.url),'utf8'));
  const e=m.extensions.find(e=>e.fromPoint===23);
  assert.equal(e.toStreet,'Praça Alcebíades Silva');assert.equal(e.toPoint,31);
  assert.deepEqual(e.routePointOrder,[22,23,24,25,26,27,28,29,30,31]);
  const hashes=new Set();
  for(const p of mendoncaPoints.filter(p=>p.id>=23&&p.id<=31)){
    assert.equal(p.y,CROSS_Y);assert.equal(p.pano,m.points[p.id-1].pano);
    assert.equal(p.imageryDate,'2025-06');assert.ok(p.sourceUrl.includes(p.pano));
    if(p.id>23)assert.ok(p.x<mendoncaPoints[p.id-2].x);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL(`../maps/conego-mendonca/ponto-${p.id}/${d}.jpg`,import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      if(p.id===23)assert.deepEqual(bytes,await readFile(new URL(`../maps/fernando-carvalho/ponto-17/${d}.jpg`,import.meta.url)));
      else hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(hashes.size,64);assert.equal(mendoncaPoints.find(p=>p.id===23).x,FERNANDO_X);
  assert.ok(WORLD_BOUNDS.x<MENDONCA_WEST_END.x-235);
});

test('Cônego/Praça: caminha desde a Fernando até a interseção e retorna, com fotos corretas nas quatro câmeras',()=>{
  const ordered=Array.from({length:10},(_,i)=>crossPoints.find(p=>p.id===i+22));
  assert.ok(findPath(START,MENDONCA_WEST_END)?.length,'A expansão é alcançável desde o começo do jogo');
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const actor={...ordered[0]};
    for(const destination of [...ordered,...ordered.slice().reverse()]){
      const screen=project(destination.x,destination.y),ground=unproject(screen.x,screen.y),path=findPath(actor,ground);
      assert.ok(path?.length);
      for(const step of path){
        assert.ok(clearLine(actor,step));let guard=0;
        while(Math.hypot(step.x-actor.x,step.y-actor.y)>.001){
          assert.ok(++guard<2000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),stride=Math.min(d,5);
          assert.ok(moveActor(actor,dx/d*stride,dy/d*stride));
        }
      }
      const loc=locationAt(actor.x,actor.y);assert.equal(loc.route.id,'conego-mendonca');assert.equal(loc.point.id,destination.id);
    }
  });
  assert.ok(clearLine(MENDONCA_WEST_END,{x:MENDONCA_WEST_END.x,y:CROSS_Y-230}),'A boca da praça está aberta');
  assert.equal(walkable(MENDONCA_WEST_END.x,CROSS_Y-320),true,'A expansão posterior abriu a rota própria da Praça Alcebíades Silva');
  assert.equal(walkable(MENDONCA_WEST_END.x-270,CROSS_Y),true,'A continuação posterior até a São Benedito mantém a ligação aberta');
});

test('Cônego/Praça: volumes compartilhados únicos e lotes fora da pista, passeios e boca da praça',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let x=MENDONCA_WEST_END.x-225;x<FERNANDO_X-105;x+=9)for(const dy of [-97,-63,0,63,97])
    assert.equal(lots.find(o=>hitsFootprint(x,CROSS_Y+dy,o,2)),undefined,`${x}/${dy}`);
  for(let y=ALCEBIADES_MOUTH.y+10;y<CROSS_Y;y+=9)for(const dx of [-97,0,97])
    assert.equal(lots.find(o=>hitsFootprint(MENDONCA_WEST_END.x+dx,y,o,2)),undefined,'Esquina da Metalmar deixa passar');
  for(const id of ['fc-clinica-sublime','fc-terreno-esquina']){
    const found=buildings.filter(b=>b.id===id);assert.equal(found.length,1);
    assert.equal(found[0].x+found[0].depth,FERNANDO_X-MENDONCA_ROAD.outerHalfWidth,'Frente da Fernando preservada');
    assert.equal(found[0].crossFacade.street,'conego-mendonca');
  }
  for(const b of mendoncaPracaBuildings){
    assert.equal(b.local.length,b.depth);assert.equal(b.local.depth,b.length);
    assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);
    for(const [p,d] of b.refs){assert.ok(p>=23&&p<=31);assert.ok(d>=1&&d<=8);}
  }
  const metalmar=buildings.find(b=>b.id==='cm-p-metalmar');assert.ok(metalmar.local.crossFacade);assert.equal(metalmar.x,MENDONCA_WEST_END.x+MENDONCA_ROAD.outerHalfWidth);
});
