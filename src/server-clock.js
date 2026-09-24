// Use the server's wall clock and timezone; the browser supplies elapsed time only.
export function createServerClock({ fetchTime = fetch, monotonicNow = () => performance.now() } = {}) {
  let sample = null;
  let pending = null;

  async function requestTime() {
    const started = monotonicNow();
    const response = await fetchTime(new URL('../api/time', import.meta.url), {
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Não foi possível consultar o horário do servidor (${response.status}). Reinicie npm start.`);
    const data = await response.json();
    const received = monotonicNow();
    if (!Number.isFinite(data.timestamp) || !Number.isFinite(data.timezoneOffsetMinutes) ||
        Math.abs(data.timezoneOffsetMinutes) > 14 * 60) {
      throw new Error('Horário inválido recebido do servidor.');
    }
    sample = {
      timestamp: data.timestamp + (received - started) / 2,
      offset: data.timezoneOffsetMinutes * 60000,
      received,
    };
  }

  return {
    sync() {
      // Focus/visibility and interval events may happen together.
      pending ||= requestTime().finally(() => { pending = null; });
      return pending;
    },
    minutes() {
      if (!sample) throw new Error('O relógio ainda não foi sincronizado com o servidor.');
      const localTime = sample.timestamp + monotonicNow() - sample.received - sample.offset;
      return ((localTime % 86400000) + 86400000) % 86400000 / 60000;
    },
  };
}
