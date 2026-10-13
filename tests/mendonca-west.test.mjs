import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { crossPoints, buildings, findPath, clearLine, moveActor, walkable, locationAt, CROSS_Y } from '../src/world.js';
import { mendoncaPoints } from '../src/mendonca-data.js';
import { fernandoPoints, FERNANDO_X } from '../src/fernando-data.js';
import { MENDONCA_ROAD } from '../src/road-profiles.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { footprintObstacle, hitsFootprint } from '../src/building-geometry.js';

test('Cônego oeste: preserva posições antigas, separa IDs da ordem espacial e registra o limite capturado',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/conego-mendonca/manifest.json',import.meta.url),'utf8'));
  assert.deepEqual(mendoncaPoints.filter(p=>p.id<=15).map(p=>p.x),[0,141,287,429,569,713,852,990,1127,1272,1424,1571,1721,1863,2015]);
  const extension=m.extensions.find(e=>e.fromPoint===16);
  assert.deepEqual(extension.routePointOrder,[1,16,17,18,19,20,21,22]);
  assert.equal(extension.toStreet,'Rua Fernando Carvalho');
  assert.deepEqual(crossPoints.filter(p=>p.id<=22).map(p=>p.id),[22,21,20,19,18,17,16,...Array.from({length:15},(_,i)=>i+1)]);
  const route=extension.routePointOrder.map(id=>mendoncaPoints.find(p=>p.id===id));
  for(const [i,p] of route.entries()){
    assert.equal(p.y,CROSS_Y);
    if(!i)continue;
    assert.ok(p.longitude<route[i-1].longitude,'Panorama seguinte segue para oeste');
    assert.ok(route[i-1].x-p.x>140&&route[i-1].x-p.x<180,'Não há salto artístico entre pontos');
    assert.equal(p.capturedAt,'2026-10-11');assert.equal(p.imageryDate,'2025-06');
    assert.ok(p.sourceUrl.includes(p.pano));
  }
  assert.equal(route.at(-1).x,FERNANDO_X+70);
});

test('Cônego oeste: ida e volta até a Fernando, por clique e caminhada nas quatro câmeras',()=>{
  const west=[1,16,17,18,19,20,21,22].map(id=>crossPoints.find(p=>p.id===id));
  const destinations=[...west,...fernandoPoints.slice(-2).reverse(),...fernandoPoints.slice(-2),...west.slice().reverse()];
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const actor={...west[0]};
    for(const destination of destinations){
      const screen=project(destination.x,destination.y),ground=unproject(screen.x,screen.y);
      const path=findPath(actor,ground);assert.ok(path?.length,`Câmera ${view}: destino ${destination.street}/${destination.id}`);
      for(const step of path){
        assert.ok(clearLine(actor,step));let guard=0;
        while(Math.hypot(actor.x-step.x,actor.y-step.y)>.001){
          assert.ok(++guard<2000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),stride=Math.min(5,d);
          assert.ok(moveActor(actor,dx/d*stride,dy/d*stride));
        }
      }
      const current=locationAt(actor.x,actor.y);assert.equal(current.route.id,destination.street);assert.equal(current.point.id,destination.id);
    }
  });
});

test('Cônego oeste: pista e passeios livres de lotes; quatro volumes compartilhados únicos',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let x=FERNANDO_X+110;x<-110;x+=9)for(const offset of [-97,-63,0,63,97]){
    assert.equal(lots.find(o=>hitsFootprint(x,CROSS_Y+offset,o,2)),undefined,`Lote sobre a faixa ${x}/${offset}`);
  }
  for(let x=FERNANDO_X;x<=0;x+=5)assert.ok(walkable(x,CROSS_Y));
  for(const id of ['corner-wall','w15-fc-motos-yamaha','fc-centro-operario','fc-agencia-trabalho']){
    const found=buildings.filter(b=>b.id===id);assert.equal(found.length,1);assert.equal(found[0].crossFacade.street,'conego-mendonca');
  }
  const south=buildings.filter(b=>b.id.startsWith('cm-o-')&&b.y<CROSS_Y);
  for(const b of south)assert.equal(b.y+b.length,CROSS_Y-MENDONCA_ROAD.outerHalfWidth);
  for(const b of buildings.filter(b=>b.id.startsWith('cm-o-'))){
    assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);
    assert.equal(b.local.length,b.depth);assert.equal(b.local.depth,b.length);
    for(const [p,d] of b.refs){assert.ok(p>=16&&p<=22);assert.ok(d>=1&&d<=8);}
  }
});
