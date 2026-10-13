// Unidade de referência comum ao desenho, às colisões e à largura das pistas.
export const CAR_WIDTH = 32;
export const CAR_LENGTH = 65;
// Largura visual do corpo com os braços; o raio dos pés na navegação é menor.
export const PERSON_WIDTH = 20;
export const ROAD_TYPES = Object.freeze({rua: 4, avenida: 5});
export const SIDEWALK_TYPES = Object.freeze({'calcada-de-rua': 2, 'calcada-de-avenida': 4});
export function roadProfile(roadType, sidewalkType = `calcada-de-${roadType}`) {
  if (!Object.hasOwn(ROAD_TYPES, roadType)) throw new Error('roadType deve ser rua ou avenida');
  if (sidewalkType !== `calcada-de-${roadType}`) throw new Error('sidewalkType deve corresponder ao roadType');
  const carsAcross = ROAD_TYPES[roadType], width = carsAcross * CAR_WIDTH;
  const peopleAcross = SIDEWALK_TYPES[sidewalkType], sidewalkWidth = peopleAcross * PERSON_WIDTH;
  return Object.freeze({roadType, carsAcross, width, halfWidth: width / 2,
    sidewalkType, peopleAcross, sidewalkWidth, outerHalfWidth: width / 2 + sidewalkWidth,
    totalWidth: width + sidewalkWidth * 2});
}
export function manifestRoadProfile(manifest) {
  if (!Object.hasOwn(SIDEWALK_TYPES, manifest.sidewalkType)) throw new Error('sidewalkType deve ser calcada-de-rua ou calcada-de-avenida');
  return roadProfile(manifest.roadType, manifest.sidewalkType);
}
export function carFootprint(c) {
  if (c.angle !== undefined) {
    const cos=Math.cos(c.angle), sin=Math.sin(c.angle);
    const polygon=[[-CAR_WIDTH/2,-CAR_LENGTH/2],[CAR_WIDTH/2,-CAR_LENGTH/2],[CAR_WIDTH/2,CAR_LENGTH/2],[-CAR_WIDTH/2,CAR_LENGTH/2]].map(([x,y])=>[c.x+cos*x+sin*y,c.y-sin*x+cos*y]);
    const xs=polygon.map(p=>p[0]), ys=polygon.map(p=>p[1]);
    return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),polygon,id:'car'};
  }
  const w = c.axis === 'x' ? CAR_LENGTH : CAR_WIDTH;
  const h = c.axis === 'x' ? CAR_WIDTH : CAR_LENGTH;
  return {x:c.x-w/2, y:c.y-h/2, w, h, id:'car'};
}
export const parkingOffset = profile => profile.halfWidth - CAR_WIDTH / 2 - 1;

// Bordas paralelas ao eixo, medidas perpendicularmente mesmo nas curvas.
// A interseção das paralelas evita estreitar a pista ou abrir fendas nas juntas.
export function offsetRoadPath(points, offset) {
  const normals = points.slice(1).map((b,i) => {
    const a=points[i], dx=b.x-a.x, dy=b.y-a.y, length=Math.hypot(dx,dy);
    if (!length) throw new Error('Segmento de rua sem comprimento');
    return {x:-dy/length,y:dx/length};
  });
  return points.map((p,i) => {
    const a=normals[Math.max(0,i-1)], b=normals[Math.min(i,normals.length-1)];
    const dot=1+a.x*b.x+a.y*b.y;
    if (dot<.01) throw new Error('Curva de retorno não suportada');
    return {x:p.x+offset*(a.x+b.x)/dot,y:p.y+offset*(a.y+b.y)/dot};
  });
}
