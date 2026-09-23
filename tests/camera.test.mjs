import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMERA_VIEWS, PROJECTION, project, unproject, getCameraView, setCameraView, withCameraView } from '../src/projection.js';
import { BAR } from '../src/bar-layout.js';
import { START, buildings, obstacles, findPath, walkable } from '../src/world.js';

test('cliques nas duas perspectivas recuperam os mesmos destinos da rua e do bar',()=>{
  const places=[START,{x:180,y:210},{x:0,y:1120},{x:0,y:2240},BAR.entry,BAR.talkSpot,BAR.exit];
  for(let view=0;view<CAMERA_VIEWS.length;view++)withCameraView(view,()=>{
    for(const original of places){
      const screen=project(original.x,original.y),ground=unproject(screen.x,screen.y);
      assert.ok(Math.hypot(original.x-ground.x,original.y-ground.y)<1e-9);
      assert.equal(walkable(ground.x,ground.y),walkable(original.x,original.y));
    }
  });
});

test('a nova câmera troca a profundidade dos lados sem espelhar o mundo',()=>{
  const depths=[],handedness=[];
  for(let view=0;view<2;view++)withCameraView(view,()=>{
    depths.push(project(80,1120).y-project(-80,1120).y);
    handedness.push(Math.sign(PROJECTION.a*PROJECTION.d-PROJECTION.b*PROJECTION.c));
    assert.equal(project(0,100,40).y,project(0,100).y-40,'A altura continua vertical');
    for(const [x,y] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const direction=unproject(x,y),screen=project(direction.x,direction.y);
      assert.ok(Math.hypot(screen.x-x,screen.y-y)<1e-9,'Controles seguem a direção da tela');
    }
  });
  assert.ok(depths[0]>0 && depths[1]<0);
  assert.equal(handedness[0],handedness[1],'Uma reflexão inverteria o determinante');
});

test('girar preserva personagem, construções, colisões e o caminho em andamento',()=>{
  const actor={...BAR.entry},destination={...BAR.talkSpot};
  const initialWorld=JSON.stringify({actor,buildings,obstacles}),route=findPath(actor,destination);
  assert.ok(route?.length);
  for(const view of [1,0,1,0])withCameraView(view,()=>{
    assert.equal(JSON.stringify({actor,buildings,obstacles}),initialWorld);
    assert.deepEqual(findPath(actor,destination),route);
  });
});

test('pré-renderização de outra vista sempre restaura a câmera ativa',()=>{
  setCameraView(1);
  try{
    withCameraView(0,()=>assert.equal(getCameraView(),0));
    assert.equal(getCameraView(),1);
    assert.throws(()=>withCameraView(0,()=>{throw new Error('Falha simulada no desenho');}));
    assert.equal(getCameraView(),1);
    assert.throws(()=>setCameraView(7),RangeError);
    assert.equal(getCameraView(),1);
  }finally{setCameraView(0);}
});
