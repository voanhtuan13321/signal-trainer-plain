/** Characters supported by the Semaphore trainer. */
export const SEMAPHORE_CODE = Object.fromEntries(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((character) => [character, null])
);

export const SEMAPHORE_DIRECTION = Object.freeze({
  UP: "up",
  DOWN: "down",
  OUT: "out",
  HIGH: "high",
  LOW: "low",
  ACROSS_HIGH: "across high",
  ACROSS_LOW: "across low",
});

const { UP, DOWN, OUT, HIGH, LOW, ACROSS_HIGH, ACROSS_LOW } = SEMAPHORE_DIRECTION;

// International flag semaphore poses, expressed as left and right hand
// directions from the signaller's perspective.
export const SEMAPHORE_POSES = {
  A: [DOWN, LOW],
  B: [DOWN, OUT],
  C: [DOWN, HIGH],
  D: [DOWN, UP],
  E: [HIGH, DOWN],
  F: [OUT, DOWN],
  G: [LOW, DOWN],
  H: [ACROSS_LOW, OUT],
  I: [ACROSS_HIGH, LOW],
  J: [OUT, UP],
  K: [UP, LOW],
  L: [HIGH, LOW],
  M: [OUT, LOW],
  N: [LOW, LOW],
  O: [ACROSS_HIGH, OUT],
  P: [UP, OUT],
  Q: [HIGH, OUT],
  R: [OUT, OUT],
  S: [LOW, OUT],
  T: [UP, HIGH],
  U: [HIGH, HIGH],
  V: [LOW, UP],
  W: [OUT, ACROSS_HIGH],
  X: [LOW, ACROSS_HIGH],
  Y: [OUT, HIGH],
  Z: [OUT, ACROSS_LOW],
};
