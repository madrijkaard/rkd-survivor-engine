import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { alcebiadesPoints, ALCEBIADES_END, ALCEBIADES_X, ALCEBIADES_CARDOSO, ALCEBIADES_CARDOSO_POINT, alcebiadesBuildings } from '../src/alcebiades-data.js';
import { mendoncaPoints } from '../src/mendonca-points.js';
import { MENDONCA_WEST_END } from '../src/mendonca-praca.js';
import { START, routes, buildings, findPath, clearLine, moveActor, locationAt, walkable, WORLD_BOUNDS, imagePath } from '../src/world.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { hasHomeWindows } from '../src/home-lighting.js';
import { ALCEBIADES_COURT, ALCEBIADES_JULHO, alcebiadesSports } from '../src/alcebiades-julho.js';

test('Alcebíades: quinze panoramas, 112 fotos novas, esquina reutilizada e Cônego preservada',async()=>{
  const m=JSON.parse(await readFile(new URL('../maps/praca-alcebiades-silva/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.points.length,15);assert.equal(m.street,'Praça Alcebíades Silva');
  assert.equal(m.extensions[0].toStreet,'Travessa Z. Cardoso');assert.equal(m.extensions[0].endPoint,10);
  assert.deepEqual(m.extensions[0].routePointOrder,[1,2,3,4,5,6,7,8,9,10]);
  assert.deepEqual(mendoncaPoints.filter(p=>p.id<=31).map(p=>p.x),[0,141,287,429,569,713,852,990,1127,1272,1424,1571,1721,1863,2015,-162,-315,-489,-652,-813,-971,-1132,-1202,-1361,-1498,-1637,-1687,-1792,-1933,-2080,-2223]);
  assert.ok(mendoncaPoints.every(p=>p.y===2345));
  assert.deepEqual(alcebiadesPoints.slice(0,10).map(p=>[p.x,p.y]),[2345,2181.3,2033.7,1885.5,1737.6,1594.2,1447.4,1296,1151.3,1002.5].map(y=>[-2223,y]));
  assert.equal(m.extensions[1].toStreet,'Rua Vinte e Oito de Julho');assert.equal(m.extensions[1].endPoint,15);
  assert.equal(alcebiadesPoints[0].pano,MENDONCA_WEST_END.pano);
  assert.equal(alcebiadesPoints[0].x,MENDONCA_WEST_END.x);assert.equal(alcebiadesPoints[0].y,MENDONCA_WEST_END.y);
  const hashes=new Set();
  for(const p of m.points){
    const q=alcebiadesPoints[p.id-1];assert.equal(q.pano,p.pano);assert.equal(q.latitude,p.latitude);assert.equal(q.longitude,p.longitude);
    assert.equal(p.imageryDate,'2025-06');assert.ok(p.sourceUrl.includes(p.pano));
    if(p.id>1){assert.ok(p.latitude<m.points[p.id-2].latitude);assert.ok(q.y<alcebiadesPoints[p.id-2].y);}
    for(let d=1;d<=8;d++){
      const bytes=await readFile(new URL('../'+imagePath(p.id,d,'praca-alcebiades-silva'),import.meta.url));
      assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
      if(p.id===1)assert.deepEqual(bytes,await readFile(new URL('../'+imagePath(31,d,'conego-mendonca'),import.meta.url)));
      else hashes.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(hashes.size,112);assert.ok(routes.some(r=>r.id==='praca-alcebiades-silva'));
});

test('Alcebíades: caminhada e clique chegam à Vinte e Oito e retornam nas quatro câmeras',()=>{
  assert.ok(findPath(START,ALCEBIADES_END)?.length);
  for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const actor={...MENDONCA_WEST_END};
    for(const dest of [...alcebiadesPoints,...alcebiadesPoints.slice().reverse()]){
      const p=project(dest.x,dest.y),target=unproject(p.x,p.y),path=findPath(actor,target);assert.ok(path?.length);
      for(const step of path){assert.ok(clearLine(actor,step));let guard=0;
        while(Math.hypot(actor.x-step.x,actor.y-step.y)>.001){
          assert.ok(++guard<2000);const dx=step.x-actor.x,dy=step.y-actor.y,d=Math.hypot(dx,dy),stride=Math.min(5,d);
          assert.ok(moveActor(actor,dx/d*stride,dy/d*stride));
        }
      }
      const loc=locationAt(actor.x,actor.y);
      assert.equal(loc.route.id,dest.id===1?'conego-mendonca':dest.id===15?'vinte-e-oito-de-julho':'praca-alcebiades-silva');
      assert.equal(loc.point.id,dest.id===1?31:dest.id===15?10:dest.id);
    }
  });
  assert.ok(clearLine(ALCEBIADES_CARDOSO_POINT,{x:ALCEBIADES_CARDOSO.x+ALCEBIADES_CARDOSO.w-12,y:ALCEBIADES_CARDOSO_POINT.y}));
  assert.equal(walkable(ALCEBIADES_X,ALCEBIADES_END.y-185),false,'Não avança pelo próximo quarteirão');
  assert.equal(walkable(-1670,ALCEBIADES_CARDOSO_POINT.y),false,'Não inventa a ligação completa pela travessa');
});

test('Alcebíades: Metalmar única, biblioteca e lotes sólidos, praça acessível e uso residencial correto',()=>{
  const metalmar=buildings.filter(b=>b.id==='cm-p-metalmar');assert.equal(metalmar.length,1);
  assert.equal(metalmar[0].x,-2119);assert.equal(metalmar[0].y,2061);assert.equal(metalmar[0].length,180);
  assert.equal(metalmar[0].local.crossFacade.street,'praca-alcebiades-silva');
  for(const b of alcebiadesBuildings){
    assert.ok(b.length>45&&b.depth>40,b.id);
    assert.equal(walkable(b.x+b.depth/2,b.y+b.length/2),false,b.id);
    assert.equal(hasHomeWindows(b),b.id==='as-casa-creme');
    for(const [p,d] of b.refs){assert.ok(p>=1&&p<=15);assert.ok(d>=1&&d<=8);}
  }
  assert.ok(findPath(ALCEBIADES_END,{x:ALCEBIADES_X-280,y:1500})?.length,'Caminha no passeio e no jardim');
  assert.ok(WORLD_BOUNDS.x<ALCEBIADES_X-760,'Praça inteira visível dentro dos limites');
});

test('Alcebíades: cruza a Cardoso, alcança a Crefisa e mantém grades, rampas e limites coerentes',()=>{
  assert.ok(findPath(ALCEBIADES_CARDOSO_POINT,ALCEBIADES_END)?.length);
  assert.equal(ALCEBIADES_END.id,15);assert.equal(ALCEBIADES_END.y,-95);
  const bank=buildings.filter(b=>b.id==='as-sicoob-esquina');assert.equal(bank.length,1);
  assert.equal(bank[0].y+bank[0].length,898.5,'Esquina norte do Sicoob preservada');
  assert.equal(buildings.filter(b=>b.id==='as-sobrado-crefisa').length,1);
  assert.equal(buildings.find(b=>b.id==='as-sobrado-crefisa').y,ALCEBIADES_END.y+104);
  assert.equal(locationAt(-2223,580.1).point.id,12);
  assert.equal(locationAt(ALCEBIADES_END.x,ALCEBIADES_END.y).point.id,10);
  assert.ok(clearLine(ALCEBIADES_END,{x:ALCEBIADES_JULHO.x+ALCEBIADES_JULHO.w-10,y:-95}));
  assert.ok(walkable(-1670,-95),'Retorno pela Vinte e Oito agora capturado');
  assert.equal(walkable(-2223,-290),false,'Não prossegue pela Sete de Setembro');
  const c=ALCEBIADES_COURT;
  assert.equal(walkable(c.x+c.w,c.y+c.h*.2),false,'Alambrado sólido');
  assert.ok(findPath({x:-2223,y:580.1},{x:c.x+c.w/2,y:c.y+c.h/2})?.length,'Entrada central da quadra livre');
  for(const p of alcebiadesSports.filter(p=>['ramp','table','billboard'].includes(p.kind)))assert.equal(walkable(p.x+p.w/2,p.y+p.h/2),false,p.id);
});
