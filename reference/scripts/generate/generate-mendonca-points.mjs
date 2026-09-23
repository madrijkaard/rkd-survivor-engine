import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
const manifest=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/conego-mendonca/manifest.json',import.meta.url),'utf8')));
let distance=0;
const points=manifest.points.map((p,i)=>{
  if(i){const prev=manifest.points[i-1],rad=Math.PI/180,lat=(p.latitude-prev.latitude)*rad,lon=(p.longitude-prev.longitude)*rad;
    const a=Math.sin(lat/2)**2+Math.cos(prev.latitude*rad)*Math.cos(p.latitude*rad)*Math.sin(lon/2)**2;
    distance+=6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  return {...p,x:Math.round(distance*14),y:2345};
});
await fs.writeFile(new URL('../../../src/mendonca-points.js',import.meta.url),'// Posições de maps/conego-mendonca/manifest.json; escala aproximada de 14 unidades/m.\nexport const mendoncaPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(`${points.length} posições; ${distance.toFixed(1)} m até a esquina final.`);
