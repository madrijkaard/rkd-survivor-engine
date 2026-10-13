import { JULHO_WALK } from '../src/julho-data.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fernandoPoints, fernandoBuildings, FERNANDO_X, FERNANDO_CROSS, FERNANDO_TRAVESSA } from '../src/fernando-data.js';
import { julhoPoints } from '../src/julho-data.js';
import { routes, buildings, findPath, clearLine, moveActor, walkable, locationAt, imagePath } from '../src/world.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { hasHomeWindows } from '../src/home-lighting.js';

test('Fernando: 17 panoramas, 136 fotos distintas e início reutilizado sem recaptura',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/fernando-carvalho/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.points.length,17);assert.equal(routes.find(r=>r.id==='fernando-carvalho').points.length,17);
  const hashes=new Set();
  for(const p of fernandoPoints){
    assert.deepEqual([p.pano,p.latitude,p.longitude],[m.points[p.id-1].pano,m.points[p.id-1].latitude,m.points[p.id-1].longitude]);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL(`../${imagePath(p.id,d,p.street)}`,import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
      if(p.id===1)assert.deepEqual(bytes,await readFile(new URL(`../maps/vinte-e-oito-de-julho/ponto-09/${d}.jpg`,import.meta.url)));
    }
  }
  assert.equal(hashes.size,136);
  for(const b of fernandoBuildings)for(const [p,d] of b.refs){assert.ok(m.points.some(q=>q.id===p));assert.ok(d>=1&&d<=8);}
  assert.equal(m.extensions[0].toStreet,'Rua Cônego Mendonça');
});

test('virar à direita, caminhar até a Cônego e retornar funciona nas quatro câmeras',()=>{
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const route=[julhoPoints[6],...fernandoPoints,...fernandoPoints.slice(0,-1).reverse(),julhoPoints[6]];
    const actor={...route[0]};
    for(const dest of route.slice(1)){
      const screen=project(dest.x,dest.y),world=unproject(screen.x,screen.y);
      assert.ok(Math.hypot(dest.x-world.x,dest.y-world.y)<1e-6);
      const path=findPath(actor,world);assert.ok(path?.length,`Trajeto ${dest.street}/${dest.id}`);
      for(const step of path){assert.ok(clearLine(actor,step));let n=0;
        while(Math.hypot(step.x-actor.x,step.y-actor.y)>.01){const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),s=Math.min(5,d);assert.ok(++n<1000);assert.ok(moveActor(actor,dx/d*s,dy/d*s));}
      }
      const loc=locationAt(actor.x,actor.y);
      if(dest.street==='fernando-carvalho'&&dest.id>1){assert.equal(loc.route.id,dest.street);assert.equal(loc.point.id,dest.id);}
      else assert.equal(loc.route.id,'vinte-e-oito-de-julho');
    }
  });
});

test('rua e braços das esquinas livres; muros bloqueiam e os volumes compartilhados são únicos',()=>{
  const lots=buildings.map(footprintObstacle);
  for(let y=-30;y<2590;y+=11)for(const x of [FERNANDO_X-37,FERNANDO_X,FERNANDO_X+37])assert.equal(lots.find(o=>hitsFootprint(x,y,o,2)),undefined,`${x}/${y}`);
  for(const r of [FERNANDO_CROSS,FERNANDO_TRAVESSA]){
    const a={x:FERNANDO_X,y:r.y+r.h/2},b={x:r.x+15,y:a.y};assert.ok(clearLine(a,b));
  }
  assert.equal(walkable(FERNANDO_X,2675),false,'Não mapear outro quarteirão ao norte');
  assert.equal(walkable(-600,2345),true,'Os pontos 16–22 da Cônego agora documentam a ligação até a Simeão');
  for(const id of ['jl-esquina-verde','jl-uniodonto']){
    const found=buildings.filter(b=>b.id===id);assert.equal(found.length,1);assert.equal(found[0].y,JULHO_WALK.y+JULHO_WALK.h);assert.equal(found[0].crossFacade.street,'fernando-carvalho');
    assert.equal(found[0].local.depth,found[0].length);
  }
  for(const b of fernandoBuildings){assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);if(b.residential===false)assert.equal(hasHomeWindows(b),false,b.id);}
});
