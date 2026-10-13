import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
import { JULHO_END } from '../../../src/julho-data.js';
import { CROSS_Y } from '../../../src/mendonca-data.js';
const m=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/fernando-carvalho/manifest.json',import.meta.url),'utf8')));
let distance=0;
const measured=m.points.map((p,i)=>{
  if(i){const q=m.points[i-1],r=Math.PI/180,a=Math.sin((p.latitude-q.latitude)*r/2)**2+Math.cos(p.latitude*r)*Math.cos(q.latitude*r)*Math.sin((p.longitude-q.longitude)*r/2)**2;distance+=6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  return {...p,distance};
});
// Alinha a via quase paralela à Simeão ao referencial artístico existente.
// O último panorama vê a esquina pelo lado norte, 90 unidades após a transversal.
const scale=(CROSS_Y+90-JULHO_END.y)/distance;
const points=measured.map(({id,pano,latitude,longitude,distance})=>({id,pano,latitude,longitude,x:JULHO_END.x,y:Math.round(JULHO_END.y+distance*scale),street:'fernando-carvalho'}));
await fs.writeFile(new URL('../../../src/fernando-points.js',import.meta.url),'// Gerado por generate-fernando-points.mjs; alinhamento artístico, GPS preservado.\nexport const fernandoPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(`${points.length} pontos; ${distance.toFixed(1)} m; escala artística ${scale.toFixed(2)}.`,points.map(p=>[p.id,p.y]));
