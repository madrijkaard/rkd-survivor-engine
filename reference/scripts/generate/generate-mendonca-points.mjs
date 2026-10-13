import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
import { julhoPoints } from '../../../src/julho-points.js';
const manifest=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/conego-mendonca/manifest.json',import.meta.url),'utf8')));
function meters(prev,p){const rad=Math.PI/180,lat=(p.latitude-prev.latitude)*rad,lon=(p.longitude-prev.longitude)*rad;
    const a=Math.sin(lat/2)**2+Math.cos(prev.latitude*rad)*Math.cos(p.latitude*rad)*Math.sin(lon/2)**2;
    return 6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
let distance=0;
// IDs 1–15 and their artistic positions remain unchanged.
const points=manifest.points.filter(p=>p.id<=15).map((p,i)=>{
  if(i)distance+=meters(manifest.points[i-1],p);
  return {...p,x:Math.round(distance*14),y:2345};
});
const extension=manifest.extensions?.find(e=>e.fromPoint===16);
if(extension){
  const route=extension.routePointOrder.map(id=>manifest.points.find(p=>p.id===id));
  let cumulative=0;
  const distances=route.map((p,i)=>{if(i)cumulative+=meters(route[i-1],p);return cumulative;});
  // The terminal panorama is on the eastern mouth of the existing intersection.
  const endX=julhoPoints.find(p=>p.id===9).x+70;
  points.push(...route.slice(1).map((p,i)=>({...p,x:Math.round(endX*distances[i+1]/cumulative),y:2345})));
}
const nextExtension=manifest.extensions?.find(e=>e.fromPoint===23);
if(nextExtension){
  const route=nextExtension.routePointOrder.filter(id=>id>=23).map(id=>manifest.points.find(p=>p.id===id));
  let westDistance=0;
  points.push(...route.map((p,i)=>{
    if(i)westDistance+=meters(route[i-1],p);
    return {...p,x:Math.round(julhoPoints.find(p=>p.id===9).x-westDistance*14),y:2345};
  }));
}
const beneditoExtension=manifest.extensions?.find(e=>e.fromPoint===32);
if(beneditoExtension){
  const route=beneditoExtension.routePointOrder.map(id=>manifest.points.find(p=>p.id===id));
  const anchor=points.find(p=>p.id===31);
  let westDistance=0;
  for(let i=1;i<route.length;i++){
    westDistance+=meters(route[i-1],route[i]);
    points.push({...route[i],x:Math.round(anchor.x-westDistance*14),y:anchor.y});
  }
}
await fs.writeFile(new URL('../../../src/mendonca-points.js',import.meta.url),'// Manifesto Cônego: IDs e posições anteriores preservados; continuação oeste até São Benedito.\nexport const mendoncaPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(`${points.length} posições; trecho original ${distance.toFixed(1)} m.`);
