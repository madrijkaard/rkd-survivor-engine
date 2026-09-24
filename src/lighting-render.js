import { project } from './projection.js';
import { buildings, trees, cars, benches, planters, poles } from './world.js';
import { buildingFootprint } from './building-geometry.js';
import { CHURCH_TOWER, plazaSeats, plazaStatue } from './mendonca-data.js';
import { antonioShrubs, antonioCacti, antonioBikes } from './antonio-data.js';
import { gardenWall, demolitionLot, brickRecess, flowerShrubs, bins } from './street-data.js';
import { convexHull, shadowPoint, poleLamps } from './lighting.js';
import { CINEMA_PLAZA } from './cinema-plaza.js';

const rectangle = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const circle = (x, y, r) => Array.from({ length: 16 }, (_, i) => {
  const angle = i * Math.PI / 8;
  return [x + Math.cos(angle) * r, y + Math.sin(angle) * r];
});
const volume = (footprint, height, bottom = 0) => footprint.flatMap(([x, y]) => [[x, y, bottom], [x, y, height]]);

// Include trees whose crowns overlap the plaza edge, using the same scale for
// trunk and crown. Only the projected height changes, never the visible object.
const cinemaShadowScale = (p, radius = 0) => {
  const { x, y, w, h } = CINEMA_PLAZA;
  return p.x + radius >= x && p.x - radius <= x + w &&
    p.y + radius >= y && p.y - radius <= y + h ? .7 : 1;
};

// Ground shadow volumes share the world's footprints, including curved lots.
const casters = [
  ...buildings.map(b => volume(buildingFootprint(b), b.height * cinemaShadowScale({ x: b.x + b.depth / 2, y: b.y + b.length / 2 }))),
  volume(rectangle(CHURCH_TOWER.x, CHURCH_TOWER.y, CHURCH_TOWER.w, CHURCH_TOWER.h), 350),
  ...trees.flatMap(t => {
    // Preserve the previous Matriz adjustment; also shorten Cinema plaza trees.
    const height = (t.height || t.size * .8) * (t.plaza ? .7 : cinemaShadowScale(t, t.size * .5));
    return [volume(circle(t.x, t.y, 2.5), height), volume(circle(t.x, t.y, t.size * .5), height, height)];
  }),
  ...cars.map(c => volume(rectangle(c.x - 16, c.y - 32, 32, 64), 25)),
  ...poles.map(p => volume(circle(p.x, p.y, 2), p.height * cinemaShadowScale(p))),
  ...[...benches, ...plazaSeats].map(b => volume(rectangle(b.x, b.y, b.w, b.h), 24 * cinemaShadowScale(b))),
  volume(rectangle(plazaStatue.x, plazaStatue.y, plazaStatue.w, plazaStatue.h), 70),
  ...planters.filter(p => !p.monument).map(p => volume(circle(p.x, p.y, p.r), (p.tiers || 2) * 6 * cinemaShadowScale(p, p.r))),
  ...[...flowerShrubs, ...antonioShrubs].map(p => volume(circle(p.x, p.y, p.r), 22 * cinemaShadowScale(p, p.r))),
  ...antonioCacti.map(p => volume(circle(p.x, p.y, 6), p.height)),
  ...bins.map(p => volume(circle(p.x, p.y, 9), 30)),
  ...[...antonioBikes, { x: 50, y: 2195 }, { x: 55, y: 2217 }].map(p => volume(rectangle(p.x - 5, p.y - 12, 10, 24), 18)),
  volume(rectangle(gardenWall.x, gardenWall.y, 4, gardenWall.length), gardenWall.height + 16),
  ...[demolitionLot, brickRecess].flatMap(p => [
    volume(rectangle(p.x, p.y, p.depth, 3), 50),
    volume(rectangle(p.x, p.y + p.length - 3, p.depth, 3), 50),
  ]),
  volume(rectangle(109, 491, 167, 3), 80),
];

// Preserve the monument's pedestal and cross silhouette instead of a tall box.
for (const p of planters.filter(p => p.monument)) {
  const scale = cinemaShadowScale(p);
  casters.push(volume(rectangle(p.x - 29, p.y - 29, 58, 58), 9 * scale));
  casters.push(volume(rectangle(p.x - 13, p.y - 13, 26, 26), 53 * scale));
  for (const shape of [
    [[-10, 53], [10, 53], [5, 91], [-5, 91]],
    [[-5, 108], [5, 108], [8, 126], [0, 128], [-8, 126]],
    [[-9, 94], [-29, 91], [-32, 102], [-10, 107]],
    [[9, 94], [29, 91], [32, 102], [10, 107]],
    Array.from({ length: 20 }, (_, i) => [Math.cos(i * Math.PI / 10) * 14, 100 + Math.sin(i * Math.PI / 10) * 14]),
  ]) casters.push(shape.flatMap(([x, z]) => [[p.x + x, p.y - 3, z * scale], [p.x + x, p.y + 3, z * scale]]));
}

function appendShadow(path, vertices, light) {
  const points = convexHull(vertices.map(v => shadowPoint(v, light)));
  points.forEach(([x, y], i) => {
    const p = project(x, y);
    if (i === 0) path.moveTo(p.x, p.y); else path.lineTo(p.x, p.y);
  });
  path.closePath();
}

export function drawSunShadows(ctx, scene, light, actor, inBar) {
  if (light.shadowOpacity <= 0) return;
  // Each camera caches only its current hour, never another full-world bitmap.
  if (scene.shadowMinutes !== light.minutes) {
    scene.shadowMinutes = light.minutes;
    scene.sunShadows = new Path2D();
    for (const vertices of casters) appendShadow(scene.sunShadows, vertices, light);
  }
  const path = new Path2D(scene.sunShadows);
  if (!inBar) {
    appendShadow(path, volume(circle(actor.x, actor.y, 4), 33), light);
    appendShadow(path, volume(circle(actor.x, actor.y, 4.5), 43, 38), light);
  }
  ctx.save();
  ctx.fillStyle = `rgba(17, 29, 40, ${light.shadowOpacity})`;
  ctx.fill(path); // Union fill keeps overlapping shadows from becoming black.
  ctx.restore();
}

let glowCanvas;
function glow(ctx, x, y, radius, color, strength) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${color},${strength})`);
  gradient.addColorStop(.35, `rgba(${color},${strength * .55})`);
  gradient.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function beginLampLight(width, height, camera, light) {
  if (!light.lampsOn) return null;
  glowCanvas ||= document.createElement('canvas');
  if (glowCanvas.width !== width || glowCanvas.height !== height) {
    glowCanvas.width = width; glowCanvas.height = height;
  }
  const ctx = glowCanvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.translate(width / 2 - camera.x * camera.zoom, height / 2 - camera.y * camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);
  for (const pole of poles) {
    const center = project(pole.x + (pole.lamp ? 0 : 18), pole.y);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.scale(1, .63);
    glow(ctx, 0, 0, pole.lamp ? 110 : 92, '239, 181, 87', .46);
    ctx.restore();
  }
  return ctx;
}

// Erase street light behind each opaque sprite, in the same depth order as art.
export function occludeLampLight(ctx, image, x, y, opacity = 1) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = opacity;
  ctx.drawImage(image, x, y);
  ctx.restore();
}

export function drawLampBulbs(ctx, pole) {
  if (!ctx || !pole) return;
  for (const lamp of poleLamps(pole)) {
    const p = project(lamp.x, lamp.y, lamp.z);
    glow(ctx, p.x, p.y, 25, '255, 198, 100', .65);
    ctx.fillStyle = '#fff1bd';
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 3.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export function finishLighting(ctx, width, height, light, lampContext) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (light.warmth > 0) {
    ctx.fillStyle = `rgba(221, 116, 45, ${light.warmth})`;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.fillStyle = `rgba(7, 16, 37, ${light.darkness})`;
  ctx.fillRect(0, 0, width, height);
  if (lampContext) {
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(glowCanvas, 0, 0);
  }
  ctx.restore();
}
