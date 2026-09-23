import test from 'node:test';
import assert from 'node:assert/strict';
import { createClickNavigation, RUN_SPEED } from '../src/click-navigation.js';
import { findPath, moveActor, walkable } from '../src/world.js';
import { BAR } from '../src/bar-layout.js';

const pointer = { x: 200, y: 300, time: 1000, source: 'scene', type: 'mouse' };

test('primeiro clique caminha imediatamente; segundo corre ao mesmo destino apesar da câmera', () => {
  const clicks = createClickNavigation(), destination = { x: 0, y: 280 };
  assert.deepEqual(clicks.select(pointer, () => destination), { destination, running: false });
  const second = clicks.select({ ...pointer, x: 204, time: 1200 }, () => {
    assert.fail('O segundo clique não pode recalcular o destino com a câmera em movimento');
  });
  assert.deepEqual(second, { destination, running: true });
  const next = { x: 0, y: 140 };
  assert.deepEqual(clicks.select({ ...pointer, time: 1300 }, () => next), { destination: next, running: false });
});

test('cliques lentos, distantes ou em superfícies diferentes continuam sendo caminhada', () => {
  for (const changes of [{ time: 1500 }, { x: 250 }, { source: 'minimap' }, { type: 'touch' }]) {
    const clicks = createClickNavigation();
    clicks.select(pointer, () => ({ x: 0, y: 280 }));
    const next = { x: 10, y: 420 };
    assert.deepEqual(clicks.select({ ...pointer, time: 1100, ...changes }, () => next), { destination: next, running: false });
  }
});

test('interromper o gesto impede corrida acidental; duplo toque também funciona', () => {
  const clicks = createClickNavigation(), destination = { x: 0, y: 280 };
  clicks.select(pointer, () => destination);
  clicks.reset();
  assert.equal(clicks.select({ ...pointer, time: 1100 }, () => destination).running, false);
  clicks.reset();
  clicks.select({ ...pointer, type: 'touch' }, () => destination);
  assert.equal(clicks.select({ ...pointer, type: 'touch', time: 1200 }, () => destination).running, true);
});

test('passos de corrida no limite de duração do frame contornam mesas e atravessam portas', () => {
  const actor = { x: 0, y: 1960 };
  for (const destination of [BAR.entry, BAR.talkSpot, BAR.exit]) {
    const route = findPath(actor, destination);
    assert.ok(route?.length);
    for (const next of route) {
      let frames = 0;
      while (Math.hypot(next.x - actor.x, next.y - actor.y) > 1e-6) {
        assert.ok(++frames < 1000, 'Não pode ficar preso num obstáculo');
        const dx = next.x - actor.x, dy = next.y - actor.y, distance = Math.hypot(dx, dy);
        const step = Math.min(distance, RUN_SPEED * .05);
        assert.ok(moveActor(actor, dx / distance * step, dy / distance * step));
        assert.ok(walkable(actor.x, actor.y));
      }
    }
    assert.ok(Math.hypot(actor.x - destination.x, actor.y - destination.y) < 1e-6, 'Para no destino sem ultrapassá-lo');
  }
});
