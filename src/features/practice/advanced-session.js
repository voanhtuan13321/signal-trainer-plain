const INITIAL_TIME_LIMIT_MS = 4000;
const TIME_REDUCTION_MS = 150;
const MIN_TIME_LIMIT_MS = 700;

export function getAdvancedTimeLimit(correctCount) {
  return Math.max(MIN_TIME_LIMIT_MS, INITIAL_TIME_LIMIT_MS - correctCount * TIME_REDUCTION_MS);
}
