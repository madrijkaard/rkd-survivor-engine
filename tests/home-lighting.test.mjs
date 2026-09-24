import test from 'node:test';
import assert from 'node:assert/strict';
import { buildings } from '../src/world.js';
import { hasHomeWindows, selectLitHomes } from '../src/home-lighting.js';

test('70% of homes with existing windows stay selected across camera/catalog order', () => {
  const eligible = buildings.filter(hasHomeWindows);
  const selected = selectLitHomes(buildings);
  assert.equal(eligible.length, 28);
  assert.equal(selected.size, Math.round(eligible.length * .7));
  assert.deepEqual(selectLitHomes([...buildings].reverse()), selected);
  assert.deepEqual(selectLitHomes([...buildings, ...buildings]), selected);
  assert.ok([...selected].every(id => eligible.some(b => b.id === id)));
});

test('only residential window openings qualify, including transverse homes', () => {
  for (const id of ['w04-fachada-rosa-antiga', 'cinema', 'w15-fc-motos-yamaha',
    'e07-clinica-recuada', 'cm-final-clinica', 'aa-school-classrooms', 'corner-shop']) {
    assert.equal(hasHomeWindows(buildings.find(b => b.id === id)), false, id);
  }
  assert.equal(hasHomeWindows(buildings.find(b => b.id === 'cm-n05-sobrado-branco')), true);
  assert.equal(hasHomeWindows({id:'home',openings:[],backFacade:{openings:[{kind:'window'}]}}), true);
  assert.equal(hasHomeWindows({id:'home',openings:[{kind:'door',glass:true}]}), false);
  assert.equal(hasHomeWindows({id:'school',residential:false,openings:[{kind:'window'}]}), false);
});
