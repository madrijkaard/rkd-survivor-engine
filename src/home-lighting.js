// Buildings with windows that serve public/commercial uses, rather than homes.
const nonResidential = new Set([
  'w15-fc-motos-yamaha', 'e07-clinica-recuada', 'e15-autoescola-bom-pastor',
  'pavilion', 'corner-shop', 'cm-s01-anexo-branco', 'cm-final-clinica', 'aa-reabilitar',
]);

export function hasHomeWindows(building) {
  const b = building.local || building;
  return b.residential !== false && !nonResidential.has(b.id) && !b.id.startsWith('aa-school-') &&
    [b, b.crossFacade, b.backFacade].some(face => face?.openings?.some(o => o.kind === 'window'));
}

function rank(id) {
  let value = 2166136261;
  for (const char of id) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
}

export function selectLitHomes(buildings) {
  const ids = [...new Set(buildings.filter(hasHomeWindows).map(b => b.id))];
  ids.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return new Set(ids.slice(0, Math.round(ids.length * .7)));
}
