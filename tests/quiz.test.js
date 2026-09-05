import test from "node:test";
import assert from "node:assert/strict";
import { createChoiceQuestion, isCorrectAnswer, shuffle } from "../src/lib/quiz.js";

test("shuffle returns a copy without mutating source", () => {
  const source = ["A", "B", "C"];
  const result = shuffle(source);

  assert.notStrictEqual(result, source);
  assert.deepEqual([...result].sort(), source.sort());
});

test("createChoiceQuestion returns one correct answer and unique options", () => {
  const question = createChoiceQuestion({ data: { A: ".-", B: "-...", C: "-.-.", D: "-.." } });

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.ok(question.options.includes(question.answer));
  assert.equal(isCorrectAnswer(question, question.answer), true);
  assert.equal(isCorrectAnswer(question, "?"), false);
});
