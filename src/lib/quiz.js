/**
 * Return a shuffled copy without mutating the source list.
 *
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
export function shuffle(items) {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];

    result[index] = result[randomIndex];
    result[randomIndex] = current;
  }

  return result;
}

/**
 * Build a multiple-choice question from a lookup table.
 *
 * `value-to-key` asks users to identify a character from a signal. `key-to-value`
 * reverses that direction and is useful for showing a character prompt.
 *
 * @param {{ data: Record<string, unknown>, optionCount?: number, direction?: "value-to-key" | "key-to-value" }} config
 * @returns {{ key: string, prompt: unknown, answer: unknown, options: unknown[] }}
 */
export function createChoiceQuestion(config) {
  const entries = Object.entries(config.data);
  const optionCount = config.optionCount || 4;
  const direction = config.direction || "value-to-key";

  if (entries.length < optionCount) {
    throw new Error("Không đủ dữ liệu để tạo quiz.");
  }

  const correctIndex = Math.floor(Math.random() * entries.length);
  const correctEntry = entries[correctIndex];
  const [key, value] = correctEntry;
  const isKeyToValue = direction === "key-to-value";
  const answer = isKeyToValue ? value : key;
  const prompt = isKeyToValue ? key : value;
  const distractors = entries
    .filter((entry) => entry[0] !== key)
    .map((entry) => (isKeyToValue ? entry[1] : entry[0]));

  return {
    key,
    prompt,
    answer,
    options: shuffle([answer].concat(shuffle(distractors).slice(0, optionCount - 1)))
  };
}

/**
 * Keep answer comparison strict so object prompts, strings, and future value
 * types do not accidentally coerce into a correct result.
 */
export function isCorrectAnswer(question, answer) {
  return question.answer === answer;
}
