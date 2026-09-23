import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { routes, locationAt, imagePath } from '../src/world.js';
import { validateMapManifest, loadMapManifests } from '../src/map-manifests.js';

const readManifest = async folder => JSON.parse(await readFile(new URL(`../maps/${folder}/manifest.json`, import.meta.url), 'utf8'));
const localFetch = async url => ({ok:true, json:async () => JSON.parse(await readFile(url, 'utf8'))});

test('cada rua tem manifesto com bairro, rua, coordenadas e oito fotos por ponto', async () => {
  let total = 0;
  for (const route of routes) {
    const manifest = validateMapManifest(await readManifest(route.folder));
    assert.equal(manifest.city, 'Codó');
    assert.equal(manifest.neighborhood, 'Centro');
    assert.equal(manifest.street, route.name);
    const folders = (await readdir(new URL(`../maps/${route.folder}/`, import.meta.url))).filter(name => /^ponto-\d+$/.test(name));
    assert.equal(folders.length, manifest.points.length);
    for (const point of manifest.points) {
      for (let direction = 1; direction <= 8; direction++) {
        assert.ok((await stat(new URL(`../${imagePath(point.id, direction, route.id)}`, import.meta.url))).size > 1000);
      }
    }
    total += manifest.points.length;
  }
  assert.equal(total, 52);
});

test('carregar os manifestos preserva as posições e as referências do cenário', async () => {
  const copies = structuredClone(routes);
  const before = copies.map(route => route.points.map(({id,x,y,street}) => ({id,x,y,street})));
  await loadMapManifests(copies, localFetch);
  assert.deepEqual(copies.map(route => route.points.map(({id,x,y,street}) => ({id,x,y,street}))), before);
  for (const route of copies) {
    const manifest = await readManifest(route.folder);
    for (const point of route.points) {
      const recorded = manifest.points.find(p => p.id === point.id);
      assert.equal(point.neighborhood, 'Centro');
      assert.equal(point.latitude, recorded.latitude);
      assert.equal(point.longitude, recorded.longitude);
      assert.equal(point.pano, recorded.pano);
    }
  }
});

test('o bairro acompanha o ponto atual, muda na mesma rua e volta ao bairro da rua vizinha', async () => {
  const manifest = await readManifest('simeao-de-macedo');
  // Bairro fictício somente neste teste: simula uma divisa entre os pontos 8 e 9.
  for (const point of manifest.points) if (point.id >= 9) point.neighborhood = 'Bairro de teste';
  try {
    await loadMapManifests(routes, async url => url.pathname.includes('/simeao-de-macedo/')
      ? {ok:true, json:async () => manifest} : localFetch(url));
    const simeao = routes[0];
    const [before, after] = [simeao.points[7], simeao.points[8]];
    const middle = (before.y + after.y) / 2;
    assert.equal(locationAt(0, middle - 1).neighborhood, 'Centro');
    assert.equal(locationAt(0, middle + 1).neighborhood, 'Bairro de teste');
    assert.equal(locationAt(0, middle - 1).neighborhood, 'Centro', 'Retornar pelo mesmo caminho atualiza o bairro');
    const other = routes[1].points[3];
    assert.equal(locationAt(other.x, other.y).neighborhood, 'Centro');
    assert.equal(locationAt(other.x, other.y).city, 'Codó');
  } finally {
    await loadMapManifests(routes, localFetch);
  }
});

test('manifestos incompletos ou com coordenadas inválidas são rejeitados antes de alterar as ruas', async () => {
  const base = await readManifest('simeao-de-macedo');
  for (const change of [
    m => { delete m.neighborhood; },
    m => { m.points[0].latitude = null; },
    m => { m.points[0].longitude = 181; },
    m => { m.points[0].neighborhood = ''; },
    m => { m.points[1].id = 1; },
    m => { m.points[1].pano = m.points[0].pano; },
    m => { m.directions.reverse(); },
  ]) {
    const invalid = structuredClone(base); change(invalid);
    assert.throws(() => validateMapManifest(invalid));
  }
  const copies = structuredClone(routes), before = structuredClone(copies);
  await assert.rejects(loadMapManifests(copies, async url => {
    if (url.pathname.includes('/antonio-alexandre/')) return {ok:false, status:404};
    return localFetch(url);
  }), /antonio-alexandre/);
  assert.deepEqual(copies, before);
  const missingPoint = structuredClone(base); missingPoint.points.pop();
  await assert.rejects(loadMapManifests([copies[0]], async () => ({ok:true,json:async () => missingPoint})), /não correspondem/);
  assert.deepEqual(copies, before);
});
