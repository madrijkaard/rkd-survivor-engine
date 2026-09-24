import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createGameServer } from '../server.mjs';
import { createServerClock } from '../src/server-clock.js';
import { lightingAt, formatTime } from '../src/lighting.js';

const response = data => ({ ok: true, json: async () => data });

test('endpoint retorna relógio e fuso do servidor sem cache; mantém GET/HEAD e arquivos estáticos', async t => {
  let timestamp = Date.parse('2026-09-24T02:59:59Z');
  const server = createGameServer({ now: () => ({ getTime: () => timestamp, getTimezoneOffset: () => 180 }) });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const first = await fetch(`${base}/api/time`);
  assert.equal(first.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await first.json(), { timestamp, timezoneOffsetMinutes: 180 });
  timestamp += 1000;
  assert.equal((await (await fetch(`${base}/api/time`)).json()).timestamp, timestamp);
  const head = await fetch(`${base}/api/time`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(`${base}/api/time`, { method: 'POST' })).status, 403);
  assert.match(await (await fetch(base)).text(), /<title>Codó Sobrevive<\/title>/);
});

test('relógio usa fuso do servidor, compensa latência e avança pela meia-noite', async () => {
  let elapsed = 100;
  const clock = createServerClock({
    monotonicNow: () => elapsed,
    fetchTime: async (_url, options) => {
      assert.equal(options.cache, 'no-store');
      elapsed = 500;
      return response({ timestamp: Date.parse('2026-09-24T02:59:59Z'), timezoneOffsetMinutes: 180 });
    },
  });
  await clock.sync();
  assert.ok(Math.abs(clock.minutes() - (1439 + 59.2 / 60)) < 1e-7);
  assert.equal(formatTime(clock.minutes()), '23:59');
  elapsed = 1300;
  assert.equal(clock.minutes(), 0);
  elapsed += 60000;
  assert.equal(formatTime(clock.minutes()), '00:01');
});

test('passagem real dos segundos liga às 18h e desliga às 05h30 sem antecipar a hora', async () => {
  for (const [iso, before, after] of [
    ['2026-09-23T08:29:59Z', true, false],
    ['2026-09-23T20:59:59Z', false, true],
  ]) {
    let elapsed = 0;
    const clock = createServerClock({ monotonicNow: () => elapsed,
      fetchTime: async () => response({ timestamp: Date.parse(iso), timezoneOffsetMinutes: 180 }) });
    await clock.sync();
    assert.equal(lightingAt(clock.minutes()).lampsOn, before);
    elapsed = 999;
    assert.equal(lightingAt(clock.minutes()).lampsOn, before);
    elapsed = 1000;
    assert.equal(lightingAt(clock.minutes()).lampsOn, after);
  }
});

test('falha de sincronização preserva avanço; nova amostra corrige relógio e fuso', async () => {
  let elapsed = 0, fail = false, offset = 180;
  const clock = createServerClock({ monotonicNow: () => elapsed, fetchTime: async () => {
    if (fail) throw new Error('offline');
    return response({ timestamp: Date.parse('2026-09-23T15:00:00Z'), timezoneOffsetMinutes: offset });
  } });
  await clock.sync();
  assert.equal(clock.minutes(), 720);
  fail = true; elapsed = 60000;
  await assert.rejects(clock.sync(), /offline/);
  assert.equal(clock.minutes(), 721);
  elapsed = 120000;
  assert.equal(clock.minutes(), 722);
  fail = false; offset = -330;
  await clock.sync();
  assert.equal(formatTime(clock.minutes()), '20:30');
});

test('sincronizações simultâneas compartilham requisição e resposta inválida não inventa horário', async () => {
  let calls = 0, release;
  const clock = createServerClock({ monotonicNow: () => 0, fetchTime: () => {
    calls++;
    return new Promise(resolve => { release = resolve; });
  } });
  assert.throws(() => clock.minutes(), /não foi sincronizado/);
  const first = clock.sync(), second = clock.sync();
  assert.equal(first, second);
  assert.equal(calls, 1);
  release(response({ timestamp: 'invalid', timezoneOffsetMinutes: 180 }));
  await assert.rejects(first, /inválido/);
  assert.throws(() => clock.minutes(), /não foi sincronizado/);
  const retry = clock.sync();
  release(response({ timestamp: Date.parse('2026-09-23T15:00:00Z'), timezoneOffsetMinutes: 180 }));
  await retry;
  assert.equal(clock.minutes(), 720);
});
