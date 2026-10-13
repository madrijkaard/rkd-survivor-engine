import { SIMEAO_ROAD } from '../src/road-profiles.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { julhoPoints, julhoPath, JULHO_END, JULHO_WEST, JULHO_WALK, julhoBuildings } from '../src/julho-data.js';
import { julhoWestBuildings } from '../src/julho-west.js';
import { routes, buildings, START, walkable, findPath, clearLine, moveActor, locationAt, imagePath } from '../src/world.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { hasHomeWindows } from '../src/home-lighting.js';

test('Vinte e Oito: 29 panoramas, 232 JPEGs distintos e referências vinculadas à rua',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/vinte-e-oito-de-julho/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.points.length,29);assert.equal(routes.find(r=>r.id==='vinte-e-oito-de-julho').points.length,29);
  const hashes=new Set();
  for(const p of julhoPoints){
    assert.equal(p.pano,m.points[p.id-1].pano);assert.equal(p.latitude,m.points[p.id-1].latitude);assert.equal(p.longitude,m.points[p.id-1].longitude);
    for(let direction=1;direction<=8;direction++){
      const bytes=await readFile(new URL(`../${imagePath(p.id,direction,p.street)}`,import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(hashes.size,232);
  for(const b of [...julhoBuildings,...julhoWestBuildings])for(const [p,d] of b.refs){assert.ok(m.points.some(r=>r.id===p));assert.ok(d>=1&&d<=8);}
});

test('da Praça do Cinema à Alcebíades pela Fernando e retorno nas quatro vistas',()=>{
  for(const index of CAMERA_VIEWS.keys())withCameraView(index,()=>{
    for(const route of [[START,...julhoPath],[...julhoPath].reverse().concat(START)]){
      const actor={...route[0]};
      for(const dest of route.slice(1)){
        const screen=project(dest.x,dest.y),world=unproject(screen.x,screen.y);
        assert.ok(Math.hypot(world.x-dest.x,world.y-dest.y)<1e-6);
        const path=findPath(actor,dest);assert.ok(path?.length,`Caminho até ${dest.id}`);
        for(const step of path){assert.ok(clearLine(actor,step));let n=0;while(Math.hypot(step.x-actor.x,step.y-actor.y)>.01){
          assert.ok(++n<1000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),s=Math.min(5,d);assert.ok(moveActor(actor,dx/d*s,dy/d*s));
        }}
        if(dest.street){const here=locationAt(actor.x,actor.y);assert.equal(here.route.id,dest.street);assert.equal(here.point.id,dest.id);}
      }
    }
  });
  assert.equal(locationAt(START.x,START.y).route.id,'simeao');
  assert.ok(walkable(JULHO_END.x,-280));assert.ok(walkable(JULHO_END.x,100));
  assert.ok(walkable(JULHO_END.x-235,JULHO_END.y),'Retorno agora mapeado até a praça');
});

test('lotes deixam a faixa livre, esquina da Simeão é única e comércio não recebe luz residencial',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let x=JULHO_WEST.x;x<0;x+=8)for(const y of [-132,-96,-72])assert.equal(lots.find(o=>hitsFootprint(x,y,o,2)),undefined,`${x},${y}`);
  const corner=buildings.filter(b=>b.id==='w01-casa-porta-verde');assert.equal(corner.length,1);
  assert.deepEqual([corner[0].x,corner[0].y,corner[0].depth,corner[0].length],[-158-SIMEAO_ROAD.outerHalfWidth,JULHO_WALK.y+JULHO_WALK.h,158,90-(JULHO_WALK.y+JULHO_WALK.h)]);
  assert.equal(corner[0].crossFacade.street,'vinte-e-oito-de-julho');
  for(const b of [...julhoBuildings,...julhoWestBuildings]){assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);if(b.residential===false)assert.equal(hasHomeWindows(b),false,b.id);}
});

test('retorno preserva IDs, GPS, esquinas antigas e reutiliza somente as fotos documentadas',async()=>{
  assert.deepEqual(julhoPoints.slice(0,9).map(p=>p.x),[0,-191,-319,-462,-604,-746,-890,-1047,-1202]);
  assert.equal(JULHO_END.id,9);assert.equal(JULHO_WEST.x,-2223);
  assert.deepEqual(julhoPath.filter(p=>p.id<=18).map(p=>p.id),[1,2,3,4,5,6,7,8,9,18,17,16,15,14,13,12,11,10]);
  for(let i=1;i<julhoPath.length;i++)assert.ok(julhoPath[i].x<julhoPath[i-1].x);
  const m=JSON.parse(await readFile(new URL('../maps/vinte-e-oito-de-julho/manifest.json',import.meta.url),'utf8'));
  assert.deepEqual(m.extensions.find(e=>e.fromPoint===10).routePointOrder,[10,11,12,13,14,15,16,17,18,9]);
  assert.equal(m.extensions.find(e=>e.fromPoint===10).endPoint,18);
  for(const p of m.points.slice(9)){assert.equal(p.imageryDate,'2025-06');assert.ok(p.sourceUrl.includes(p.pano));}
  for(let d=1;d<=8;d++)assert.deepEqual(await readFile(new URL(`../maps/vinte-e-oito-de-julho/ponto-10/${d}.jpg`,import.meta.url)),await readFile(new URL(`../maps/praca-alcebiades-silva/ponto-15/${d}.jpg`,import.meta.url)));
});

test('retorno completa quatro volumes compartilhados e mantém fotos e iluminação coerentes',()=>{
  for(const id of ['as-sobrado-crefisa','as-centro-odontologico','jl-uniodonto','jl-segundo-oficio'])assert.equal(buildings.filter(b=>b.id===id).length,1,id);
  const ceo=buildings.find(b=>b.id==='as-centro-odontologico');assert.equal(ceo.local.street,'vinte-e-oito-de-julho');assert.equal(ceo.local.crossFacade.street,'praca-alcebiades-silva');
  const clinic=buildings.find(b=>b.id==='jl-uniodonto');assert.equal(clinic.local.crossFacade.street,'fernando-carvalho');assert.deepEqual([clinic.x,clinic.y,clinic.depth,clinic.length],[-1422,9,116,241]);
  assert.equal(hasHomeWindows(buildings.find(b=>b.id==='jl-w-casa-jardim')),true);
  assert.ok(clearLine(JULHO_WEST,JULHO_END));
  assert.equal(locationAt(-2223,-95).route.id,'vinte-e-oito-de-julho');assert.equal(locationAt(-2223,-95).point.id,10);
  assert.equal(locationAt(-2223,149.1).route.id,'praca-alcebiades-silva');
  assert.equal(walkable(-1670,1002.5),false,'A travessa intermediária continua sem levantamento');
});
