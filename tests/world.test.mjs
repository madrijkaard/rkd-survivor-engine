import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import { START, points, project, unproject, pointAt, imagePath, walkable, moveActor, findPath, clearLine } from '../src/world.js';
import { CINEMA_PLAZA, CINEMA_MONUMENT } from '../src/cinema-plaza.js';

test('os 31 pontos têm oito fotografias, numeradas em ordem circular', async () => {
  const folders = (await readdir(new URL('../maps/simeao-de-macedo/', import.meta.url))).filter(n => /^ponto-\d+$/.test(n));
  assert.equal(folders.length, 31);
  for (const p of points) for (let direction = 1; direction <= 8; direction++) {
    const file = await stat(new URL(`../${imagePath(p.id, direction)}`, import.meta.url));
    assert.ok(file.size > 1000, `Ponto ${p.id}, imagem ${direction}`);
  }
});
test('a projeção de cliques recupera a posição no chão', () => {
  for (const [x, y] of [[0, 0], [173, 292], [-58, 2100], [0, 2240]]) {
    const p = project(x, y), result = unproject(p.x, p.y);
    assert.ok(Math.abs(result.x - x) < 1e-8 && Math.abs(result.y - y) < 1e-8);
  }
});
test('a rua tem passagem contínua da praça à Henrique Figueiredo, nos 31 pontos', () => {
  assert.ok(walkable(START.x, START.y));
  for (let y = START.y; y <= points.at(-1).y; y += 5) assert.ok(walkable(0, y), `Passagem em ${y}`);
  for (const p of points) assert.equal(pointAt(p.y), p.id);
  assert.equal(pointAt(-1000), 1); assert.equal(pointAt(5000), 31);
});
test('paredes, canteiros, carros e limites impedem atravessar o cenário', () => {
  for (const p of [[126, 26], [-49, 140], [120, 800], [-140, 1700], [600, 100]]) assert.equal(walkable(...p), false);
  const actor = { x: 0, y: 800 }; moveActor(actor, 500, 0);
  assert.ok(actor.x < 76); assert.ok(walkable(actor.x, actor.y));
  const towardCar = { x: -49, y: 30 }; moveActor(towardCar, 0, 180);
  assert.ok(towardCar.y < 108, 'Subpassos impedem atravessar o carro');
});
test('o trajeto por clique contorna o canteiro e mantém todos os segmentos transitáveis', () => {
  // Continue past the planter to paving, outside the relocated monument base.
  const start = { x: 74, y: 26 }, destination = { x: 185, y: 80 };
  assert.equal(clearLine(start, destination), false);
  const path = findPath(start, destination); assert.ok(path?.length > 1);
  let position = start;
  for (const node of path) { assert.ok(clearLine(position, node)); position = node; }
  assert.deepEqual(position, destination);
  assert.equal(findPath(START, { x: 126, y: 26 }), null);
});
test('é possível caminhar da praça até a esquina e voltar', () => {
  const target = { x: 0, y: 2240 }, path = findPath(START, target);
  assert.deepEqual(path, [target]);
  const actor = { ...START };
  for (let i = 0; i < 442; i++) moveActor(actor, 0, 5);
  assert.deepEqual(actor, target);
  assert.ok(findPath(actor, START));
});

test('a base inteira do Cruzeiro do Sul fica dentro da praça e libera a rua',()=>{
  const p=CINEMA_MONUMENT,a=CINEMA_PLAZA;
  for(const dx of [-p.r,p.r])for(const dy of [-p.r,p.r]){
    assert.ok(p.x+dx>a.x+10&&p.x+dx<a.x+a.w-10);
    assert.ok(p.y+dy>a.y+10&&p.y+dy<a.y+a.h-10);
    assert.equal(walkable(p.x+dx*.95,p.y+dy*.95),false,'Degraus têm colisão, inclusive nos cantos');
  }
  assert.ok(clearLine({x:280,y:-75},{x:410,y:-75}),'Rua livre diante da praça');
  assert.ok(walkable(319,-36),'Local antigo ficou livre');
  for(const [dx,dy] of [[-40,0],[40,0],[0,-40],[0,40]])assert.ok(findPath(START,{x:p.x+dx,y:p.y+dy}),'Pode circular ao redor do pedestal');
});
