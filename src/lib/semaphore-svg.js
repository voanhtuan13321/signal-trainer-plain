const CENTER = { x: 100, y: 106 };
const SHOULDERS = { left: { x: 94, y: 62 }, right: { x: 106, y: 62 } };
const ARM_LENGTH = 59;

function vectorFor(side, direction) {
  const across = direction.startsWith("across");
  const outward = side === "left" ? -1 : 1;
  const base = direction.endsWith("high") ? "high" : direction.endsWith("low") ? "low" : direction;
  const vectors = {
    up: [0, -1],
    down: [0, 1],
    out: [outward, 0],
    high: [outward * 0.707, -0.707],
    low: [outward * 0.707, 0.707]
  };
  const vector = vectors[base];
  return [across ? -vector[0] : vector[0], vector[1]];
}

function armEnd(side, direction) {
  const [x, y] = vectorFor(side, direction);
  const shoulder = SHOULDERS[side];
  return { x: shoulder.x + x * ARM_LENGTH, y: shoulder.y + y * ARM_LENGTH };
}

function renderFlag(end, side, direction) {
  const [x, y] = vectorFor(side, direction);
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return `<g transform="translate(${end.x} ${end.y}) rotate(${angle})"><line class="semaphore-svg__pole" x1="0" y1="0" x2="8" y2="0"/><path class="semaphore-svg__flag semaphore-svg__flag--red" d="M 8 -14 H 36 L 8 14 Z"/><path class="semaphore-svg__flag semaphore-svg__flag--yellow" d="M 8 14 L 36 -14 V 14 Z"/><path class="semaphore-svg__flag-outline" d="M 8 -14 H 36 V 14 H 8 Z"/></g>`;
}

export function renderSemaphoreSvg(character, poses) {
  const pose = poses[character];
  if (!pose) return "";
  // Semaphore charts describe the signaller's perspective. The learner sees
  // the person from the front, so mirror the two hands for the displayed pose.
  const left = armEnd("left", pose[1]);
  const right = armEnd("right", pose[0]);
  return `<svg class="semaphore-svg" viewBox="0 -20 200 220" role="img" aria-label="Semaphore ${character}" xmlns="http://www.w3.org/2000/svg"><circle class="semaphore-svg__head" cx="${CENTER.x}" cy="32" r="12"/><path class="semaphore-svg__body" d="M ${CENTER.x} 44 V ${CENTER.y} M ${SHOULDERS.left.x} ${SHOULDERS.left.y} L ${left.x} ${left.y} M ${SHOULDERS.right.x} ${SHOULDERS.right.y} L ${right.x} ${right.y} M ${CENTER.x} ${CENTER.y} L 76 174 M ${CENTER.x} ${CENTER.y} L 124 174"/>${renderFlag(left, "left", pose[1])}${renderFlag(right, "right", pose[0])}</svg>`;
}
