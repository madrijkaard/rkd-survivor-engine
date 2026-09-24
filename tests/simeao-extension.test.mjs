import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { points, buildings, locationAt, walkable, findPath, clearLine, moveActor, CROSS_Y, WORLD_BOUNDS } from '../src/world.js';
import { SIMEAO_END, simeaoExtensionBuildings } from '../src/simeao-extension.js';
import { buildingFootprint } from '../src/building-geometry.js';

test('extensão preserva os 17 pontos e acrescenta 112 JPEGs distintos com coordenadas reais', async () => {
  const manifest=JSON.parse(await readFile(new URL('../maps/simeao-de-macedo/manifest.json',import.meta.url),'utf8'));
  assert.equal(points.length,31);
  for(let i=0;i<17;i++)assert.deepEqual([points[i].id,points[i].x,points[i].y],[i+1,0,i*140]);
  const hashes=new Set();
  for(const p of manifest.points.slice(17)) {
    assert.ok(p.latitude>manifest.points[p.id-2].latitude);
    assert.ok(p.longitude<manifest.points[p.id-2].longitude);
    assert.equal(points[p.id-1].pano,p.pano);
    for(let d=1;d<=8;d++) {
      const data=await readFile(new URL(`../maps/simeao-de-macedo/ponto-${p.id}/${d}.jpg`,import.meta.url));
      assert.equal(data.readUInt16BE(0),0xffd8);assert.ok(data.length>5000);
      hashes.add(createHash('sha256').update(data).digest('hex'));
    }
  }
  assert.equal(hashes.size,112);
  assert.ok(points.at(-1).y<WORLD_BOUNDS.y+WORLD_BOUNDS.h);
});

test('personagem cruza a Cônego, alcança Henrique Figueiredo e retorna com fotos corretas',()=>{
  const start={x:0,y:2240},end={x:0,y:SIMEAO_END};
  assert.deepEqual(findPath(start,end),[end]);
  const actor={...start};
  while(actor.y<end.y)assert.ok(moveActor(actor,0,Math.min(5,end.y-actor.y)));
  assert.deepEqual(actor,end);assert.deepEqual(findPath(actor,start),[start]);
  for(const p of points.slice(17)) {
    assert.equal(locationAt(p.x,p.y).route.id,'simeao');assert.equal(locationAt(p.x,p.y).point.id,p.id);
  }
  assert.equal(locationAt(300,CROSS_Y).route.id,'conego-mendonca');
  assert.ok(clearLine({x:-290,y:SIMEAO_END},{x:390,y:SIMEAO_END}));
  assert.equal(walkable(0,SIMEAO_END+100),false);
});

test('novas fachadas não invadem a rua e esquinas compartilhadas permanecem únicas',()=>{
  for(const id of ['corner-wall','corner-shop'])assert.equal(buildings.filter(b=>b.id===id).length,1);
  for(const b of simeaoExtensionBuildings) {
    for(const [x] of buildingFootprint(b))assert.ok(b.side==='west'?x<=-80:x>=80,b.id);
    assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);
  }
  for(let y=CROSS_Y-80;y<=CROSS_Y+220;y+=5)assert.ok(walkable(0,y));
});
