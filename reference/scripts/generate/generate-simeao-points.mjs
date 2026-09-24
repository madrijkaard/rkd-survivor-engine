import fs from 'node:fs/promises';
import { validateMapManifest } from '../../../src/map-manifests.js';

const manifest = validateMapManifest(JSON.parse(await fs.readFile(new URL('../../../maps/simeao-de-macedo/manifest.json', import.meta.url), 'utf8')));
// Preserve all 17 original artistic positions. Extend from point 17 by surveyed
// distances, at the same approximate 14 drawing units per metre as the other streets.
let distance = 0;
const points = manifest.points.map((p, i) => {
  if (i > 16) {
    const prev = manifest.points[i - 1], rad = Math.PI / 180;
    const a = Math.sin((p.latitude - prev.latitude) * rad / 2) ** 2 +
      Math.cos(prev.latitude * rad) * Math.cos(p.latitude * rad) * Math.sin((p.longitude - prev.longitude) * rad / 2) ** 2;
    distance += 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return {...p, x:0, y:i <= 16 ? i * 140 : Math.round(2240 + distance * 14)};
});
await fs.writeFile(new URL('../../../src/simeao-points.js', import.meta.url), '// Gerado por reference/scripts/generate/generate-simeao-points.mjs. Pontos 1–17 preservados.\nexport const simeaoPoints = ' + JSON.stringify(points, null, 2) + ';\n');
console.log(`${points.length} pontos; extensão de ${distance.toFixed(1)} m após o ponto 17.`);
