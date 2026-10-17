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
 * Build a multiple-choice question from a lookup table. The prompt is the
 * entry's value (a signal) and the answer is its key (the character).
 *
 * @param {{ data: Record<string, unknown>, optionCount?: number }} config
 * @returns {{ key: string, prompt: unknown, answer: string, options: string[] }}
 */
export function createChoiceQuestion(config) {
  const entries = Object.entries(config.data);
  const optionCount = config.optionCount || 4;

  if (entries.length < optionCount) {
    throw new Error("Không đủ dữ liệu để tạo câu hỏi.");
  }

  const [key, prompt] = entries[Math.floor(Math.random() * entries.length)];
  const distractors = entries.filter((entry) => entry[0] !== key).map((entry) => entry[0]);

  return {
    key,
    prompt,
    answer: key,
    options: shuffle([key].concat(shuffle(distractors).slice(0, optionCount - 1)))
  };
}

/**
 * Keep answer comparison strict so object prompts, strings, and future value
 * types do not accidentally coerce into a correct result.
 */
export function isCorrectAnswer(question, answer) {
  return question.answer === answer;
}
