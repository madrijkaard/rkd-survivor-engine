import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parallelPoints, crossPoints, START, CROSS_Y, imagePath, locationAt, findPath, clearLine, moveActor, walkable, buildings } from '../src/world.js';
import { antonioCenter } from '../src/antonio-data.js';
import { buildingPlanPoint, buildingFootprint, footprintObstacle, hitsFootprint } from '../src/building-geometry.js';
import { withCameraView, project, unproject } from '../src/projection.js';

test('Antônio Alexandre: vinte posições, 160 fotos distintas e coordenadas preservadas',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../maps/antonio-alexandre/manifest.json',import.meta.url)));
  assert.equal(manifest.points.length,20);assert.equal(parallelPoints.length,20);
  assert.equal(new Set(manifest.points.map(p=>p.pano)).size,20);
  assert.equal(manifest.points[0].pano,'k6BHFWpglP1DnMesHhpImQ');
  assert.equal(manifest.points.at(-1).pano,'WJLDwWseqC6nt98aIPhy2A');
  assert.deepEqual(manifest.directions,['N','NE','L','SE','S','SO','O','NO']);
  const hashes=new Set();
  for(const p of parallelPoints){
    assert.equal(p.pano,manifest.points[p.id-1].pano);
    assert.equal(p.latitude,manifest.points[p.id-1].latitude);
    const folder=new URL(`../maps/antonio-alexandre/ponto-${String(p.id).padStart(2,'0')}/`,import.meta.url);
    assert.equal((await readdir(folder)).filter(f=>f.endsWith('.jpg')).length,8);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL(`../${imagePath(p.id,d,p.street)}`,import.meta.url));
      assert.ok(bytes.length>5000);assert.equal(bytes.readUInt16BE(0),0xffd8);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
    if(p.id>1){const a=parallelPoints[p.id-2];assert.ok(p.latitude<a.latitude);assert.ok(Math.hypot(p.x-a.x,p.y-a.y)<165);}
  }
  assert.equal(hashes.size,160);
});

function walkPath(start,finish){
  const path=findPath(start,finish);assert.ok(path?.length,'Existe um caminho');const actor={...start};
  for(const dest of path){
    assert.ok(clearLine(actor,dest));let iterations=0;
    while(Math.hypot(actor.x-dest.x,actor.y-dest.y)>1e-5){
      assert.ok(++iterations<1500);const dx=dest.x-actor.x,dy=dest.y-actor.y,l=Math.hypot(dx,dy),s=Math.min(5,l);
      assert.ok(moveActor(actor,dx/l*s,dy/l*s));
    }
  }
  assert.ok(Math.hypot(actor.x-finish.x,actor.y-finish.y)<1e-5);
}
test('as três ruas formam um percurso contínuo com retorno pela Vinte e Oito de Julho',()=>{
  const north=parallelPoints[0],south=parallelPoints.at(-1);
  walkPath(START,crossPoints[0]);walkPath(crossPoints[0],north);walkPath(north,south);walkPath(south,START);
  for(let i=1;i<parallelPoints.length;i++)assert.ok(clearLine(parallelPoints[i-1],parallelPoints[i]),`Centro do trecho ${i+1} livre`);
  for(let y=-20;y<2230;y+=20)assert.ok(walkable(antonioCenter(y),y));
});
test('as fotos acompanham a rua paralela nas quatro câmeras e preservam a Cônego',()=>{
  for(const p of parallelPoints.slice(1)){
    const here=locationAt(p.x,p.y);assert.equal(here.route.id,'antonio-alexandre');assert.equal(here.point.id,p.id);
    for(let camera=0;camera<4;camera++)withCameraView(camera,()=>{const screen=project(p.x,p.y),ground=unproject(screen.x,screen.y);assert.ok(Math.hypot(ground.x-p.x,ground.y-p.y)<1e-8);});
  }
  for(const p of crossPoints)assert.equal(locationAt(p.x,p.y).route.id,'conego-mendonca');
});
test('cinema e construções de esquina são compartilhados; escola e muros bloqueiam passagem',()=>{
  for(const id of ['cinema','cm-final-clinica','cm-s05-igreja-familia'])assert.equal(buildings.filter(b=>b.id===id).length,1);
  assert.ok(buildings.find(b=>b.id==='cinema').backFacade);
  assert.ok(buildings.find(b=>b.id==='cm-final-clinica').local.crossFacade);
  for(const id of ['aa-school-classrooms','aa-school-blue-wall','aa-w08-historica','aa-e02-muro-tijolos']){
    const b=buildings.find(b=>b.id===id),center=buildingPlanPoint(b,b.x+b.depth/2,b.y+b.length/2);
    assert.equal(walkable(center.x,center.y),false,id);
  }
  assert.equal(new Set(buildings.map(b=>b.id)).size,buildings.length);
});

test('fachadas vizinhas acompanham a curva e se encontram na divisa dos lotes',()=>{
  const row=buildings.filter(b=>b.street==='antonio-alexandre'&&!b.axis);
  const front=b=>{const p=buildingFootprint(b);return b.side==='east'?[p[0],p[3]]:[p[1],p[2]];};
  for(const b of row){
    const [a,z]=front(b),roadShift=antonioCenter(z[1])-antonioCenter(a[1]);
    assert.ok(Math.abs((z[0]-a[0])-roadShift)<1e-8,`${b.id}: fachada acompanha a orientação da rua`);
    const neighbour=row.find(n=>n.side===b.side&&n.y===b.y+b.length&&(n.setback??0)===(b.setback??0));
    if(neighbour)assert.ok(Math.hypot(z[0]-front(neighbour)[0][0],z[1]-front(neighbour)[0][1])<1e-8,`${b.id}: sem degrau ou vão artificial na divisa`);
  }
});

test('nenhum lote avança sobre o asfalto ou a faixa junto ao meio-fio da Antônio Alexandre',()=>{
  const lots=buildings.map(footprintObstacle).map(o=>({...o,polygon:o.polygon||[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]]}));
  for(let y=-25;y<2280;y+=5)for(let dx=-72;dx<=72;dx+=12){
    const x=antonioCenter(y)+dx;
    assert.equal(lots.find(o=>hitsFootprint(x,y,o,3)),undefined,`Passagem invadida em ${x}, ${y}`);
  }
  assert.equal(walkable(1180,2150),true,'A região antes ocupada pelo prédio cinza agora é rua livre');
});

test('a colisão acompanha paredes inclinadas e as esquinas têm a mesma planta nos dois eixos',()=>{
  for(const b of buildings.filter(b=>b.footprint)){
    const o=footprintObstacle(b),center=buildingPlanPoint(b,b.x+b.depth/2,b.y+b.length/2);
    assert.ok(hitsFootprint(center.x,center.y,o),b.id);
    const polygon=buildingFootprint(b);
    for(let i=0;i<4;i++){
      const a=polygon[i],z=polygon[(i+1)%4],dx=z[0]-a[0],dy=z[1]-a[1],len=Math.hypot(dx,dy);
      const middle={x:(a[0]+z[0])/2,y:(a[1]+z[1])/2},outside={x:middle.x+dy/len*4,y:middle.y-dx/len*4};
      assert.equal(hitsFootprint(outside.x,outside.y,o),false,`${b.id}: exterior livre`);
      assert.equal(hitsFootprint(outside.x,outside.y,o,5),true,`${b.id}: raio do personagem respeita a parede`);
    }
    if(b.axis==='x')for(const [u,v] of [[0,0],[1,0],[1,1],[0,1],[.4,.7]]){
      const local=b.local,p=buildingPlanPoint(local,local.x+u*local.depth,local.y+v*local.length);
      const world=buildingPlanPoint(b,b.x+v*b.depth,b.y+(1-u)*b.length);
      assert.ok(Math.hypot(p.y-world.x,CROSS_Y-p.x-world.y)<1e-8,b.id);
    }
  }
});

test('a casa rosa encontra o sobrado na mesma linha de fachada junto à praça',()=>{
  const pink=buildings.find(b=>b.id==='aa-w11-rosa'),next=buildings.find(b=>b.id==='aa-w12-sobrado');
  const a=buildingFootprint(pink)[1],b=buildingFootprint(next)[2];
  assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8,'Não há ressalto entre a casa rosa e o sobrado');
});

test('o muro azul termina nos pilares da entrada coberta da escola',()=>{
  const entrance=buildings.find(b=>b.id==='aa-school-entrance');
  const walls=buildings.filter(b=>b.detail==='aa-school-wall');
  for(const wall of walls)assert.ok(wall.y+wall.length<=entrance.y||wall.y>=entrance.y+entrance.length,'Muro não atravessa o portão');
  const north=walls.find(b=>b.y>=entrance.y+entrance.length),south=walls.find(b=>b.y+ b.length<=entrance.y);
  assert.deepEqual(buildingFootprint(north)[0],buildingFootprint(entrance)[3]);
  assert.deepEqual(buildingFootprint(south)[3],buildingFootprint(entrance)[0]);
  const y=entrance.y+entrance.length/2,front=buildingPlanPoint(entrance,entrance.x,y);
  assert.ok(findPath({x:antonioCenter(y),y},{x:front.x-12,y}),'É possível se aproximar do portão pela calçada');
  assert.equal(walkable(front.x+8,y),false,'O portão continua fechado');
});
