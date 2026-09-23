// node --use-system-ca reference/scripts/capture/capture-street.mjs <pasta> "Rua" "Bairro" <pano> <latitude> <longitude>
// Panorama e coordenadas devem vir da posição observada no Street View.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'node:net';
import { MAP_DIRECTIONS, validateMapManifest } from '../../../src/map-manifests.js';

const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));

setDefaultAutoSelectFamilyAttemptTimeout(2000);

export async function capturePoint({folder, street, neighborhood, pano, latitude, longitude, city = 'Codó'}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder ?? '')) throw new Error('Informe uma pasta de rua válida, por exemplo simeao-de-macedo');
  if (typeof neighborhood !== 'string' || !neighborhood.trim()) throw new Error('Informe o bairro do ponto capturado');
  if (![latitude, longitude].every(value => (typeof value === 'number' || (typeof value === 'string' && value.trim())) && Number.isFinite(Number(value)))) {
    throw new Error('Informe a latitude e a longitude observadas no Street View');
  }
  const root = path.join(projectRoot, 'maps', folder), manifestPath = path.join(root, 'manifest.json');
  let manifest;
  try { manifest = validateMapManifest(JSON.parse(await fs.readFile(manifestPath, 'utf8')), manifestPath); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    manifest = {schemaVersion:1, city, street, neighborhood, coordinateSystem:'WGS84', capturedAt:new Date().toISOString().slice(0,10), directions:[...MAP_DIRECTIONS], points:[]};
  }
  if (manifest.city !== city || manifest.street !== street) throw new Error('A cidade ou rua informada não corresponde ao manifesto existente');
  let point = manifest.points.find(p => p.pano === pano);
  if (!point) { point = {id:manifest.points.length + 1}; manifest.points.push(point); }
  Object.assign(point, {pano, latitude:Number(latitude), longitude:Number(longitude)});
  if (neighborhood !== manifest.neighborhood) point.neighborhood = neighborhood;
  else delete point.neighborhood;
  validateMapManifest(manifest, manifestPath);

  // Baixa as oito imagens completas antes de gravar o conjunto e seu manifesto.
  const images = [];
  for (let start = 0; start < 8; start += 4) {
    images.push(...await Promise.all(Array.from({length:4}, async (_, offset) => {
      const direction = start + offset;
      const url = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=0&panoid=${encodeURIComponent(pano)}&yaw=${direction*45}`;
      let response;
      for (let attempt = 0; attempt < 3; attempt++) {
        try { response = await fetch(url, {signal:AbortSignal.timeout(15000)}); break; }
        catch (error) { if (attempt === 2) throw error; }
      }
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Falha na foto ${direction+1}: ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 5000 || bytes[0] !== 255 || bytes[1] !== 216) throw new Error('A resposta não é uma fotografia JPEG válida');
      return bytes;
    })));
  }
  const pointFolder = path.join(root, `ponto-${String(point.id).padStart(2,'0')}`);
  await fs.mkdir(pointFolder, {recursive:true});
  await Promise.all(images.map((bytes, i) => fs.writeFile(path.join(pointFolder, `${i+1}.jpg`), bytes)));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${manifest.street} · ${neighborhood} · ponto ${point.id}: oito fotos e coordenadas salvas.`);
  return {manifest, point};
}

// Os comandos antigos continuam válidos; o último argumento permite indicar
// outro bairro ao atravessar uma divisa durante o mapeamento.
export async function captureKnownStreet(folder, street) {
  const [pano, latitude, longitude, pointNeighborhood] = process.argv.slice(2);
  let neighborhood = pointNeighborhood;
  if (!neighborhood) {
    const manifest = JSON.parse(await fs.readFile(path.join(projectRoot, 'maps', folder, 'manifest.json'), 'utf8'));
    neighborhood = manifest.neighborhood;
  }
  return capturePoint({folder, street, neighborhood, pano, latitude, longitude});
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [folder, street, neighborhood, pano, latitude, longitude] = process.argv.slice(2);
  await capturePoint({folder, street, neighborhood, pano, latitude, longitude});
}
