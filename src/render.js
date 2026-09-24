import { drawTree, drawPlanter, drawLampBench, drawGardenWall, drawDemolition, drawBrickRecess, drawShrub, drawBin, drawBillboard } from './street-details.js';
import { makeDetailedFacade as makeFacade } from './facades.js';
import { drawDetailedBuilding as drawBuilding } from './architecture.js';
import { gardenWall, demolitionLot, brickRecess, flowerShrubs, bins } from './street-data.js';
import { project as P, buildings, trees, cars, benches, planters, poles, imagePath, allPoints, WORLD_BOUNDS, CROSS_Y, MENDONCA_END } from './world.js';
import { BAR, insideBar } from './bar-layout.js';
import { createBarScene } from './bar-render.js';
import { CAMERA_VIEWS, withCameraView, withCrossStreetFrame, PROJECTION } from './projection.js';
import { drawMendoncaGround, drawChurchTower, drawChurchNave, drawPlazaSeat, drawPlazaStatue } from './mendonca-render.js';
import { CHURCH_PLAZA, PLAZA_CHURCH, CHURCH_TOWER, plazaSeats, plazaStatue } from './mendonca-data.js';
import { drawAntonioGround, drawAntonioCactus } from './antonio-render.js';
import { antonioPoles, antonioShrubs, antonioBikes, antonioCacti } from './antonio-data.js';
import { buildingPlanPoint } from './building-geometry.js';
import { CINEMA_PLAZA } from './cinema-plaza.js';
import { poleLamps } from './lighting.js';
import { selectLitHomes } from './home-lighting.js';
import { SIMEAO_END, HENRIQUE_ROAD } from './simeao-extension.js';
import { drawSunShadows, beginLampLight, occludeLampLight, drawLampBulbs, finishLighting } from './lighting-render.js';

export function rng(seed = 1) {
  let n = seed >>> 0;
  return () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${Math.max(0, Math.min(255, (n >> 16) + amount))},${Math.max(0, Math.min(255, ((n >> 8) & 255) + amount))},${Math.max(0, Math.min(255, (n & 255) + amount))})`;
}
function poly(ctx, vertices, fill, stroke, width = 1) {
  ctx.beginPath(); vertices.forEach((v, i) => { const p = Array.isArray(v) ? P(...v) : v; i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function line(ctx, a, b, color, width = 1) { const p = P(...a), q = P(...b); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
function rect(ctx, x, y, w, h, fill, stroke) { poly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, stroke); }
function disk(ctx, x, y, r, fill, z = 0, stroke) {
  const points = Array.from({ length: 24 }, (_, i) => { const angle = i * Math.PI / 12; return [x + Math.cos(angle) * r, y + Math.sin(angle) * r, z]; });
  poly(ctx, points, fill, stroke);
}
function mapImage(ctx, image, a, b, d, alpha = 1) {
  const p = P(...a), q = P(...b), r = P(...d);
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.transform((q.x - p.x) / image.width, (q.y - p.y) / image.width, (r.x - p.x) / image.height, (r.y - p.y) / image.height, p.x, p.y);
  ctx.drawImage(image, 0, 0); ctx.restore();
}
function wallPanel(ctx, a, b, height, color, base) {
  poly(ctx, [[...a, 0], [...b, 0], [...b, height], [...a, height]], color, '#343b3359');
  poly(ctx, [[...a, 0], [...b, 0], [...b, height * .24], [...a, height * .24]], base);
  line(ctx, [...a, height - 2], [...b, height - 2], '#e5dfbf62', 1.5);
}
function posterize(c) {
  const ctx = c.getContext('2d', { willReadFrequently: true }), image = ctx.getImageData(0, 0, c.width, c.height), data = image.data;
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4, bias = (bayer[(y % 4) * 4 + x % 4] - 7) * .23;
    for (let k = 0; k < 3; k++) data[i + k] = Math.round((data[i + k] + bias) / 6) * 6;
  }
  ctx.putImageData(image, 0, 0);
}
function makeTexture(base, seed, kind) {
  const c = canvas(128, 128), ctx = c.getContext('2d'), r = rng(seed);
  ctx.fillStyle = base; ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 2900; i++) {
    ctx.fillStyle = r() > .5 ? `rgba(230,224,184,${r() * .15})` : `rgba(21,34,28,${r() * .17})`;
    ctx.fillRect(r() * 128, r() * 128, 1 + r() * 3, 1 + r() * 2);
  }
  if (kind === 'stone') {
    for (let y = 0; y < 128; y += 12) for (let x = -8; x < 128; x += 16) {
      ctx.strokeStyle = '#5d635a3a'; ctx.strokeRect(x + (y % 24 ? 8 : 0), y, 15, 11);
      ctx.fillStyle = `rgba(222,217,188,${r() * .12})`; ctx.fillRect(x + (y % 24 ? 8 : 0) + 1, y + 1, 14, 3);
    }
  }
  return c;
}
function rectAt(ctx, x, y, w, h, z, color) { poly(ctx, [[x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z]], color); }
function drawCar(ctx, c) {
  const { x, y } = c;
  for (const xx of [-16, 16]) for (const yy of [-19, 20]) { const p = P(x + xx, y + yy, 4); ctx.fillStyle = '#26312d'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 7, -.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#7b8477'; ctx.fillRect(p.x - 1, p.y - 2, 2, 4); }
  const w = 31, l = 65;
  wallPanel(ctx, [x - w / 2, y - l / 2], [x + w / 2, y - l / 2], 14, shade(c.color, -20), shade(c.color, -29));
  const nearX=PROJECTION.c>0?1:-1;
  wallPanel(ctx, [x + nearX*w / 2, y - l / 2], [x + nearX*w / 2, y + l / 2], 14, c.color, shade(c.color, -25));
  rectAt(ctx, x - w / 2, y - l / 2, w, l, 14, shade(c.color, 11));
  poly(ctx, [[x - 13, y - 12, 14], [x + 13, y - 12, 14], [x + 11, y - 5, 25], [x - 11, y - 5, 25]], '#688581', '#303c3b');
  rectAt(ctx, x - 11, y - 5, 22, 21, 25, shade(c.color, 18));
  poly(ctx, [[x - 11, y + 16, 25], [x + 11, y + 16, 25], [x + 13, y + 24, 14], [x - 13, y + 24, 14]], '#526b6d');
  poly(ctx, [[x + nearX*13, y - 12, 14], [x + nearX*11, y - 5, 25], [x + nearX*11, y + 16, 25], [x + nearX*13, y + 24, 14]], '#354d4c');
  line(ctx, [x - 14, y - 33, 11], [x + 14, y - 33, 11], '#bbc4aa', 2);
  line(ctx, [x - 12, y + 32, 12], [x - 4, y + 32, 12], '#b6715c', 2);
  line(ctx, [x + 4, y + 32, 12], [x + 12, y + 32, 12], '#b6715c', 2);
}
function drawBench(ctx, b) {
  for (const xx of [b.x + 5, b.x + b.w - 8]) { line(ctx, [xx, b.y, 0], [xx, b.y, 13], '#384b42', 3); line(ctx, [xx, b.y + b.h, 0], [xx, b.y + b.h, 13], '#384b42', 3); }
  rectAt(ctx, b.x, b.y, b.w, b.h, 13, '#a69b73');
  line(ctx, [b.x, b.y, 27], [b.x + b.w, b.y, 27], '#a09a75', 5);
  line(ctx, [b.x, b.y, 19], [b.x + b.w, b.y, 19], '#8c8c6c', 4);
}
function drawPole(ctx, p) {
  const base = P(p.x, p.y), top = P(p.x, p.y, p.height);
  if(p.lamp){
    line(ctx,[p.x,p.y,0],[p.x,p.y,p.height],'#a8af91',3);
    for(const [dx,dy] of [[-13,0],[13,0],[0,-13],[0,13]]){
      line(ctx,[p.x,p.y,p.height-5],[p.x+dx,p.y+dy,p.height],'#bfc4a2',1.5);
      const q=P(p.x+dx,p.y+dy,p.height);ctx.fillStyle='#ccd1ac';ctx.fillRect(q.x-4,q.y-2,8,4);ctx.fillStyle='#728476';ctx.fillRect(q.x-3,q.y-1,6,2);
    }
    return;
  }
  ctx.lineWidth = 6; ctx.strokeStyle = '#656f65'; ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y); ctx.stroke();
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#b7b999'; ctx.beginPath(); ctx.moveTo(base.x - 2, base.y); ctx.lineTo(top.x - 2, top.y); ctx.stroke();
  line(ctx, [p.x - 22, p.y, p.height - 4], [p.x + 22, p.y, p.height - 4], '#6b7664', 4);
  for (const x of [-17, 0, 17]) { const t = P(p.x + x, p.y, p.height + 1); ctx.fillStyle = '#414c47'; ctx.fillRect(t.x - 2, t.y - 4, 4, 7); }
  const mid = P(p.x, p.y, p.height * .76); ctx.fillStyle = '#828f83'; ctx.fillRect(mid.x - 7, mid.y, 14, 20); ctx.strokeStyle = '#485a50'; ctx.strokeRect(mid.x - 7, mid.y, 14, 20);
  for (const lamp of poleLamps(p)) {
    line(ctx, [p.x, p.y, p.height * .84], [lamp.x, lamp.y, lamp.z], '#a4ac96', 2);
    const q = P(lamp.x, lamp.y, lamp.z);
    ctx.fillStyle = '#9da894'; ctx.beginPath(); ctx.ellipse(q.x, q.y, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  }
}
function drawMotorcycle(ctx, x, y) {
  const a = P(x, y - 9, 4), b = P(x, y + 11, 4);
  for (const q of [a, b]) { ctx.strokeStyle = '#263b35'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(q.x, q.y, 5, 6, -.4, 0, Math.PI * 2); ctx.stroke(); }
  line(ctx, [x, y - 8, 5], [x, y + 8, 13], '#7d8c7d', 2); line(ctx, [x, y - 2, 16], [x, y + 9, 16], '#293e3a', 5); line(ctx, [x, y - 12, 16], [x, y - 10, 6], '#6f8375', 2); line(ctx, [x - 6, y - 12, 18], [x + 6, y - 12, 18], '#abb39a', 2);
}
function bake(draw, bounds, depth, label = '', resolution=1) {
  const margin = 8, x = Math.floor(bounds.minX) - margin, y = Math.floor(bounds.minY) - margin;
  const w=Math.ceil(bounds.maxX-x+margin),h=Math.ceil(bounds.maxY-y+margin);
  const c = canvas(w*resolution,h*resolution), ctx = c.getContext('2d');
  ctx.scale(resolution,resolution);ctx.translate(-x, -y); draw(ctx); posterize(c);
  return { image: c, x, y, w, h, depth, label };
}
function boundsFor(x, y, w, l, h = 0, building=null) {
  const pp = [[x, y, 0], [x + w, y, 0], [x + w, y + l, 0], [x, y + l, 0], [x, y, h], [x + w, y, h], [x + w, y + l, h], [x, y + l, h]].map(([xx,yy,z]) => {const p=building?buildingPlanPoint(building,xx,yy):{x:xx,y:yy};return P(p.x,p.y,z);});
  return { minX: Math.min(...pp.map(p => p.x)), maxX: Math.max(...pp.map(p => p.x)), minY: Math.min(...pp.map(p => p.y)), maxY: Math.max(...pp.map(p => p.y)) };
}

export async function createScene(onProgress) {
  const photos = new Map(); let completed = 0;
  const requests=allPoints.flatMap(p=>(p.street==='conego-mendonca'?[1,5]:[3,7]).map(direction=>({point:p.id,street:p.street,direction})));
  requests.push(...buildings.filter(b=>b.photoDirection).map(b=>({point:b.point,street:b.street,direction:b.photoDirection})));
  const resources=[...new Map(requests.map(r=>[`${r.street}-${r.point}-${r.direction}`,r])).values()];
  await Promise.all(resources.map(({ point, street, direction }) => new Promise(resolve => {
    const im = new Image(); im.onload = () => { photos.set(`${street}-${point}-${direction}`, im); onProgress(++completed / resources.length*.78); resolve(); }; im.onerror = () => { onProgress(++completed / resources.length*.78); resolve(); }; im.src = imagePath(point, direction, street);
  })));
  const views=[];
  for(const [index,view] of CAMERA_VIEWS.entries()) {
    await new Promise(resolve=>setTimeout(resolve,0));
    const scene = withCameraView(index, () => bakeScene(photos));
    onProgress(.78 + (index+1)/CAMERA_VIEWS.length*.22);
    views.push({...scene, sourceCount:resources.length, viewIndex:index, viewId:view.id});
  }
  return {views};
}

function bakeScene(photos) {
  const {x,y,w,h,height}=WORLD_BOUNDS;
  const globalBounds = boundsFor(x,y,w,h,height);
  // Large ground/wire layers use a PS1-sized raster; facades retain full detail.
  const ground = bake(ctx => drawGround(ctx), globalBounds, -Infinity,'ground',.6);
  const sprites = [];
  const litHomes = selectLitHomes(buildings);
  function bakeBuilding(b,street='simeao') {
    const direction=b.photoDirection??(street==='conego-mendonca'?(b.side==='east'?5:1):(b.side==='east'?3:7));
    const tex = makeFacade(b, photos.get(`${street}-${b.point}-${direction}`));
    const f=b.crossFacade;
    const cross=f?makeFacade({...b,...f,id:`${b.id}-cross`,length:b.depth,facadeAxis:'x'},photos.get(`${f.street||'conego-mendonca'}-${f.point}-${f.photoDirection||(f.face==='minY'?1:5)}`)):null;
    const rear=b.backFacade,back=rear?makeFacade({...b,...rear,id:`${b.id}-rear`},photos.get(`${rear.street}-${rear.point}-${rear.photoDirection}`)):null;
    const base=buildingPlanPoint(b,b.x+b.depth/2,PROJECTION.d>0?b.y+b.length:b.y);
    const bounds=boundsFor(b.x - 25, b.y - 15, b.depth + 50, b.length + 30, b.height + (b.dish||b.detail==='sm-net-wall'?85:55),b);
    const sprite=bake(ctx => drawBuilding(ctx, b, tex,cross,back), bounds, P(base.x,base.y).y, b.id);
    if(litHomes.has(b.id)) {
      const windows=makeFacade(b,null,true);
      const crossWindows=f?makeFacade({...b,...f,id:`${b.id}-cross`,length:b.depth,facadeAxis:'x'},null,true):null;
      const backWindows=rear?makeFacade({...b,...rear,id:`${b.id}-rear`},null,true):null;
      sprite.windowLight=bake(ctx=>drawBuilding(ctx,b,windows,crossWindows,backWindows,true),bounds,sprite.depth).image;
    }
    sprites.push(sprite);
  }
  for (const b of buildings) {
    if(b.detail==='plaza-church')continue;
    if(b.axis==='x')withCrossStreetFrame(b.originY??CROSS_Y,()=>bakeBuilding(b.local,b.street));
    else bakeBuilding(b,b.street||'simeao');
  }
  const church=PLAZA_CHURCH,tower=CHURCH_TOWER;
  sprites.push(bake(drawChurchNave,boundsFor(church.x-8,church.y-8,church.w+16,church.h+16,210),P(church.x+church.w/2,PROJECTION.d>0?church.y+church.h:church.y).y,'church-nave'));
  sprites.push(bake(drawChurchTower,boundsFor(tower.x-8,tower.y-8,tower.w+16,tower.h+16,368),P(tower.x+tower.w/2,PROJECTION.d>0?tower.y+tower.h:tower.y).y,'church-tower'));
  for(const s of plazaSeats)sprites.push(bake(c=>drawPlazaSeat(c,s),boundsFor(s.x,s.y,s.w,s.h,24),P(s.x+s.w/2,PROJECTION.d>0?s.y+s.h:s.y).y,'plaza-seat'));
  sprites.push(bake(c=>drawPlazaStatue(c,plazaStatue),boundsFor(plazaStatue.x-5,plazaStatue.y-5,plazaStatue.w+10,plazaStatue.h+10,80),P(plazaStatue.x+12,plazaStatue.y+12).y,'plaza-statue'));
  sprites.push(bake(drawGardenWall, boundsFor(-91, gardenWall.y-5, 20, gardenWall.length+10, 65), P(-81,gardenWall.y).y, 'garden-wall'));
  sprites.push(bake(drawDemolition, boundsFor(demolitionLot.x-6,demolitionLot.y-5,demolitionLot.depth+12,demolitionLot.length+10,65), P(demolitionLot.x+demolitionLot.depth/2,demolitionLot.y).y, 'demolition'));
  sprites.push(bake(drawBrickRecess, boundsFor(brickRecess.x-8,brickRecess.y-7,brickRecess.depth+16,brickRecess.length+14,65), P(brickRecess.x+brickRecess.depth/2,brickRecess.y).y, 'brick-recess'));
  sprites.push(bake(drawLampBench,boundsFor(279,133,64,64,16),P(311,165).y,'lamp-bench'));
  for(const shrub of [...flowerShrubs,...antonioShrubs]) sprites.push(bake(c=>drawShrub(c,shrub),boundsFor(shrub.x-shrub.r-4,shrub.y-shrub.r-4,shrub.r*2+8,shrub.r*2+8,35),P(shrub.x,shrub.y).y,'flower-shrub'));
  for(const cactus of antonioCacti)sprites.push(bake(c=>drawAntonioCactus(c,cactus),boundsFor(cactus.x-13,cactus.y-2,26,4,cactus.height+3),P(cactus.x,cactus.y).y,'aa-cactus'));
  for(const bin of bins) sprites.push(bake(c=>drawBin(c,bin),boundsFor(bin.x-12,bin.y-9,24,18,42),P(bin.x,bin.y).y,'bin'));
  for (const p of planters) sprites.push(bake(ctx => drawPlanter(ctx, p), boundsFor(p.x - p.r - 7, p.y - p.r - 7, p.r * 2 + 14, p.r * 2 + 14, p.monument ? p.height : 25), P(p.x, p.y).y, p.id||'planter'));
  for (const b of benches) sprites.push(bake(ctx => drawBench(ctx, b), boundsFor(b.x - 5, b.y - 5, b.w + 10, b.h + 10, 36), P(b.x + b.w / 2, b.y).y, 'bench'));
  for (const c of cars) sprites.push(bake(ctx => drawCar(ctx, c), boundsFor(c.x - 22, c.y - 39, 44, 78, 30), P(c.x, c.y).y, 'car'));
  for (const t of trees) {
    const p = P(t.x, t.y); sprites.push(bake(ctx => drawTree(ctx, t), { minX: p.x - t.size, maxX: p.x + t.size, minY: p.y - Math.max(t.size*1.6,(t.height||t.size*.8)+t.size*.5+8), maxY: p.y + 10 }, p.y, 'tree'));
  }
  for (const p of poles) sprites.push({ ...bake(ctx => drawPole(ctx, p), boundsFor(p.x - 29, p.y - 20, 58, 40, p.height + 18), P(p.x, p.y).y, 'pole'), pole: p });
  sprites.push(bake(drawBillboard, boundsFor(97, 480, 194, 28, 87), P(192, 495).y, 'billboard'));
  sprites.push(bake(ctx => { drawMotorcycle(ctx, 50, 2195); drawMotorcycle(ctx, 55, 2217); }, boundsFor(36, 2177, 40, 60, 28), P(55, 2205).y, 'motorcycles'));
  for(const b of antonioBikes)sprites.push(bake(c=>drawMotorcycle(c,b.x,b.y),boundsFor(b.x-10,b.y-15,20,30,26),P(b.x,b.y).y,'aa-motorcycle'));
  const wires = bake(ctx => {
    const sequence = poles.filter(p => !p.lamp && p.x<0).sort((a,b)=>a.y-b.y);
    ctx.strokeStyle = '#273931ba'; ctx.lineWidth = .7;
    for (let i = 1; i < sequence.length; i++) for (const shift of [-12, 0, 12]) {
      const a = P(sequence[i - 1].x + shift, sequence[i - 1].y, sequence[i - 1].height), b = P(sequence[i].x + shift, sequence[i].y, sequence[i].height);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 15, b.x, b.y); ctx.stroke();
    }
    const crossPoles=poles.filter(p=>p.x>0&&!p.lamp&&p.y>2390);
    for(let i=1;i<antonioPoles.length;i++)for(const shift of [-9,0,9]){
      const prev=antonioPoles[i-1],next=antonioPoles[i],a=P(prev.x+shift,prev.y,prev.height),b=P(next.x+shift,next.y,next.height);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+15,b.x,b.y);ctx.stroke();
    }
    for(let i=1;i<crossPoles.length;i++)for(const shift of [-7,0,7]){
      const prev=crossPoles[i-1],next=crossPoles[i],a=P(prev.x,prev.y+shift,prev.height),b=P(next.x,next.y+shift,next.height);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+13,b.x,b.y);ctx.stroke();
    }
  }, globalBounds, Infinity,'wires',.6);
  const dust = rng(514);
  const particles = Array.from({ length: 32 }, () => ({ x: -40 + dust() * 330, y: dust() * 2350, phase: dust() * 10, speed: .2 + dust(), z: 10 + dust() * 75 }));
  const bar=createBarScene(bake,boundsFor,buildings.find(b=>b.id===BAR.buildingId));
  return { ground, sprites, wires, particles, bar, bounds: globalBounds, photosCount: photos.size, sourceCount: 34 };
}

function drawGround(ctx) {
  const random = rng(718);
  ctx.fillStyle = '#536152'; ctx.fillRect(-5000, -5000, 10000, 10000);
  const asphalt = ctx.createPattern(makeTexture('#62675c', 51), 'repeat');
  const dirt = ctx.createPattern(makeTexture('#89896b', 14), 'repeat');
  const paving = ctx.createPattern(makeTexture('#aaa993', 26, 'stone'), 'repeat');
  rect(ctx, -310, -160, 910, SIMEAO_END+480, dirt);
  rect(ctx, 0, 1950, MENDONCA_END+315, 1480, dirt);
  // Block interiors provide a continuous roofscape behind the photographed street.
  for (let side = 0; side < 2; side++) for (let y = -80; y < 2500; y += 160) {
    const x = side ? 262 : -352;
    rect(ctx, x, y, 105, 145, ['#858969', '#788261', '#999177'][Math.floor(random() * 3)], '#656c5750');
    for (let n = 0; n < 25; n++) disk(ctx, x + random() * 100, y + random() * 140, 2 + random() * 7, '#697a5659');
  }
  rect(ctx, -78, -120, 156, 2490, paving);
  rect(ctx, -60, -125, 120, 2500, asphalt);
  rect(ctx, -370, -118, 1010, 69, asphalt);
  rect(ctx, -370, 2291, 920, 110, asphalt);
  rect(ctx, CINEMA_PLAZA.x, CINEMA_PLAZA.y, CINEMA_PLAZA.w, CINEMA_PLAZA.h, paving);
  rect(ctx, 76, 379, 215, 224, dirt);
  // Dark flowing lines of the Portuguese paving, visible in the plaza photos.
  for(let x=112;x<370;x+=50){
    let previous=null;
    for(let y=-35;y<365;y+=3){const next=[x+Math.sin(y/17)*9,y,0];if(previous)line(ctx,previous,next,'#626b5166',1.7);previous=next;}
  }
  // Square paving modules and seams along the two sidewalks.
  for (let y = -40; y < 2290; y += 17) for (const x of [-77, 62]) {
    rect(ctx, x, y, 15, 16, random() > .85 ? '#848c7959' : null, '#626f594d');
    if (random() > .78) rect(ctx, x + 2, y + 2, 10, 6, '#bfc0a24d');
  }
  for (const x of [-61, 60]) {
    line(ctx, [x, -49, 1], [x, 2290, 1], '#ccd0af', 3);
    line(ctx, [x + (x < 0 ? 2 : -2), -49], [x + (x < 0 ? 2 : -2), 2290], '#384d3e7a', 1.5);
    for (let y = -40; y < 2280; y += 26) line(ctx, [x - 1, y], [x + 2, y], '#515e496f', 1);
  }
  for(const b of buildings.filter(b=>b.paving && !b.street && b.axis!=='x')){
    const x=b.side==='east'?62:-78;
    for(let y=b.y;y<b.y+b.length;y+=5)for(let xx=x;xx<x+16;xx+=5){
      const n=Math.round((y-b.y)/5)+Math.round((xx-x)/5);
      rect(ctx,xx,y,4.7,4.7,b.paving==='red-checker'?(n%2?'#a47769':'#b7b6a0'):(n%2?'#bdb397':'#c9c1a3'),'#78876b32');
    }
  }
  // Irregular repairs, grit and long cracks in the asphalt.
  for (let i = 0; i < 1600; i++) {
    const x = -58 + random() * 116, y = -35 + random() * 2310, p = P(x, y);
    ctx.fillStyle = random() > .55 ? '#c1c1a329' : '#243c2f28'; ctx.fillRect(p.x, p.y, 1 + random() * 4, 1 + random() * 2);
  }
  for (let i = 0; i < 90; i++) {
    let x = -49 + random() * 98, y = random() * 2290;
    for (let j = 0; j < 5; j++) { const nx = x - 5 + random() * 10, ny = y + 4 + random() * 9; line(ctx, [x, y], [nx, ny], '#303f3060', .8); x = nx; y = ny; }
  }
  for (let i = 0; i < 26; i++) { const x = -44 + random() * 85, y = random() * 2280; poly(ctx, [[x, y], [x + 17, y + 4], [x + 13, y + 37], [x - 7, y + 29]], i % 2 ? '#4c59494a' : '#b3ac8630'); }
  for (let i = 0; i < 400; i++) {
    const x = 66 + random() * 330, y = -20 + random() * 535;
    if (y < 350 && random() < .75) continue;
    const p = P(x, y); ctx.fillStyle = ['#647e4d', '#8e965c', '#a3a271'][i % 3]; ctx.fillRect(p.x, p.y, 2 + random() * 4, 2 + random() * 2);
  }
  // The open lot visible at point 12, bounded by the old remains of a wall.
  rect(ctx,demolitionLot.x,demolitionLot.y,demolitionLot.depth,demolitionLot.length,'#b69d76');
  for (let i = 0; i < 250; i++) { const p = P(demolitionLot.x + random() * demolitionLot.depth, demolitionLot.y + random() * demolitionLot.length); ctx.fillStyle = random() > .5 ? '#665e4739' : '#d6ba8b4b'; ctx.fillRect(p.x, p.y, 3, 2); }
  drawAntonioGround(ctx,asphalt,paving,dirt,buildings);
  drawMendoncaGround(ctx,asphalt,paving);
  // Continue straight through Cônego to the next surveyed crossing.
  rect(ctx,-78,CROSS_Y+50,156,SIMEAO_END+60-CROSS_Y-50,paving);
  rect(ctx,-60,CROSS_Y+48,120,SIMEAO_END+62-CROSS_Y-48,asphalt);
  rect(ctx,HENRIQUE_ROAD.x,HENRIQUE_ROAD.y,HENRIQUE_ROAD.w,HENRIQUE_ROAD.h,paving);
  rect(ctx,HENRIQUE_ROAD.x,HENRIQUE_ROAD.y+10,HENRIQUE_ROAD.w,HENRIQUE_ROAD.h-20,asphalt);
  for(const x of [-61,60]) {
    line(ctx,[x,CROSS_Y+65,1],[x,SIMEAO_END-60,1],'#c0c4a8',2);
    for(let y=CROSS_Y+65;y<SIMEAO_END-60;y+=18)line(ctx,[x<0?-78:62,y],[x<0?-62:78,y],'#737d6855',.7);
  }
  for(let i=0;i<1300;i++) {
    const y=CROSS_Y+70+random()*(SIMEAO_END-CROSS_Y-135),x=-55+random()*110,p=P(x,y);
    ctx.fillStyle=i%3?'#b9b49832':'#36423540';ctx.fillRect(p.x,p.y,2+random()*4,1+random()*2);
  }
  for(let y=3320;y<SIMEAO_END-65;y+=11)for(const x of [-76,67]) {
    const p=P(x+random()*6,y);ctx.fillStyle='#70854e88';ctx.fillRect(p.x,p.y,2+random()*5,2);
  }
  // Utility covers, weeds at the curb, and a narrow storm drain.
  for (let y = 380; y < 2100; y += 430) {
    disk(ctx, 14, y, 9, '#5c6653', 0, '#374839');
    for (let n = -5; n <= 5; n += 3) line(ctx, [8, y + n], [20, y + n], '#354a394d', 1);
    rect(ctx, -56, y + 70, 8, 26, '#35483a');
    for (let yy = y + 71; yy < y + 95; yy += 4) line(ctx, [-55, yy], [-49, yy], '#8d987d', 1);
  }
  for (let i = 0; i < 210; i++) { const y = random() * 2240, x = (random() > .5 ? -1 : 1) * (60 + random() * 5), p = P(x, y); ctx.fillStyle = '#6e815246'; ctx.fillRect(p.x, p.y, 1, 2 + random() * 4); }
  // Contact shadows for the circular planters.
  for (const p of planters) {
    if(p.monument)rect(ctx,p.x-p.r,p.y-p.r,p.r*2,p.r*2,'#243e2c36');
    else disk(ctx, p.x, p.y, p.r + 3, '#243e2c36');
  }
}

// Eight camera-facing directions and eight walk frames. These 2D sprites are
// baked once, then composited with the pre-rendered street using their feet.
export function createActorFrames() {
  return Array.from({ length: 8 }, (_, direction) => Array.from({ length: 8 }, (_, frame) => {
    const c = canvas(38, 54), ctx = c.getContext('2d'), angle = direction * Math.PI / 4;
    const sway = Math.sin(frame * Math.PI / 4), side = Math.sin(angle), face = Math.cos(angle);
    const x = 19, foot = 48, bounce = Math.abs(sway) * .9;
    const stroke = (a, b, color, width) => { ctx.lineCap = 'round'; ctx.lineWidth = width; ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
    // Slight limb foreshortening makes each walk direction distinct.
    for (const s of [-1, 1]) {
      const stride = sway * s, hip = [x + s * 3, 31 - bounce], knee = [x + s * 3 + stride * 2.5 + side, 39 - bounce], boot = [x + s * 3 + stride * 4 + side * 2, foot - Math.max(0, stride) * 2.5];
      stroke(hip, knee, s < 0 ? '#526a71' : '#6b8386', 5); stroke(knee, boot, '#405861', 4);
      stroke([boot[0] - 1, boot[1]], [boot[0] + (side || 1) * 3, boot[1]], '#26322f', 4);
    }
    ctx.fillStyle = '#273b38'; ctx.beginPath(); ctx.moveTo(x - 6, 19 - bounce); ctx.lineTo(x + 6, 19 - bounce); ctx.lineTo(x + 5, 33 - bounce); ctx.lineTo(x - 5, 33 - bounce); ctx.fill();
    ctx.fillStyle = '#716960'; ctx.fillRect(x - 3, 19 - bounce, 6, 11);
    ctx.fillStyle = '#394c47'; ctx.fillRect(x - 6, 19 - bounce, 3, 13); ctx.fillStyle = '#4b5c50'; ctx.fillRect(x + 3, 19 - bounce, 3, 13);
    if (face < -.3) { ctx.fillStyle = '#586552'; ctx.fillRect(x - 5, 20 - bounce, 10, 11); ctx.fillStyle = '#303f36'; ctx.fillRect(x - 2, 21 - bounce, 1, 10); }
    for (const s of [-1, 1]) {
      const swing = -s * sway * 3, arm = [x + s * 6, 21 - bounce], elbow = [x + s * 8 + side, 28 + swing - bounce], hand = [x + s * 7 + side * 2, 33 + swing - bounce];
      stroke(arm, elbow, s < 0 ? '#30433c' : '#607060', 4); stroke(elbow, hand, '#536150', 3); ctx.fillStyle = '#baad8a'; ctx.fillRect(hand[0] - 1, hand[1] - 1, 3, 3);
    }
    ctx.fillStyle = '#bcb18e'; ctx.fillRect(x - 2, 15 - bounce, 4, 5);
    ctx.fillStyle = '#c9b691'; ctx.beginPath(); ctx.ellipse(x + side, 12 - bounce, 4.3, 5.7, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#51463a'; ctx.beginPath(); ctx.ellipse(x, 9 - bounce, 5, 4, -.2, 0, Math.PI * 2); ctx.fill();
    if (face < 0) { ctx.fillStyle = '#4f4437'; ctx.fillRect(x - 4, 10 - bounce, 8, 7); }
    else { ctx.fillStyle = '#594b38'; ctx.fillRect(x - 5, 9 - bounce, 2, 7); ctx.fillStyle = '#423f32'; ctx.fillRect(x + 2 + side, 12 - bounce, 1, 1); }
    stroke([x - 3, 10 - bounce], [x - 6 + sway * .5, 19 - bounce], '#544735', 3);
    return c;
  }));
}

export function renderWorld(ctx, scene, camera, actor, frames, options) {
  const { width, height, time, overview, path } = options;
  const light = options.lighting;
  const lampContext = beginLampLight(width, height, camera, light);
  const inBar=insideBar(actor.x,actor.y)&&!overview;
  ctx.fillStyle = '#536152'; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.translate(width / 2 - camera.x * camera.zoom, height / 2 - camera.y * camera.zoom); ctx.scale(camera.zoom, camera.zoom);
  const visible = s => s.x + s.w > camera.x - width / camera.zoom / 2 && s.x < camera.x + width / camera.zoom / 2 && s.y + s.h > camera.y - height / camera.zoom / 2 && s.y < camera.y + height / camera.zoom / 2;
  ctx.drawImage(scene.ground.image, scene.ground.x, scene.ground.y,scene.ground.w,scene.ground.h);
  drawSunShadows(ctx, scene, light, actor, inBar);
  if(inBar)ctx.drawImage(scene.bar.floor.image,scene.bar.floor.x,scene.bar.floor.y);
  if(inBar)occludeLampLight(lampContext,scene.bar.floor.image,scene.bar.floor.x,scene.bar.floor.y);
  const foot = P(actor.x, actor.y);
  // Shadows lie on the ground; the actual character is sorted into the scene.
  ctx.fillStyle = '#172e2850'; ctx.beginPath(); ctx.ellipse(foot.x, foot.y, 7, 3, -.18, 0, Math.PI * 2); ctx.fill();
  if (path?.length) {
    const dest = path.at(-1), target = P(dest.x, dest.y), pulse = Math.sin(time * 4) * 2;
    ctx.strokeStyle = '#e5d89c99'; ctx.lineWidth = 1 / camera.zoom; ctx.beginPath(); ctx.ellipse(target.x, target.y, 8 + pulse, 4 + pulse * .5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ebd695'; ctx.fillRect(target.x - 1.5, target.y - 1.5, 3, 3);
  }
  const sprites=inBar?[...scene.sprites.filter(s=>s.label!==BAR.buildingId),...scene.bar.sprites]:scene.sprites;
  const renderables = sprites.filter(visible).map(s => ({ depth: s.depth, sprite: s }));
  renderables.push({ depth: foot.y, player: true }); renderables.sort((a, b) => a.depth - b.depth);
  for (const entry of renderables) {
    if (entry.player) {
      const direction = actor.direction, frame = actor.moving ? Math.floor(actor.walkCycle) % 8 : 0;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(frames[direction][frame], Math.round(foot.x - 19), Math.round(foot.y - 48));
      occludeLampLight(lampContext, frames[direction][frame], Math.round(foot.x - 19), Math.round(foot.y - 48));
      if (overview) { ctx.strokeStyle = '#e7cb7c'; ctx.lineWidth = 2 / camera.zoom; ctx.beginPath(); ctx.arc(foot.x, foot.y - 14, 12 / camera.zoom, 0, Math.PI * 2); ctx.stroke(); }
    } else {
      const s = entry.sprite;
      // A foreground canopy/facade fades only while it actually covers the actor.
      const occludes = s.depth > foot.y + 3 && foot.x > s.x + 8 && foot.x < s.x + s.w - 8 && foot.y - 30 > s.y && foot.y < s.y + s.h;
      ctx.globalAlpha = (s.opacity ?? 1) * (occludes && !overview && !s.noFade ? .55 : 1);
      ctx.drawImage(s.image, s.x, s.y);
      occludeLampLight(lampContext, s.image, s.x, s.y, ctx.globalAlpha);
      if(lampContext && s.windowLight) {
        lampContext.save();lampContext.globalAlpha=ctx.globalAlpha;
        lampContext.drawImage(s.windowLight,s.x,s.y);lampContext.restore();
      }
      drawLampBulbs(lampContext, s.pole);
      ctx.globalAlpha = 1;
    }
  }
  ctx.globalAlpha = .75; ctx.drawImage(scene.wires.image, scene.wires.x, scene.wires.y,scene.wires.w,scene.wires.h); ctx.globalAlpha = 1;
  if (!overview) {
    ctx.fillStyle = '#e8dfae65';
    for (const mote of scene.particles) { const p = P(mote.x + Math.sin(time * mote.speed + mote.phase) * 10, mote.y + Math.cos(time * .5 + mote.phase) * 7, mote.z); ctx.fillRect(p.x, p.y, 1.1, 1.1); }
  }
  finishLighting(ctx, width, height, light, lampContext);
  if (overview) {
    ctx.textAlign = 'center'; ctx.font = `${11 / camera.zoom}px Georgia`; ctx.fillStyle = '#f0e5c1'; ctx.shadowColor = '#14271e'; ctx.shadowBlur = 5;
    const labels = [], lineHeight = 15 / camera.zoom;
    for (const [x, y, label] of [[350, 330, 'PRAÇA DO CINEMA'], [0, 1180, 'RUA SIMEÃO DE MACEDO'], [0,3400,'SIMEÃO · CONTINUAÇÃO'],[80,SIMEAO_END,'R. HENRIQUE FIGUEIREDO'],[950,1250,'R. ANTÔNIO ALEXANDRE'],[680,-105,'R. VINTE E OITO DE JULHO'], [850, CROSS_Y, 'R. CÔNEGO MENDONÇA'],[CHURCH_PLAZA.x+CHURCH_PLAZA.w/2,CHURCH_PLAZA.y+CHURCH_PLAZA.h*.55,'PRAÇA DA IGREJA']]) {
      const p = P(x, y), halfWidth = ctx.measureText(label).width / 2 + 4 / camera.zoom;
      let baseline = p.y - 17 / camera.zoom;
      while (labels.some(other => Math.abs(p.x - other.x) < halfWidth + other.halfWidth && Math.abs(baseline - other.baseline) < lineHeight)) baseline -= lineHeight;
      labels.push({x:p.x, halfWidth, baseline});
      ctx.fillText(label, p.x, baseline);
    }
    ctx.shadowBlur = 0;
  }
  ctx.restore();
  // Restrained warm grading, matching sun-bleached Brazilian plaster and tile.
  ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = '#c8ac6730'; ctx.fillRect(0, 0, width, height); ctx.globalCompositeOperation = 'source-over';
}
