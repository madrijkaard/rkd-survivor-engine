import test from 'node:test';
import assert from 'node:assert/strict';
import { BAR, insideBar } from '../src/bar-layout.js';
import { findPath, clearLine, walkable, moveActor } from '../src/world.js';

function follow(start,destination){
  const path=findPath(start,destination);assert.ok(path?.length,'Destino deve ser acessível');
  const actor={...start};
  for(const waypoint of path){
    assert.ok(clearLine(actor,waypoint),'O trajeto não deve cortar mesas ou paredes');
    while(Math.hypot(actor.x-waypoint.x,actor.y-waypoint.y)>.1){
      const dx=waypoint.x-actor.x,dy=waypoint.y-actor.y,d=Math.hypot(dx,dy),step=Math.min(2,d);
      assert.ok(moveActor(actor,dx/d*step,dy/d*step),'O movimento deve avançar ao longo do caminho');
    }
  }
  return actor;
}
test('é possível entrar no bar pela rua, contornar as mesas, chegar ao balcão e sair',()=>{
  const actor=follow({x:0,y:1960},BAR.entry);assert.ok(insideBar(actor.x,actor.y));
  const customer=follow(actor,BAR.talkSpot);
  assert.ok(Math.hypot(customer.x-BAR.owner.x,customer.y-BAR.owner.y)<55);
  const outside=follow(customer,BAR.exit);assert.equal(insideBar(outside.x,outside.y),false);
});
test('as duas portas abertas são transitáveis; o resto da fachada impede a passagem',()=>{
  for(const d of BAR.doors){const y=d.y+d.w/2;assert.ok(clearLine({x:-70,y},{x:-105,y}));}
  assert.equal(clearLine({x:-70,y:1960},{x:-105,y:1960}),false);
  assert.equal(walkable(-83,1960),false);
});
test('mesas, balcão e Péricles não podem ser atravessados',()=>{
  for(const table of BAR.tables)assert.equal(walkable(table.x+table.w/2,table.y+table.h/2),false);
  assert.equal(findPath(BAR.entry,BAR.owner),null);
  const actor={...BAR.talkSpot};moveActor(actor,0,100);
  assert.ok(actor.y<=BAR.counter.y-5,'O cliente permanece do lado de fora do balcão');
});
