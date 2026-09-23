import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
const manifest=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/antonio-alexandre/manifest.json',import.meta.url),'utf8')));
const start=manifest.points[0], rad=Math.PI/180;
// Rotate the recorded coordinates into the existing Simeão street frame.
// Match the two existing junctions; this is an illustrated map, not a survey.
const raw=manifest.points.map(p=>{
  const north=(p.latitude-start.latitude)*111195;
  const east=(p.longitude-start.longitude)*111195*Math.cos(start.latitude*rad);
  return {...p,dx:(east*.942+north*.337)*14,dy:(north*.942-east*.337)*14};
});
const yScale=2425/-raw.at(-1).dy;
const points=raw.map(({dx,dy,...p})=>({...p,x:Math.round(1257+dx),y:Math.round(2345+dy*yScale),street:'antonio-alexandre'}));
await fs.writeFile(new URL('../../../src/antonio-points.js',import.meta.url),'// Generated from maps/antonio-alexandre/manifest.json. North to south.\nexport const antonioPoints = '+JSON.stringify(points,null,2)+';\n');
console.table(points.map(({id,x,y})=>({id,x,y})));
