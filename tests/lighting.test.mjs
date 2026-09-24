import test from 'node:test';
import assert from 'node:assert/strict';
import { lightingAt, shadowPoint, formatTime, poleLamps } from '../src/lighting.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';
import { buildingFootprint } from '../src/building-geometry.js';
import { buildings } from '../src/world.js';

test('postes ligam às 18:00 e desligam exatamente às 05:30, incluindo meia-noite', () => {
  for (const minute of [0, 299, 300, 329, 1080, 1439, 1440]) assert.equal(lightingAt(minute).lampsOn, true);
  for (const minute of [330, 331, 720, 1079]) assert.equal(lightingAt(minute).lampsOn, false);
  assert.equal(formatTime(329), '05:29');
  assert.equal(formatTime(1080), '18:00');
  assert.equal(formatTime(1440), '00:00');
});

test('Sol percorre a diagonal da vista inicial e as sombras apontam no sentido oposto', () => {
  withCameraView(0, () => {
    for (const hour of [7, 9, 15, 17]) {
      const light = lightingAt(hour * 60);
      const sun = project(light.sun.x, light.sun.y);
      const shadow = project(...shadowPoint([0, 0, 100], light));
      assert.ok(sun.x * shadow.x + sun.y * shadow.y < 0);
      assert.equal(sun.x > 0, hour < 12);
      assert.equal(sun.y > 0, hour < 12);
    }
    const length = hour => Math.hypot(...shadowPoint([0, 0, 100], lightingAt(hour * 60)));
    assert.ok(length(7) > length(9));
    assert.ok(length(9) > length(12));
    assert.ok(length(17) > length(15));
    assert.ok(length(12) < 1e-8);
  });
});

test('escurecimento é contínuo e progressivo até a noite; não há sombra solar noturna', () => {
  let previous = 0;
  for (let minute = 900; minute <= 1200; minute++) {
    const state = lightingAt(minute);
    assert.ok(state.darkness >= previous);
    assert.ok(state.darkness - previous < .01);
    previous = state.darkness;
  }
  for (const minute of [0, 299, 300, 359, 360, 1080, 1439]) {
    assert.equal(lightingAt(minute).shadowOpacity, 0);
  }
  for (const minute of [300, 1080]) {
    assert.ok(Math.abs(lightingAt(minute).darkness - lightingAt(minute - .01).darkness) < .001);
  }
  assert.ok(lightingAt(5 * 60).darkness > lightingAt(6 * 60).darkness);
  assert.equal(lightingAt(7 * 60).darkness, 0);
});

test('girar a câmera preserva sombras no mundo e plantas dos lotes inclinados', () => {
  const light = lightingAt(16 * 60);
  const before = JSON.stringify(buildings);
  const b = buildings.find(b => b.footprint);
  const vertex = [...buildingFootprint(b)[0], b.height];
  const point = shadowPoint(vertex, light);
  for (let index = 0; index < CAMERA_VIEWS.length; index++) withCameraView(index, () => {
    const screen = project(...point), recovered = unproject(screen.x, screen.y);
    assert.ok(Math.hypot(recovered.x - point[0], recovered.y - point[1]) < 1e-8);
    const sun = project(light.sun.x, light.sun.y);
    const offset = project(light.shadow.x, light.shadow.y);
    assert.ok(sun.x * offset.x + sun.y * offset.y < 0);
  });
  assert.equal(JSON.stringify(buildings), before);
});

test('lâmpadas acompanham a altura dos postes comuns e os quatro braços da praça', () => {
  const p = { x: 20, y: 30, height: 160 };
  assert.deepEqual(poleLamps(p), [{ x: 38, y: 30, z: 144 }]);
  const lamps = poleLamps({ ...p, lamp: true });
  assert.equal(lamps.length, 4);
  assert.ok(lamps.every(l => l.z === p.height && Math.hypot(l.x - p.x, l.y - p.y) === 13));
});
