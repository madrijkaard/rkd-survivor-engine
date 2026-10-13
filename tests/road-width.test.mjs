import { onCoelhoRoad } from '../src/coelho-geometry.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PERSON_WIDTH,CAR_WIDTH,CAR_LENGTH,roadProfile,carFootprint,offsetRoadPath} from '../src/road-dimensions.js';
import {routes,buildings,walkAreas} from '../src/world.js';
import {onAntonioRoad,antonioPath,antonioCars} from '../src/antonio-data.js';
import {footprintObstacle,hitsFootprint} from '../src/building-geometry.js';
import {loadMapManifests} from '../src/map-manifests.js';
import {withCarFrame,withCameraView,project,CAMERA_VIEWS} from '../src/projection.js';

test('tipo explícito no JSON controla quatro carros na rua e cinco na avenida',async()=>{
  for(const route of routes){
    const manifest=JSON.parse(await readFile(new URL(`../maps/${route.folder}/manifest.json`,import.meta.url),'utf8'));
    assert.equal(route.width,roadProfile(manifest.roadType).width);
  }
  for(const [roadType,count] of [['rua',4],['avenida',5]]){
    const manifest=JSON.parse(await readFile(new URL('../maps/simeao-de-macedo/manifest.json',import.meta.url),'utf8'));
    manifest.roadType=roadType;manifest.sidewalkType=`calcada-de-${roadType}`;
    const copy=structuredClone(routes[0]),before=structuredClone(copy.points);
    await loadMapManifests([copy],async()=>({ok:true,json:async()=>manifest}));
    assert.equal(copy.width,count*CAR_WIDTH);assert.equal(copy.carsAcross,count);
    assert.equal(copy.sidewalkType,manifest.sidewalkType);
    assert.equal(copy.sidewalkWidth,(roadType==='rua'?2:4)*PERSON_WIDTH);
    assert.deepEqual(copy.points.map(p=>[p.id,p.x,p.y]),before.map(p=>[p.id,p.x,p.y]));
    const cars=Array.from({length:count},(_,i)=>carFootprint({x:-copy.halfWidth+CAR_WIDTH*(i+.5),y:0}));
    assert.equal(cars[0].x,-copy.halfWidth);assert.equal(cars.at(-1).x+cars.at(-1).w,copy.halfWidth);
    for(let i=1;i<cars.length;i++)assert.equal(cars[i-1].x+cars[i-1].w,cars[i].x);
  }
});

test('curvas mantêm a largura perpendicular e bordas contínuas nas junções',()=>{
  for(const type of ['rua','avenida']){
    const {halfWidth,width}=roadProfile(type),left=offsetRoadPath(antonioPath,-halfWidth),right=offsetRoadPath(antonioPath,halfWidth);
    for(let i=1;i<antonioPath.length;i++){
      const a=antonioPath[i-1],b=antonioPath[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
      for(const j of [i-1,i]){
        const nx=-dy/len,ny=dx/len;
        assert.ok(Math.abs((right[j].x-left[j].x)*nx+(right[j].y-left[j].y)*ny-width)<1e-7);
      }
    }
  }
});

test('as pistas ficam fora dos lotes e dentro da área navegável nas oito rotas',()=>{
  const lots=buildings.map(footprintObstacle).map(o=>({...o,polygon:o.polygon??[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]]}));
  for(const route of routes)for(let i=1;i<route.points.length;i++){
    const a=(route.id==='antonio-alexandre'?antonioPath:route.points)[i-1],b=(route.id==='antonio-alexandre'?antonioPath:route.points)[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
    for(let t=.1;t<1;t+=.2)for(let d=-route.halfWidth;d<=route.halfWidth;d+=CAR_WIDTH/2){
      const x=a.x+t*dx-d*dy/len,y=a.y+t*dy+d*dx/len;
      assert.ok(walkAreas.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||onAntonioRoad(x,y)||onCoelhoRoad(x,y),`${route.id}: pista fora da área ${x}/${y}`);
      assert.equal(lots.find(o=>hitsFootprint(x,y,o)),undefined,`${route.id}: lote sobre a pista ${x}/${y}`);
    }
  }
});

test('carro na curva compartilha largura, orientação e planta entre desenho e colisão',()=>{
  for(const car of antonioCars)for(const view of CAMERA_VIEWS.keys())withCameraView(view,()=>{
    const footprint=carFootprint(car);
    const rendered=withCarFrame(car,()=>[[-CAR_WIDTH/2,-CAR_LENGTH/2],[CAR_WIDTH/2,-CAR_LENGTH/2],[CAR_WIDTH/2,CAR_LENGTH/2],[-CAR_WIDTH/2,CAR_LENGTH/2]].map(([x,y])=>project(x,y)));
    footprint.polygon.forEach(([x,y],i)=>{const p=project(x,y);assert.ok(Math.hypot(p.x-rendered[i].x,p.y-rendered[i].y)<1e-8);});
    assert.ok(Math.abs(Math.hypot(footprint.polygon[1][0]-footprint.polygon[0][0],footprint.polygon[1][1]-footprint.polygon[0][1])-CAR_WIDTH)<1e-8);
  });
});


test('calçadas dos dois lados acomodam o número de pessoas definido no JSON',()=>{
  for(const type of ['rua','avenida']){
    const p=roadProfile(type),count=type==='rua'?2:4;
    assert.equal(p.peopleAcross,count);assert.equal(p.sidewalkWidth,count*PERSON_WIDTH);
    const inner=offsetRoadPath(antonioPath,p.halfWidth),outer=offsetRoadPath(antonioPath,p.outerHalfWidth);
    for(let i=1;i<antonioPath.length;i++){
      const a=antonioPath[i-1],b=antonioPath[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
      assert.ok(Math.abs((outer[i].x-inner[i].x)*(-dy/len)+(outer[i].y-inner[i].y)*(dx/len)-p.sidewalkWidth)<1e-7);
    }
  }
  const lots=buildings.map(footprintObstacle).map(o=>({...o,polygon:o.polygon??[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]]}));
  for(const route of routes){
    const path=route.id==='antonio-alexandre'?antonioPath:route.points;
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
      for(let t=.15;t<1;t+=.2)for(const side of [-1,1])for(let person=0;person<route.peopleAcross;person++){
        const d=side*(route.halfWidth+PERSON_WIDTH*(person+.5));
        const x=a.x+t*dx-d*dy/len,y=a.y+t*dy+d*dx/len;
        assert.ok(walkAreas.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||onAntonioRoad(x,y)||onCoelhoRoad(x,y),route.id+': passeio fora do piso '+x+'/'+y);
        const lot=lots.find(o=>[-PERSON_WIDTH/2+.1,0,PERSON_WIDTH/2-.1].some(w=>hitsFootprint(x-w*dy/len,y+w*dx/len,o)));
        assert.equal(lot,undefined,route.id+': calçada ocupada por '+lot?.id+' em '+x+'/'+y);
      }
    }
  }
});
