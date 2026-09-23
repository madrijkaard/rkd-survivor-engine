export const MAP_DIRECTIONS = Object.freeze(['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']);

const hasText = value => typeof value === 'string' && value.trim().length > 0;

/** Contrato comum das capturas em maps/<rua>/manifest.json. */
export function validateMapManifest(manifest, source = 'manifest.json') {
  const fail = message => { throw new Error(`${source}: ${message}`); };
  if (!manifest || typeof manifest !== 'object') fail('manifesto inválido');
  if (manifest.schemaVersion !== 1) fail('schemaVersion deve ser 1');
  for (const field of ['city', 'street', 'neighborhood']) {
    if (!hasText(manifest[field])) fail(`informe ${field}`);
  }
  if (manifest.coordinateSystem !== 'WGS84') fail('use coordenadas geográficas WGS84');
  if (JSON.stringify(manifest.directions) !== JSON.stringify(MAP_DIRECTIONS)) fail('ordem das oito direções inválida');
  if (!Array.isArray(manifest.points) || !manifest.points.length) fail('informe os pontos fotografados');
  const panoramas = new Set();
  for (const [index, point] of manifest.points.entries()) {
    if (!point || point.id !== index + 1) fail('os pontos devem estar numerados de 1 em diante, sem lacunas');
    if (!hasText(point.pano) || panoramas.has(point.pano)) fail(`panorama inválido ou repetido no ponto ${point.id}`);
    panoramas.add(point.pano);
    if (!Number.isFinite(point.latitude) || Math.abs(point.latitude) > 90 ||
        !Number.isFinite(point.longitude) || Math.abs(point.longitude) > 180) fail(`coordenadas inválidas no ponto ${point.id}`);
    if (point.neighborhood !== undefined && !hasText(point.neighborhood)) fail(`bairro inválido no ponto ${point.id}`);
  }
  return manifest;
}

/** Carrega os metadados sem mudar as coordenadas x/y já desenhadas no jogo. */
export async function loadMapManifests(routes, fetchManifest = fetch) {
  const loaded = await Promise.all(routes.map(async route => {
    const url = new URL(`../maps/${route.folder}/manifest.json`, import.meta.url);
    const response = await fetchManifest(url);
    if (!response.ok) throw new Error(`Não foi possível ler ${route.folder}/manifest.json (${response.status})`);
    const manifest = validateMapManifest(await response.json(), `${route.folder}/manifest.json`);
    const ids = new Set(route.points.map(point => point.id));
    if (ids.size !== route.points.length || manifest.points.length !== ids.size || manifest.points.some(point => !ids.has(point.id))) {
      throw new Error(`${route.folder}/manifest.json: os pontos não correspondem aos pontos do cenário`);
    }
    return { route, manifest };
  }));

  // Só aplica os dados depois de validar todas as ruas: uma falha não deixa
  // parte do mundo com metadados novos e outra parte com os antigos.
  for (const { route, manifest } of loaded) {
    route.name = manifest.street;
    route.city = manifest.city;
    route.neighborhood = manifest.neighborhood;
    const records = new Map(manifest.points.map(point => [point.id, point]));
    for (const point of route.points) {
      const record = records.get(point.id);
      Object.assign(point, {
        pano: record.pano,
        latitude: record.latitude,
        longitude: record.longitude,
        neighborhood: record.neighborhood ?? manifest.neighborhood,
      });
    }
  }
}
