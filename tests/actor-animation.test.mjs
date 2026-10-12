import test from 'node:test';
import assert from 'node:assert/strict';
import { directionFromScreen } from '../src/actor-animation.js';
import { CAMERA_VIEWS, withCameraView, project, unproject } from '../src/projection.js';

test('cliques selecionam frente, diagonais, perfis e costas pela direção na tela', () => {
  const vectors = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  for (const [expected, [x,y]] of vectors.entries()) {
    for (const distance of [.01, 1, 500]) assert.equal(directionFromScreen(x * distance, y * distance), expected);
    for (const offset of [-22.4, 22.4]) {
      const angle = (expected * 45 + offset) * Math.PI / 180;
      assert.equal(directionFromScreen(Math.sin(angle), Math.cos(angle)), expected);
    }
  }
});

test('parar ou receber vetor inválido preserva a última orientação', () => {
  for (let previous = 0; previous < 8; previous++) {
    assert.equal(directionFromScreen(0, 0, previous), previous);
    assert.equal(directionFromScreen(NaN, 1, previous), previous);
    assert.equal(directionFromScreen(1, Infinity, previous), previous);
  }
});

test('destino clicado mantém a orientação visual nas quatro câmeras', () => {
  for (let view = 0; view < CAMERA_VIEWS.length; view++) withCameraView(view, () => {
    const start = {x: -1202, y: 800}, origin = project(start.x, start.y);
    for (let expected = 0; expected < 8; expected++) {
      const angle = expected * Math.PI / 4;
      const destination = unproject(origin.x + Math.sin(angle) * 40, origin.y + Math.cos(angle) * 40);
      const movement = project(destination.x - start.x, destination.y - start.y);
      assert.equal(directionFromScreen(movement.x, movement.y), expected);
    }
  });
});
