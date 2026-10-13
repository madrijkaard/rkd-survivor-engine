import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
import { mendoncaPoints } from '../../../src/mendonca-points.js';
import { alcebiadesPoints } from '../../../src/alcebiades-points.js';
import { manifestRoadProfile } from '../../../src/road-dimensions.js';

const m=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/sao-benedito/manifest.json',import.meta.url),'utf8')));
const start=mendoncaPoints.find(p=>p.id===37),south=alcebiadesPoints.find(p=>p.id===15);
const x=alcebiadesPoints[0].x-760-manifestRoadProfile(m).outerHalfWidth;
// Preserva as duas bordas da praça existente. A escala longitudinal artística
// ajusta a latitude entre as esquinas; GPS e pontos das outras vias não mudam.
const points=m.points.map(({id,pano,latitude,longitude})=>({id,pano,latitude,longitude,
  x:id===1?start.x:x,y:+(start.y+(south.y-start.y)*(latitude-m.points[0].latitude)/(m.points.at(-1).latitude-m.points[0].latitude)).toFixed(2),street:'sao-benedito'}));
await fs.writeFile(new URL('../../../src/benedito-points.js',import.meta.url),'// Gerado por generate-benedito-points.mjs; GPS preservado, alinhamento artístico.\nexport const beneditoPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(points.map(p=>[p.id,p.x,p.y]));
