import { CAMERA_VIEWS } from './projection.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function formatTime(minutes) {
  const value = ((Math.floor(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

// Artistic solar cycle: sunrise 06:00, zenith 12:00, sunset 18:00.
// The diagonal is fixed in world space using the initial camera as reference.
export function lightingAt(minutes) {
  const time = ((minutes % 1440) + 1440) % 1440;
  const hour = time / 60;
  const angle = (hour - 6) / 12 * Math.PI;
  const aboveHorizon = hour > 6 && hour < 18;
  const elevation = aboveHorizon ? Math.sin(angle) : 0;
  const horizontal = aboveHorizon ? Math.cos(angle) : 0;
  const { a, b, c, d } = CAMERA_VIEWS[0];
  const det = a * d - b * c;
  const diagonal = Math.SQRT1_2;
  const east = { x: (d - b) * diagonal / det, y: (a - c) * diagonal / det };
  // Keep the bounded horizon shadows 30% shorter for the artistic scale.
  const length = -.7 * horizontal / Math.max(.25, elevation);
  const daylight = smooth((hour - 5) / 2) * (1 - smooth((hour - 15) / 4));
  return {
    minutes: time,
    lampsOn: hour >= 18 || hour < 5.5,
    darkness: .78 * (1 - daylight),
    warmth: .10 * smooth((hour - 15) / 1.5) * (1 - smooth((hour - 18) / 1.5)),
    shadowOpacity: aboveHorizon ? .29 * smooth(elevation / .18) : 0,
    shadow: { x: east.x * length, y: east.y * length },
    sun: { x: east.x * horizontal, y: east.y * horizontal, z: elevation },
  };
}

export function shadowPoint([x, y, z = 0], light) {
  return [x + light.shadow.x * z, y + light.shadow.y * z];
}

export function convexHull(points) {
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const half = values => {
    const result = [];
    for (const point of values) {
      while (result.length > 1 && cross(result.at(-2), result.at(-1), point) <= 0) result.pop();
      result.push(point);
    }
    return result;
  };
  return [...half(sorted).slice(0, -1), ...half(sorted.slice().reverse()).slice(0, -1)];
}

export function poleLamps(pole) {
  const offsets = pole.lamp ? [[-13, 0], [13, 0], [0, -13], [0, 13]] : [[18, 0]];
  return offsets.map(([dx, dy]) => ({
    x: pole.x + dx, y: pole.y + dy, z: pole.height * (pole.lamp ? 1 : .9),
  }));
}
