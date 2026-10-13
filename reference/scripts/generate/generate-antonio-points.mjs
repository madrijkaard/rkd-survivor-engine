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
// Anchor the original southern junction, regardless of appended captures.
const yScale=2425/-raw.find(p=>p.id===20).dy;
const points=raw.map(({dx,dy,...p})=>{
  const y=Math.round(2345+dy*yScale);
  // Keep the established church square and its western street in place.
  // Blend back into the measured bend only beyond the church's rear wall.
  const blend=p.id<=20?1:Math.max(0,Math.min(1,(y-3120)/600));
  return {...p,x:Math.round(1257+dx*blend),y,street:'antonio-alexandre'};
});
await fs.writeFile(new URL('../../../src/antonio-points.js',import.meta.url),'// Generated from maps/antonio-alexandre/manifest.json. Stable capture IDs.\nexport const antonioPoints = '+JSON.stringify(points,null,2)+';\n');
console.table(points.map(({id,x,y})=>({id,x,y})));
