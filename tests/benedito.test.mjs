import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {routes,buildings,findPath,clearLine,moveActor,locationAt,walkable,imagePath,crossPoints} from '../src/world.js';
import {beneditoPoints,beneditoBuildings,BENEDITO_END,beneditoShelter} from '../src/benedito-data.js';
import {BENEDITO_X as X} from '../src/mendonca-benedito.js';
import {CAMERA_VIEWS,withCameraView,project,unproject} from '../src/projection.js';
import {hasHomeWindows} from '../src/home-lighting.js';

test('São Benedito: 14 panoramas, 104 fotos novas e esquina inicial reutilizada',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/sao-benedito/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.points.length,14);assert.equal(m.extensions[0].toStreet,'Rua Vinte e Oito de Julho');
  const hashes=new Set();
  for(const p of beneditoPoints){
    const source=m.points[p.id-1];for(const key of ['pano','latitude','longitude'])assert.equal(p[key],source[key]);
    assert.equal(source.imageryDate,'2025-06');assert.equal(source.capturedAt,'2026-10-12');
    if(p.id>1)assert.ok(p.y<beneditoPoints[p.id-2].y);
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL('../'+imagePath(p.id,d,'sao-benedito'),import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      if(p.id===1)assert.deepEqual(bytes,await readFile(new URL(`../maps/conego-mendonca/ponto-37/${d}.jpg`,import.meta.url)));
      else hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(hashes.size,104);
  assert.deepEqual(crossPoints.filter(p=>p.id>=32).sort((a,b)=>a.id-b.id).map(p=>[p.id,p.x,p.y]),[[32,-2361,2345],[33,-2516,2345],[34,-2655,2345],[35,-2800,2345],[36,-2944,2345],[37,-3102,2345]]);
  assert.equal(BENEDITO_END.y,-95);assert.equal(routes.find(r=>r.id==='sao-benedito').width,160);
});

test('São Benedito: caminhada, cliques e retorno trocam fotos nas quatro câmeras',()=>{
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const actor={...beneditoPoints[0]};
    for(const target of [...beneditoPoints,...beneditoPoints.slice().reverse()]){
      const screen=project(target.x,target.y),destination=unproject(screen.x,screen.y),path=findPath(actor,destination);assert.ok(path?.length);
      for(const step of path){assert.ok(clearLine(actor,step));let guard=0;
        while(Math.hypot(step.x-actor.x,step.y-actor.y)>.001){assert.ok(++guard<1200);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),stride=Math.min(d,5);assert.ok(moveActor(actor,dx/d*stride,dy/d*stride));}
      }
      const loc=locationAt(actor.x,actor.y);assert.equal(loc.route.id,target.id===1?'conego-mendonca':'sao-benedito');assert.equal(loc.point.id,target.id===1?37:target.id);
    }
  });
  assert.ok(findPath(BENEDITO_END,{x:-2223,y:-95}),'Retorno pelo piso da ponta da praça');
  assert.equal(walkable(X,-230),false,'Não continua além da interseção final');
  assert.equal(walkable(X,2670),false,'Não expande para norte');
  assert.equal(walkable(X-240,865),false,'Acesso ao terreno não vira rua');
});

test('São Benedito: esquinas únicas, paredes sólidas, cobertura aberta e usos corretos',()=>{
  assert.equal(new Set(buildings.map(b=>b.id)).size,buildings.length);
  for(const id of ['cm-b-sobrado-arcos','cm-b-impacto','as-pavilhao-claro','as-biblioteca'])assert.equal(buildings.filter(b=>b.id===id).length,1);
  for(const b of beneditoBuildings)assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);
  for(const id of ['sb-colares-moreira','sb-banco-brasil','sb-instituto-iesi','sb-sobrado-agrogeo','sb-hotel-contexto'])assert.equal(hasHomeWindows(buildings.find(b=>b.id===id)),false,id);
  const a=beneditoShelter;assert.ok(walkable(a.x+a.w/2,a.y+a.h/2));assert.equal(walkable(a.x,a.y),false);
  const old=buildings.find(b=>b.id==='as-pavilhao-claro');assert.equal(old.backFacade.street,'sao-benedito');assert.equal(old.crossFacade.street,'conego-mendonca');
});
