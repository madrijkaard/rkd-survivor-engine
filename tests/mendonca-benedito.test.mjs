import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { crossPoints, buildings, findPath, clearLine, moveActor, locationAt, walkable, imagePath, WORLD_BOUNDS } from '../src/world.js';
import { mendoncaPoints, CROSS_Y } from '../src/mendonca-data.js';
import { BENEDITO_X, BENEDITO_CROSS, MENDONCA_BENEDITO_WALK, mendoncaBeneditoBuildings } from '../src/mendonca-benedito.js';
import { MENDONCA_ROAD as R, BENEDITO_PROFILE as A } from '../src/road-profiles.js';
import { footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';

test('Cônego/São Benedito: preserva os 31 pontos e acrescenta seis panoramas com 48 fotos',async()=>{
  assert.deepEqual(mendoncaPoints.filter(p=>p.id<=31).map(p=>p.x),[0,141,287,429,569,713,852,990,1127,1272,1424,1571,1721,1863,2015,-162,-315,-489,-652,-813,-971,-1132,-1202,-1361,-1498,-1637,-1687,-1792,-1933,-2080,-2223]);
  const m=JSON.parse(await readFile(new URL('../maps/conego-mendonca/manifest.json',import.meta.url),'utf8'));
  const extension=m.extensions.find(e=>e.fromPoint===32);
  assert.deepEqual(extension.routePointOrder,[31,32,33,34,35,36,37]);
  assert.equal(extension.toStreet,'Avenida São Benedito');assert.equal(extension.endPoint,37);
  const hashes=new Set();
  for(const p of mendoncaPoints.filter(p=>p.id>=32)){
    const source=m.points[p.id-1];assert.equal(p.pano,source.pano);assert.equal(p.latitude,source.latitude);assert.equal(p.longitude,source.longitude);
    assert.equal(p.y,CROSS_Y);assert.equal(source.capturedAt,'2026-10-12');assert.equal(source.imageryDate,'2025-06');assert.ok(source.sourceUrl.includes(p.pano));
    const gap=mendoncaPoints[p.id-2].x-p.x;assert.ok(gap>100&&gap<170);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL('../'+imagePath(p.id,d,'conego-mendonca'),import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(hashes.size,48);assert.equal(A.width,160);assert.equal(A.sidewalkWidth,80);
  assert.equal(m.intersections.find(p=>p.id==='sao-benedito').coverage,'intersection-only');
});

test('Cônego/São Benedito: cliques e caminhada chegam à esquina e retornam nas quatro câmeras',()=>{
  const route=[31,32,33,34,35,36,37].map(id=>crossPoints.find(p=>p.id===id));
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const actor={...route[0]};
    for(const target of [...route,...route.slice().reverse()]){
      const p=project(target.x,target.y),destination=unproject(p.x,p.y),path=findPath(actor,destination);assert.ok(path?.length);
      for(const step of path){assert.ok(clearLine(actor,step));let guard=0;
        while(Math.hypot(step.x-actor.x,step.y-actor.y)>.001){assert.ok(++guard<1000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),stride=Math.min(5,d);assert.ok(moveActor(actor,dx/d*stride,dy/d*stride));}
      }
      const loc=locationAt(actor.x,actor.y);assert.equal(loc.route.id,'conego-mendonca');assert.equal(loc.point.id,target.id);
    }
  });
  for(const y of [CROSS_Y-245,CROSS_Y+245])assert.ok(findPath(route.at(-1),{x:BENEDITO_X,y}),'Braços curtos da avenida acessíveis');
  assert.equal(walkable(BENEDITO_X,CROSS_Y+320),false,'Não mapeia o quarteirão seguinte da avenida');
  assert.equal(walkable(MENDONCA_BENEDITO_WALK.x-15,CROSS_Y),false,'Limite oeste da captura');
});

test('Cônego/São Benedito: pista e passeios livres, interseção compartilhada e fachadas sólidas',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let x=MENDONCA_BENEDITO_WALK.x+5;x<-2230;x+=11)for(const dy of [-R.outerHalfWidth+7,-63,0,63,R.outerHalfWidth-7])
    assert.equal(lots.find(b=>hitsFootprint(x,CROSS_Y+dy,b,2)),undefined,`${x}/${dy}`);
  for(let y=BENEDITO_CROSS.y+8;y<BENEDITO_CROSS.y+BENEDITO_CROSS.h-8;y+=13)for(const dx of [-A.outerHalfWidth+7,-79,0,79,A.outerHalfWidth-7])
    assert.equal(lots.find(b=>hitsFootprint(BENEDITO_X+dx,y,b,2)),undefined,`${dx}/${y}`);
  assert.equal(new Set(buildings.map(b=>b.id)).size,buildings.length);
  for(const id of ['cm-p-girassol-center','as-pavilhao-claro','cm-p-metalmar','cm-b-impacto'])assert.equal(buildings.filter(b=>b.id===id).length,1);
  for(const b of mendoncaBeneditoBuildings){assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);assert.equal(b.residential,false);}
  assert.ok(WORLD_BOUNDS.x<BENEDITO_X-445);
});
