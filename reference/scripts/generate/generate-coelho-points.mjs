import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
import { julhoPoints } from '../../../src/julho-points.js';
import { mendoncaPoints } from '../../../src/mendonca-points.js';

const m=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/coelho-neto/manifest.json',import.meta.url),'utf8')));
const start=julhoPoints.find(p=>p.id===29),end=mendoncaPoints.find(p=>p.id===15);
// A rua quase reta é alinhada às duas junções artísticas já existentes.
// A latitude distribui os panoramas; não alteramos GPS nem posições antigas.
const points=m.points.map(({id,pano,latitude,longitude})=>{
  const t=(latitude-start.latitude)/(end.latitude-start.latitude);
  return {id,pano,latitude,longitude,x:+(start.x+(end.x-start.x)*t).toFixed(2),y:+(start.y+(end.y-start.y)*t).toFixed(2),street:'coelho-neto'};
});
await fs.writeFile(new URL('../../../src/coelho-points.js',import.meta.url),'// Gerado por generate-coelho-points.mjs; GPS preservado, alinhamento artístico.\nexport const coelhoPoints = '+JSON.stringify(points,null,2)+';\n');
console.log(points.map(p=>[p.id,p.x,p.y]));
