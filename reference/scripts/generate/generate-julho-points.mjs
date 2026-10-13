import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';
const manifest=validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/vinte-e-oito-de-julho/manifest.json',import.meta.url),'utf8')));
// Quarteirão quase retilíneo: distâncias reais, alinhamento artístico da ligação
// existente. A mudança de rumo do carro no último panorama não curva a rua.
let distance=0;
const points=manifest.points.slice(0,9).map((p,i)=>{
  if(i){const prev=manifest.points[i-1],rad=Math.PI/180,lat=(p.latitude-prev.latitude)*rad,lon=(p.longitude-prev.longitude)*rad;
    const a=Math.sin(lat/2)**2+Math.cos(prev.latitude*rad)*Math.cos(p.latitude*rad)*Math.sin(lon/2)**2;
    distance+=6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  return {id:p.id,pano:p.pano,latitude:p.latitude,longitude:p.longitude,x:-Math.round(distance*14),y:-95,street:'vinte-e-oito-de-julho'};
});
// O retorno foi capturado de oeste para leste. As âncoras históricas das
// esquinas e os IDs 1–9 permanecem fixos; não acumular o salto 9→10.
const start=manifest.points.find(p=>p.id===10),end=manifest.points.find(p=>p.id===9);
if(start)for(const p of manifest.points.slice(9,18)){
  const t=(p.longitude-start.longitude)/(end.longitude-start.longitude);
  points.push({...p,x:Math.round((-2223+t*(2223-1202))*10)/10,y:-95,street:'vinte-e-oito-de-julho'});
}
// Continuação leste: longitudes observadas, 14 unidades/m; manter o eixo
// artístico da Vinte e Oito e a abscissa da esquina Antônio/20 (x=836).
const eastStart=manifest.points.find(p=>p.id===19);
if(eastStart)for(const p of manifest.points.filter(p=>p.id>=19)){
  const meters=(p.longitude-eastStart.longitude)*Math.PI/180*6371000*Math.cos(eastStart.latitude*Math.PI/180);
  points.push({...p,x:Math.round((836+meters*14)*10)/10,y:-95,street:'vinte-e-oito-de-julho'});
}
const output=points.map(({id,pano,latitude,longitude,x,y,street})=>({id,pano,latitude,longitude,x,y,street}));
await fs.writeFile(new URL('../../../src/julho-points.js',import.meta.url),'// Gerado do manifesto; pontos 1–18 preservados; extensão leste ancorada na Antônio Alexandre.\nexport const julhoPoints = '+JSON.stringify(output,null,2)+';\n');
console.log(`${points.length} pontos; eixo y=-95; âncoras x=-2223/-1202/0`);
