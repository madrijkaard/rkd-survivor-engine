import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
import { mendoncaPoints } from '../../../src/mendonca-points.js';
const m=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/praca-alcebiades-silva/manifest.json',import.meta.url),'utf8')));
const start=mendoncaPoints.find(p=>p.id===31);
let distance=0;
const measured=m.points.map((p,i)=>{
  if(i){const q=m.points[i-1],r=Math.PI/180,a=Math.sin((p.latitude-q.latitude)*r/2)**2+Math.cos(p.latitude*r)*Math.cos(q.latitude*r)*Math.sin((p.longitude-q.longitude)*r/2)**2;distance+=6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  return {...p,distance};
});
// Same artistic crossing level as the existing mouth of Travessa Z. Cardoso
// on Fernando. Only this mouth is drawn; the intervening travessa is not surveyed.
const cardoso=measured.find(p=>p.id===10),endY=1002.5,scale=(start.y-endY)/cardoso.distance;
// Preserve points 1–10 exactly. The newly surveyed block ends at the same
// artistic level as Vinte e Oito, without opening its unsurveyed lateral gap.
const extensionScale=(endY-(-95))/(distance-cardoso.distance);
const points=measured.map(({id,pano,latitude,longitude,distance})=>({id,pano,latitude,longitude,x:start.x,y:Math.round((id<=10?start.y-distance*scale:endY-(distance-cardoso.distance)*extensionScale)*10)/10,street:'praca-alcebiades-silva'}));
await fs.writeFile(new URL('../../../src/alcebiades-points.js',import.meta.url),'// Gerado por generate-alcebiades-points.mjs; alinhamento artístico, GPS preservado.\nexport const alcebiadesPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(`${points.length} pontos, ${distance.toFixed(1)} m, escala artística ${scale.toFixed(2)}.`,points.map(p=>[p.id,p.y]));
