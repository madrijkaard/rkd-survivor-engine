import { PERSON_WIDTH } from './road-dimensions.js';

// Clockwise screen directions, starting toward the viewer. World movement
// must be projected through the active camera before selecting a pose.
export function directionFromScreen(x, y, previous = 4) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || (!x && !y)) return previous;
  return (Math.round(Math.atan2(x, y) / (Math.PI / 4)) + 8) % 8;
}

export function createActorFrames() {
  return { walk: createGait(false), run: createGait(true) };
}

function createGait(running) {
  return Array.from({ length: 8 }, (_, direction) =>
    Array.from({ length: 8 }, (_, frame) => drawPose(direction, frame, running)));
}

function drawPose(direction, frame, running) {
  const canvas = document.createElement('canvas');
  canvas.width = 38; canvas.height = 54;
  const ctx = canvas.getContext('2d');
  const angle = direction * Math.PI / 4;
  const side = Math.sin(angle), face = Math.cos(angle), front = face > .3, back = face < -.3;
  const sway = Math.sin(frame * Math.PI / 4), bounce = Math.abs(sway) * (running ? 2 : .9);
  const strideLength = running ? 8 : 5;
  const flight = running ? Math.max(0, Math.abs(sway) - .35) * 3 : 0;
  // Body-local lateral and forward axes also determine limb overlap.
  const point = (lateral, forward, height) => [
    19 + lateral * face + forward * side,
    48 - height - lateral * side * .32 + forward * face * .4,
  ];
  const stroke = (a, b, color, width) => {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
  };
  const ellipse = (x, y, rx, ry, color) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  };
  ctx.translate(19, 0); ctx.scale(PERSON_WIDTH / 20, 1); ctx.translate(-19, 0);
  const limbs = [-1, 1].sort((a, b) => point(a * 3, 0, 0)[1] - point(b * 3, 0, 0)[1]);
  for (const s of limbs) {
    const stride = sway * s, lift = Math.max(0, -stride) * (running ? 9 : 3);
    const hip = point(s * 3, 0, 17 + bounce);
    const knee = point(s * 3, stride * strideLength * .55, 9 + bounce + lift * .55);
    const boot = point(s * 3, stride * strideLength, flight + lift);
    stroke(hip, knee, s === limbs[0] ? '#465e68' : '#6b8386', 5);
    stroke(knee, boot, '#405861', 4);
    stroke(boot, [boot[0] + side * 3, boot[1] + face * 1.5], '#26322f', 4);
  }
  ctx.save();
  if (running) ctx.transform(1, 0, -side * .12, 1, side * 48 * .12, face * 1.5);
  const arm = s => {
    const swing = -s * sway;
    const shoulder = point(s * 6, 0, 27 + bounce);
    const elbow = point(s * 7, swing * (running ? 5 : 2), 20 + bounce);
    const hand = point(s * 6, swing * (running ? 7 : 4) + (running ? 3 : 0), (running ? 22 : 15) + bounce);
    stroke(shoulder, elbow, s === limbs[0] ? '#30433c' : '#607060', 4);
    stroke(elbow, hand, '#536150', 3);
    ellipse(hand[0], hand[1], 1.5, 1.7, '#baad8a');
  };
  arm(limbs[0]);
  const halfWidth = 3.5 + Math.abs(face) * 2.5, top = 19 - bounce;
  ctx.fillStyle = '#394c47'; ctx.beginPath();
  ctx.moveTo(19 - halfWidth, top); ctx.lineTo(19 + halfWidth, top);
  ctx.lineTo(18 + halfWidth, 33 - bounce); ctx.lineTo(20 - halfWidth, 33 - bounce); ctx.fill();
  if (front) {
    ctx.fillStyle = '#716960'; ctx.fillRect(17 + side * 2, top + 1, 4, 11);
    ctx.fillStyle = '#253d37'; ctx.fillRect(16 + side * 2, top, 1, 13);
  }
  // The backpack sits behind the torso in profile and covers its back.
  if (!front) {
    const packX = back ? 19 - side * 1.5 : 19 - side * 4;
    ctx.fillStyle = '#586552'; ctx.fillRect(packX - (back ? 4 : 2), top + 2, back ? 8 : 4, 11);
    ctx.fillStyle = '#303f36'; ctx.fillRect(packX - 1, top + 3, 1, 9);
  }
  arm(limbs[1]);
  ctx.fillStyle = '#bcb18e'; ctx.fillRect(17, 15 - bounce, 4, 5);
  ellipse(19 + side, 12 - bounce, 4.3, 5.7, '#c9b691');
  ellipse(19 - side * .5, 9 - bounce, 5, 4, '#51463a');
  if (back) {
    ellipse(19 - side, 12 - bounce, 4.3, 5, '#4f4437');
    if (Math.abs(side) > .5) {
      ctx.fillStyle = '#bcb18e'; ctx.fillRect(19 + side * 4, 12 - bounce, 1.5, 3);
    }
  } else {
    ctx.fillStyle = '#594b38'; ctx.fillRect(18 - side * 3, 10 - bounce, 2, 5);
    ctx.fillStyle = '#c9b691'; ctx.fillRect(19 + side * 4, 12 - bounce, 2, 2);
    ctx.fillStyle = '#423f32'; ctx.fillRect(19 + side * 3, 11.5 - bounce, 1, 1);
    if (direction === 0) ctx.fillRect(17, 11.5 - bounce, 1, 1);
  }
  const braidX = 19 - side * 4 - (direction === 0 || direction === 4 ? 3 : 0);
  stroke([braidX, 10 - bounce], [braidX - side * 2 + sway * .6, 20 - bounce], '#544735', 3);
  ctx.restore();
  return canvas;
}
