import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { crossPoints, START, CROSS_Y, MENDONCA_END, buildings, imagePath, locationAt, findPath, clearLine, moveActor, walkable } from '../src/world.js';
import { CAMERA_VIEWS, project, unproject, withCameraView, withCrossStreetFrame, PROJECTION } from '../src/projection.js';
import { CHURCH_PLAZA, PLAZA_CHURCH, CHURCH_TOWER, plazaSeats } from '../src/mendonca-data.js';

test('os quinze panoramas consecutivos têm oito JPEGs distintos e coordenadas de origem',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../maps/conego-mendonca/manifest.json',import.meta.url)));
  assert.equal(manifest.points.length,15);assert.equal(crossPoints.length,15);
  assert.equal(new Set(manifest.points.map(p=>p.pano)).size,15);
  assert.equal(manifest.points[8].pano,'HH_IwB3kuGNEdCLXhTzkhQ','O ponto indicado pelo usuário permanece na sequência');
  assert.equal(manifest.points.at(-1).pano,'m50EKQjLKjyArRBYMtRRww','Esquina diante da academia');
  const hashes=new Set();
  for(const p of crossPoints){
    const folder=new URL(`../maps/conego-mendonca/ponto-${String(p.id).padStart(2,'0')}/`,import.meta.url);
    assert.equal((await readdir(folder)).filter(f=>f.endsWith('.jpg')).length,8);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL(`../${imagePath(p.id,d,p.street)}`,import.meta.url));
      assert.ok(bytes.length>5000);assert.equal(bytes.readUInt16BE(0),0xffd8);
      hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
    assert.equal(p.pano,manifest.points[p.id-1].pano);
    if(p.id>1){const previous=crossPoints[p.id-2];assert.ok(p.x-previous.x>110&&p.x-previous.x<165,'Avanços próximos de dez metros');}
  }
  assert.equal(hashes.size,120);
});

test('a igreja está inteira dentro da praça e suas quatro ruas formam uma volta livre',()=>{
  for(const b of [PLAZA_CHURCH,CHURCH_TOWER]){
    assert.ok(b.x>CHURCH_PLAZA.x&&b.y>CHURCH_PLAZA.y);
    assert.ok(b.x+b.w<CHURCH_PLAZA.x+CHURCH_PLAZA.w);
    assert.ok(b.y+b.h<CHURCH_PLAZA.y+CHURCH_PLAZA.h);
    assert.equal(walkable(b.x+b.w/2,b.y+b.h/2),false,'Não é possível atravessar a igreja');
  }
  const ring=[{x:1257,y:CROSS_Y},{x:1257,y:3300},{x:MENDONCA_END,y:3300},{x:MENDONCA_END,y:CROSS_Y}];
  for(let i=0;i<ring.length;i++){
    assert.ok(clearLine(ring[i],ring[(i+1)%ring.length]),`Rua ${i+1} livre`);
    assert.ok(findPath(START,ring[i]),'Todas as ruas acessíveis desde a Simeão');
  }
  for(const destination of [{x:1340,y:2820},{x:1915,y:2820},{x:1915,y:3130},{x:1340,y:3130}])assert.ok(findPath(ring[3],destination),'Circulação pelo piso da praça em volta da igreja');
  for(const s of plazaSeats)assert.equal(walkable(s.x+s.w/2,s.y+s.h/2),false,'Bancos rosados têm colisão');
  assert.equal(buildings.filter(b=>b.detail==='plaza-church').length,1);
});

test('o percurso vira a esquina, percorre a Cônego Mendonça e pode voltar ao início',()=>{
  const finish={x:MENDONCA_END,y:CROSS_Y},route=findPath(START,finish);
  assert.ok(route?.length>1,'A conexão entre ruas exige virar a esquina');
  const actor={...START};
  for(const destination of route){
    assert.ok(clearLine(actor,destination));
    let iterations=0;
    while(Math.hypot(actor.x-destination.x,actor.y-destination.y)>1e-6){
      assert.ok(++iterations<1500);
      const dx=destination.x-actor.x,dy=destination.y-actor.y,d=Math.hypot(dx,dy),step=Math.min(d,5);
      assert.ok(moveActor(actor,dx/d*step,dy/d*step));
    }
  }
  assert.ok(findPath(actor,START)?.length>1);
  for(let x=0;x<=MENDONCA_END;x+=5)assert.ok(walkable(x,CROSS_Y));
  assert.ok(findPath(finish,{x:1500,y:2640}),'Praça acessível pela esquina');
  assert.equal(findPath(finish,{x:900,y:2450}),null,'O muro do jardim não é atravessável');
});

test('fotos e numeração mudam de rua na esquina, mantendo os 17 pontos originais',()=>{
  assert.equal(locationAt(0,2240).route.id,'simeao');
  assert.equal(locationAt(0,2240).point.id,17);
  for(const p of crossPoints){const current=locationAt(p.x,p.y);assert.equal(current.route.id,p.street);assert.equal(current.point.id,p.id);}
  assert.equal(new Set(buildings.map(b=>b.id)).size,buildings.length);
  assert.equal(buildings.filter(b=>b.id==='e15-autoescola-bom-pastor').length,1);
  assert.ok(buildings.find(b=>b.id==='e15-autoescola-bom-pastor').crossFacade);
});

test('quatro câmeras projetam a rua transversal e restauram a projeção após pré-renderizar',()=>{
  for(let i=0;i<CAMERA_VIEWS.length;i++)withCameraView(i,()=>{
    for(const p of crossPoints){const screen=project(p.x,p.y),ground=unproject(screen.x,screen.y);assert.ok(Math.hypot(ground.x-p.x,ground.y-p.y)<1e-8);}
    const before=PROJECTION,world=project(800,CROSS_Y+65,70);
    withCrossStreetFrame(CROSS_Y,()=>{
      const projected=project(-65,800,70);assert.ok(Math.hypot(projected.x-world.x,projected.y-world.y)<1e-8);
      const local=unproject(world.x,world.y+70);assert.ok(Math.hypot(local.x+65,local.y-800)<1e-8);
    });
    assert.equal(PROJECTION,before);
    assert.throws(()=>withCrossStreetFrame(CROSS_Y,()=>{throw new Error('Falha simulada');}));
    assert.equal(PROJECTION,before);
  });
});
