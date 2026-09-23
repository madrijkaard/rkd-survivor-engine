export const WALK_SPEED = 67;
export const RUN_SPEED = 100;

export function createClickNavigation() {
  let previous = null;
  return {
    reset() { previous = null; },
    select(pointer, destinationAtPointer) {
      const interval = previous ? pointer.time - previous.time : Infinity;
      const running = !!previous && interval >= 0 && interval <= 350
        && pointer.source === previous.source && pointer.type === previous.type
        && Math.hypot(pointer.x - previous.x, pointer.y - previous.y) <= 12;
      // The camera may already be moving (or leaving the overview) on click two.
      // Keep the first world destination instead of projecting those pixels again.
      const destination = running ? previous.destination : destinationAtPointer();
      previous = running ? null : { ...pointer, destination: { ...destination } };
      return { destination, running };
    }
  };
}
