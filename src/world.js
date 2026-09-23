import { streetBuildings, specialBuildings } from './street-data.js';
import { BAR, barWalkAreas, barObstacles } from './bar-layout.js';
import { antonioPoints, antonioBuildings, antonioCornerFacades, alignAntonioCorner, CINEMA_BACK, onAntonioRoad, CINEMA_GARDEN, JULHO_ROAD, antonioTrees, antonioPoles, antonioCars, antonioBikes } from './antonio-data.js';
import { footprintObstacle, hitsFootprint } from './building-geometry.js';
import { CINEMA_PLAZA, CINEMA_MONUMENT } from './cinema-plaza.js';
import { withPlaceName } from './place-names.js';
import { CROSS_Y, MENDONCA_END, CHURCH_PLAZA, plazaRoads, plazaSeats, plazaStatue, mendoncaPoints, mendoncaBuildings, cornerFacades, mendoncaTrees, mendoncaPoles } from './mendonca-data.js';
export { CROSS_Y, MENDONCA_END, WORLD_BOUNDS } from './mendonca-data.js';
// Unidade de desenho: aproximadamente 14 pixels por metro.
// A numeração preserva maps/simeao-de-macedo/ponto-01 … ponto-17.
export const STEP = 140;
export const END = 2300;
export const START = { x: 0, y: 30 };
export { PROJECTION, project, unproject } from './projection.js';
export const DIRECTIONS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];

export function pointAt(y) { return Math.max(1, Math.min(17, 1 + Math.round(y / STEP))); }
export function imagePath(point, direction = 1, street = 'simeao') {
  const folder = street === 'simeao' ? 'simeao-de-macedo' : street;
  return `maps/${folder}/ponto-${String(point).padStart(2, '0')}/${direction}.jpg`;
}
export const points = [
  ['O começo da rua', 'PRAÇA DO CINEMA', 'Canteiros circulares, árvores e o antigo cinema.'],
  ['À sombra da praça', 'PRAÇA DO CINEMA', 'O piso de pedra encontra as casas de portas baixas.'],
  ['O fim dos canteiros', 'PRAÇA DO CINEMA', 'O pequeno pavilhão amarelo fica à direita.'],
  ['O terreno aberto', 'TRANSIÇÃO', 'Muro branco, vegetação e o painel de produtos Faxyna.'],
  ['Depois da praça', 'RUA SIMEÃO DE MACEDO', 'A rua se estreita entre as fachadas e as calçadas.'],
  ['Telhas e grades', 'RUA SIMEÃO DE MACEDO', 'Casas de uma altura, telhas de barro e portões de metal.'],
  ['A casa de portão claro', 'RUA SIMEÃO DE MACEDO', 'Fachadas baixas, grades diagonais e paredes gastas.'],
  ['Branco e cinza', 'RUA SIMEÃO DE MACEDO', 'Um portão amplo à direita; a faixa vermelha à esquerda.'],
  ['A casa tomada pelo verde', 'RUA SIMEÃO DE MACEDO', 'Trepadeiras atravessam o reboco antigo.'],
  ['A fachada de azulejos', 'RUA SIMEÃO DE MACEDO', 'Garagens claras, pequenos consultórios e vasos na calçada.'],
  ['O reboco antigo', 'RUA SIMEÃO DE MACEDO', 'Tons de amarelo e vermelho marcam a parede desgastada.'],
  ['A abertura no muro', 'RUA SIMEÃO DE MACEDO', 'Um lote aberto interrompe a sequência das casas.'],
  ['A varanda de grades brancas', 'RUA SIMEÃO DE MACEDO', 'A casa bege vem depois do lote aberto; a casa verde aparece adiante.'],
  ['O desenho dos azulejos', 'RUA SIMEÃO DE MACEDO', 'O revestimento geométrico acompanha a janela gradeada.'],
  ['O Bar O Péricles', 'ÚLTIMO TRECHO', 'A fachada creme e azul do bar fica à esquerda, diante da garagem cinza.'],
  ['À porta do bar', 'ÚLTIMO TRECHO', 'Entre no Bar O Péricles ou siga até a fachada laranja da autoescola.'],
  ['Autoescola Bom Pastor', 'A LIGAÇÃO ENTRE AS RUAS', 'Vire junto à autoescola para explorar a Rua Cônego Mendonça.'],
].map(([title, area, detail], i) => ({ id: i + 1, x:0, y: i * STEP, title, area, detail, street:'simeao' }));

const mendoncaDescriptions=[
  ['A esquina da autoescola','A lateral laranja da autoescola encontra a loja de chaves e o Bar O Péricles.'],
  ['A casa ocre','Garagem de metal, grades curvas e uma árvore pequena junto à calçada.'],
  ['A varanda comprida','A faixa branca sob a varanda fica diante do muro creme e azul escuro.'],
  ['Portões rosados','O sobrado verde de duas garagens fica diante da casa amarela antiga.'],
  ['O sobrado branco','Vidros azulados, portões brancos e o muro cinza com concertina.'],
  ['O muro do jardim','O muro rosa acompanha a rua; a torre aparece entre as árvores.'],
  ['O sobrado rosa','Grades claras, aparelhos de ar e sinais de umidade na base.'],
  ['Entre o jardim e a igreja','Palmeiras atrás das grades; a fachada da Igreja Família IDE do outro lado.'],
  ['A praça se abre','A casa de jardim termina na esquina, diante dos degraus rosados da praça.'],
  ['A lateral da praça','A casa amarela fica diante da escadaria; a rua continua ao lado da igreja.'],
  ['A igreja sobre a praça','A nave comprida e a torre ficam dentro da praça, atrás das árvores e dos bancos rosados.'],
  ['A casa coberta de verde','Trepadeiras cobrem quase toda a fachada branca, diante das árvores da praça.'],
  ['Bazar e portões brancos','O bazar, a garagem 67 e o portão 69 têm entradas e rampas diferentes.'],
  ['O muro de faixas diagonais','O muro bege de esquina tem faixas brancas inclinadas e cerca elétrica.'],
  ['O fim da Cônego Mendonça','A rua termina diante da Academia Figueiredo; as vias ao redor da praça continuam livres.'],
];
export const crossPoints=mendoncaPoints.map((p,i)=>({...p,street:'conego-mendonca',area:'RUA CÔNEGO MENDONÇA',title:mendoncaDescriptions[i][0],detail:mendoncaDescriptions[i][1]}));
const antonioDescriptions=[
  ['Da Cônego à Antônio Alexandre','A igreja sobre a praça fica atrás; a clínica amarela e a Igreja Família IDE marcam a entrada.'],
  ['A lateral da clínica','Três portas, janelas gradeadas e degraus na parede amarela; do outro lado, o muro cinza.'],
  ['Pedra, amarelo e branco','A garagem branca tem uma faixa escura; a casa vizinha tem colunas de pedra e entrada elevada.'],
  ['O muro de tijolos','Bananeiras e trepadeiras crescem atrás do muro de tijolos com vestígios de pintura branca.'],
  ['O portão diagonal','A casa 1690 e a Stetmed ficam diante do jardim de cactos e flores.'],
  ['Gráfica Imprima','Consultório 1708, gráfica branca e casa 1709 de muro creme.'],
  ['A casa verde','A casa 1714 tem uma janela ornamental; do outro lado, flores cobrem a fachada ocre.'],
  ['As árvores podadas','Três copas acompanham a casa de azulejos verdes. Uma casa antiga tem grades em losangos.'],
  ['O terreno aberto','A sequência de casas dá lugar ao terreno com vegetação, diante do portão cinza.'],
  ['A curva da rua','O muro antigo acompanha a curva; as árvores grandes começam a sombrear a calçada.'],
  ['As casas recuadas','Casa rosa com losangos, sobrado claro e reboco aparente atrás dos canteiros.'],
  ['O começo da escola','Termina o terreno aberto e começa o muro da Escola Santa Filomena.'],
  ['Azulejos azuis','Duas faixas de cobogó branco percorrem o muro azul da escola.'],
  ['O mural da escola','Âncora, ondas e lápis pintados no bloco alto, atrás do muro.'],
  ['Canteiros da praça','Flores vermelhas, caminhos de pedra e árvores acompanham a rua.'],
  ['A entrada coberta','O portão escuro da escola fica sob a cobertura de telhas.'],
  ['A outra face do cinema','O prédio antigo encerra os canteiros, com reboco gasto e tijolos expostos.'],
  ['Escola Santa Filomena','A segunda entrada tem azulejos claros, faixa rosa e um portão recuado.'],
  ['Perto da Vinte e Oito','Muro de tijolos de um lado; a parede alta e desgastada do cinema do outro.'],
  ['A esquina da Vinte e Oito de Julho','A clínica Reabilitar fica à frente. A rua transversal permite retornar à Simeão.'],
];
export const parallelPoints=antonioPoints.map((p,i)=>({...p,area:'RUA ANTÔNIO ALEXANDRE',title:antonioDescriptions[i][0],detail:antonioDescriptions[i][1]}));
export const routes=[
  {id:'simeao',folder:'simeao-de-macedo',name:'Rua Simeão de Macedo',points},
  {id:'conego-mendonca',folder:'conego-mendonca',name:'Rua Cônego Mendonça',points:crossPoints},
  {id:'antonio-alexandre',folder:'antonio-alexandre',name:'Rua Antônio Alexandre',points:parallelPoints},
];
export const allPoints=routes.flatMap(route=>route.points);
export function locationAt(x,y) {
  const distanceToRoute=r=>Math.min(...r.points.slice(1).map((b,i)=>{
    const a=r.points[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));
    return Math.hypot(x-a.x-t*dx,y-a.y-t*dy);
  }));
  const route=routes.reduce((best,r)=>distanceToRoute(r)<distanceToRoute(best)?r:best);
  const point=route.points.reduce((best,p)=>Math.hypot(p.x-x,p.y-y)<Math.hypot(best.x-x,best.y-y)?p:best);
  return {route,point,city:route.city??null,neighborhood:point.neighborhood??route.neighborhood??null};
}

export const buildings = [...streetBuildings, ...specialBuildings].map(b=>({...b,
  ...(cornerFacades[b.id]?{crossFacade:cornerFacades[b.id]}:{}),
  ...(b.id==='e15-autoescola-bom-pastor'?{roof:'tile'}:{}),
  ...(b.id==='corner-shop'?{color:'#40596b',base:'#465e6a',pattern:'small-tile',name:'HMB Chaves e Carimbos',signs:b.signs.map(s=>({...s,text:s.text==='HM'?'HMB':s.text}))}:{}),
  ...(b.id==='cinema'?{depth:370,length:360,backFacade:CINEMA_BACK}:{}),
})).concat(mendoncaBuildings.map(b=>{
  const crossFacade=antonioCornerFacades[b.id];
  if(!crossFacade)return b;
  const local={...b.local,crossFacade,...(b.id==='cm-final-clinica'?{depth:288}:{})};
  return {...b,local,y:CROSS_Y-local.x-local.depth,length:local.depth};
}),antonioBuildings).map(b=>{
  if(b.id==='cinema'||b.id==='cm-s05-igreja-familia')return alignAntonioCorner(b,'west',CROSS_Y);
  if(b.id==='cm-final-clinica')return alignAntonioCorner(b,'east',CROSS_Y);
  return b;
}).map(withPlaceName);
export const planters = [
  { x: 126, y: 26, r: 28, tiers:3, tree:false },
  { x: 132, y: 128, r: 27, tiers:3, tree:true },
  { x: 136, y: 282, r: 27, tiers:2, tree:true },
  { x: 258, y: 226, r: 22, tiers:2, tree:false },
  { x: 366, y: 134, r: 32, tiers:1, tree:false },
  CINEMA_MONUMENT,
];
// Objetos nomeáveis do mundo, incluindo aqueles que ainda não têm nome próprio.
// Reutiliza as mesmas instâncias e coordenadas da renderização e da colisão.
export const places = [
  ...buildings, CINEMA_PLAZA, CHURCH_PLAZA,
  ...planters.filter(p=>p.monument), plazaStatue,
];
export function getPlace(id) { return places.find(place=>place.id===id) ?? null; }

export const trees = [
  ...antonioTrees,
  ...mendoncaTrees,
  { x:132,y:128,size:27,height:43,kind:'sapling',seed:20 },
  { x:136,y:282,size:45,height:77,kind:'young',seed:21 },
  { x:218,y:397,size:63,seed:33 },
  { x:378,y:278,size:81,seed:31 },
  { x:413,y:350,size:75,seed:32 },
  { x:-132,y:365,size:76,seed:39 },
  { x:-184,y:513,size:90,seed:40 },
  { x:-211,y:624,size:85,seed:41 },
  { x:-122,y:705,size:51,height:68,kind:'young',seed:42 },
  { x:290,y:1547,size:95,height:117,kind:'palm',seed:53 },
  { x:267,y:1559,size:66,seed:55 },
  { x:193,y:1931,size:100,height:133,kind:'palm',seed:61 },
];
export const cars = [
  ...antonioCars,
  { x: -49, y: 140, color: '#d0d2c6', seed: 7 },
  { x: -49, y: 244, color: '#355c83', seed: 8 },
  { x: -49, y: 1527, color: '#41484e', seed: 9 },
  { x: -49, y: 1710, color: '#bb4940', seed: 10 },
];
export const benches = [{ x:346,y:289,w:38,h:10 },{ x:379,y:244,w:35,h:10 },{ x:341,y:342,w:35,h:10 }];
export const poles = [
  ...antonioPoles,
  { x:311,y:165,height:170,lamp:true },
  { x:-72,y:157,height:147 },{ x:-72,y:548,height:156 },
  { x:-72,y:999,height:148 },{ x:-72,y:1382,height:146 },
  { x:-72,y:1815,height:151 },{ x:-72,y:2232,height:149 },
  ...mendoncaPoles,
];

export const walkAreas = [
  CINEMA_GARDEN,JULHO_ROAD,
  { x: -77, y: -95, w: 154, h: 2435 },
  CINEMA_PLAZA,
  { x: 60, y: 360, w: 230, h: 243 },
  { x: -320, y: -110, w: 870, h: 60 },
  { x: -320, y: 2290, w: 660, h: 108 },
  { x: 0, y: CROSS_Y-65, w: MENDONCA_END+70, h:130 },
  ...plazaRoads,
  CHURCH_PLAZA,
  ...barWalkAreas,
];
export const obstacles = [
  ...antonioBikes.map(b=>({x:b.x-6,y:b.y-12,w:12,h:24,id:'aa-motorcycle'})),
  ...buildings.filter(b=>b.id!==BAR.buildingId).map(footprintObstacle),
  ...barObstacles,
  ...cars.map(c => ({ x: c.x - 16, y: c.y - 32, w: 32, h: 64, id: 'car' })),
  ...benches.map(b => ({ ...b, id: 'bench' })),
  ...planters.map(p => p.monument?{x:p.x-p.r,y:p.y-p.r,w:p.r*2,h:p.r*2,id:p.id}:{ x: p.x, y: p.y, r: p.r, id: 'planter' }),
  ...trees.map(t => ({ x: t.x, y: t.y, r: 5, id: 'tree' })),
  ...poles.map(p => ({ x: p.x, y: p.y, r: 3, id: 'pole' })),
  { x: 47, y: 2188, w: 25, h: 52, id: 'motorcycles' },
  { x: 109, y: 491, w: 167, h: 6, id: 'billboard' },
  ...plazaSeats.map(s=>({...s,id:'plaza-seat'})),
  {...plazaStatue,id:'plaza-statue'},
];
function inRect(x, y, r, padding = 0) { return x > r.x - padding && x < r.x + r.w + padding && y > r.y - padding && y < r.y + r.h + padding; }
export function walkable(x, y, radius = 5) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  // Samples also keep the actor's feet away from the outer edge of a sidewalk.
  if (![[0, 0], [-radius, 0], [radius, 0], [0, -radius], [0, radius]].every(([dx, dy]) => walkAreas.some(a => inRect(x + dx, y + dy, a)) || onAntonioRoad(x+dx,y+dy))) return false;
  return !obstacles.some(o => o.polygon ? hitsFootprint(x,y,o,radius) : o.r ? Math.hypot(x - o.x, y - o.y) < o.r + radius : inRect(x, y, o, radius));
}
export function moveActor(actor, dx, dy) {
  // Small substeps prevent walking through a car or wall during a slow frame.
  const count = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4));
  let moved = false;
  for (let i = 0; i < count; i++) {
    const nx = actor.x + dx / count, ny = actor.y + dy / count;
    if (walkable(nx, ny)) { actor.x = nx; actor.y = ny; moved = true; }
    else {
      if (walkable(nx, actor.y)) { actor.x = nx; moved = true; }
      if (walkable(actor.x, ny)) { actor.y = ny; moved = true; }
    }
  }
  return moved;
}
export function clearLine(a, b) {
  const count = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6);
  for (let i = 0; i <= count; i++) { const t = count ? i / count : 0; if (!walkable(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false; }
  return true;
}
export function findPath(start, destination) {
  if (!walkable(destination.x, destination.y)) return null;
  if (clearLine(start, destination)) return [destination];
  const cell = 14, key = (x, y) => `${x},${y}`;
  const sx = Math.round(start.x / cell), sy = Math.round(start.y / cell);
  const gx = Math.round(destination.x / cell), gy = Math.round(destination.y / cell);
  const heuristic = (x, y) => Math.hypot(x - gx, y - gy);
  const startNode = { x: sx, y: sy, g: 0, f: heuristic(sx, sy), parent: null };
  const open = [startNode], costs = new Map([[key(sx, sy), 0]]), closed = new Set();
  const steps = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  let found = null;
  for (let iteration = 0; open.length && iteration < 18000; iteration++) {
    let best = 0; for (let i = 1; i < open.length; i++) if (open[i].f < open[best].f) best = i;
    const node = open.splice(best, 1)[0], k = key(node.x, node.y);
    if (closed.has(k)) continue; closed.add(k);
    if (Math.hypot(node.x * cell - destination.x, node.y * cell - destination.y) < cell * 1.7 && clearLine({ x: node.x * cell, y: node.y * cell }, destination)) { found = node; break; }
    for (const [dx, dy] of steps) {
      const x = node.x + dx, y = node.y + dy, nextKey = key(x, y);
      if (closed.has(nextKey) || !walkable(x * cell, y * cell)) continue;
      if (dx && dy && (!walkable((node.x + dx) * cell, node.y * cell) || !walkable(node.x * cell, (node.y + dy) * cell))) continue;
      const g = node.g + Math.hypot(dx, dy);
      if (g >= (costs.get(nextKey) ?? Infinity)) continue;
      costs.set(nextKey, g); open.push({ x, y, g, f: g + heuristic(x, y), parent: node });
    }
  }
  if (!found) return null;
  const route = [destination];
  while (found) { route.push({ x: found.x * cell, y: found.y * cell }); found = found.parent; }
  route.reverse();
  // Skip grid nodes only if the whole connecting line clears collision geometry.
  const result = []; let anchor = start, i = 0;
  while (i < route.length) {
    let last = i; while (last + 1 < route.length && clearLine(anchor, route[last + 1])) last++;
    if (!clearLine(anchor, route[last])) return null;
    result.push(route[last]); anchor = route[last]; i = last + 1;
  }
  return result;
}
