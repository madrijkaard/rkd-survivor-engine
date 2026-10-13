import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { coelhoPoints, coelhoBuildings, coelhoTruck } from '../src/coelho-data.js';
import { coelhoCenter, coelhoEdge } from '../src/coelho-geometry.js';
import { julhoPoints } from '../src/julho-points.js';
import { mendoncaPoints } from '../src/mendonca-points.js';
import { buildings, routes, findPath, clearLine, moveActor, walkable, locationAt, imagePath } from '../src/world.js';
import { withCameraView, project, unproject } from '../src/projection.js';
import { buildingFootprint, footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { hasHomeWindows } from '../src/home-lighting.js';

test('Coelho Neto: 22 panoramas, 176 fotos e oito imagens reutilizadas da Vinte e Oito',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/coelho-neto/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.points.length,22);assert.equal(routes.find(r=>r.id==='coelho-neto').points.length,22);
  assert.equal(m.extensions[0].toStreet,'Rua Cônego Mendonça');
  assert.deepEqual(m.extensions[0].routePointOrder,coelhoPoints.map(p=>p.id));
  const hashes=new Set();
  for(const p of coelhoPoints){
    assert.deepEqual([p.pano,p.latitude,p.longitude],[m.points[p.id-1].pano,m.points[p.id-1].latitude,m.points[p.id-1].longitude]);
    if(p.id>1){const q=coelhoPoints[p.id-2];assert.ok(p.y>q.y&&Math.hypot(p.x-q.x,p.y-q.y)<150);}
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL('../'+imagePath(p.id,d,p.street),import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
      if(p.id===1)assert.deepEqual(bytes,await readFile(new URL('../'+imagePath(29,d,'vinte-e-oito-de-julho'),import.meta.url)));
    }
  }
  assert.equal(hashes.size,176);
  for(const b of buildings.filter(b=>b.street==='coelho-neto'))for(const [p,d] of b.refs){assert.ok(m.points[p-1]);assert.ok(d>=1&&d<=8);}
  assert.deepEqual(julhoPoints.find(p=>p.id===29),{...coelhoPoints[0],id:29,street:'vinte-e-oito-de-julho'});
  const end=mendoncaPoints.find(p=>p.id===15);assert.deepEqual([end.x,end.y],[2015,2345]);
});

test('Coelho Neto: cliques percorrem a rua, entram na Cônego e retornam nas quatro vistas',()=>{
  const july=julhoPoints.find(p=>p.id===27),mendonca={...mendoncaPoints.find(p=>p.id===13),street:'conego-mendonca'};
  for(let view=0;view<4;view++)withCameraView(view,()=>{
    const actor={...july};
    for(const dest of [...coelhoPoints,mendonca,...coelhoPoints.toReversed(),july]){
      const screen=project(dest.x,dest.y),click=unproject(screen.x,screen.y),path=findPath(actor,click);
      assert.ok(path?.length,'Sem caminho para '+dest.street+'/'+dest.id);
      for(const waypoint of path){assert.ok(clearLine(actor,waypoint));let n=0;while(Math.hypot(actor.x-waypoint.x,actor.y-waypoint.y)>.01){
        assert.ok(++n<1600);const dx=waypoint.x-actor.x,dy=waypoint.y-actor.y,len=Math.hypot(dx,dy),step=Math.min(4,len);assert.ok(moveActor(actor,dx/len*step,dy/len*step));
      }}
      const here=locationAt(actor.x,actor.y);
      assert.equal(here.route.id,dest.street==='coelho-neto'&&dest.id===1?'vinte-e-oito-de-julho':dest.street);
      assert.equal(here.point.id,dest.street==='coelho-neto'&&dest.id===1?29:dest.id);
    }
  });
});

test('Coelho Neto: passeios livres, volumes de esquina únicos e obstáculos reais',()=>{
  for(const id of ['jl-e-ginasio-contexto','jl-e-facebar','jl-e-casa-tijolo-contexto','cm-s11-muro-diagonal','cm-final-casa-rosa','cm-final-casa-creme','cm-academia-figueiredo'])assert.equal(buildings.filter(b=>b.id===id).length,1,id);
  const lots=buildings.map(b=>({...footprintObstacle(b),polygon:buildingFootprint(b)}));
  for(let y=10;y<2240;y+=11)for(const d of [-103,-80,-64,0,64,80,103])assert.equal(lots.find(b=>hitsFootprint(coelhoEdge(y,d),y,b)),undefined,`${y}/${d}`);
  for(const b of coelhoBuildings){const p=buildingFootprint(b),x=p.reduce((s,v)=>s+v[0],0)/4,y=p.reduce((s,v)=>s+v[1],0)/4;assert.equal(walkable(x,y),false,b.id);}
  const gym=buildings.find(b=>b.id==='jl-e-ginasio-contexto');assert.equal(hasHomeWindows(gym),false);
  assert.equal(hasHomeWindows(buildings.find(b=>b.id==='cn-ruina-vedada')),false);
  assert.equal(walkable(coelhoTruck.x+18,coelhoTruck.y+60),false);
  assert.ok(clearLine(coelhoPoints[0],coelhoPoints.at(-1)));
  assert.equal(walkable(coelhoCenter(1400)+200,1400),false,'Terreno não é outra passagem');
  assert.equal(walkable(2292.6,-440),false,'Sem expansão para o sul');
});
