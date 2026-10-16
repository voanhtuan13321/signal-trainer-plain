import test from "node:test";
import assert from "node:assert/strict";
import { createPracticeSession } from "../src/features/practice/practice-session.js";
import { SIGNAL_MODES, createModeQuestion, getSignalMode } from "../src/features/signals/modes.js";
import { getOptionForKey } from "../src/lib/keyboard.js";

let counter = 0;
const makeSession = () => createPracticeSession({
  createQuestion: (mode) => ({ id: ++counter, mode, answer: "A", options: ["A", "B", "C", "D"] })
});

test("a correct answer is recorded and auto-advance is left to the page", () => {
  const session = makeSession();
  assert.equal(session.answer("A"), "correct");
  assert.deepEqual(session.outcome, { correct: true, answer: "A" });
  assert.equal(session.showNext, false);
  assert.equal(session.resultFor("A"), "correct");
});

test("a wrong answer shows the right one and offers the next button", () => {
  const session = makeSession();
  assert.equal(session.answer("B"), "wrong");
  assert.deepEqual(session.outcome, { correct: false, answer: "A" });
  assert.equal(session.showNext, true);
  assert.equal(session.resultFor("A"), "correct");
  assert.equal(session.resultFor("B"), "wrong");
  assert.equal(session.resultFor("C"), "");
});

test("only the first answer to a question counts", () => {
  const session = makeSession();
  session.answer("B");
  assert.equal(session.answer("A"), "ignored");
  assert.equal(session.correct, false);
});

test("next resets answer state and builds a new question", () => {
  const session = makeSession();
  const first = session.question;
  session.answer("B");
  session.next();
  assert.notEqual(session.question, first);
  assert.equal(session.answered, false);
  assert.equal(session.outcome, null);
  assert.equal(session.resultFor("A"), "");
});

test("setMode changes mode and question, and reports no-ops", () => {
  const session = makeSession();
  assert.equal(session.setMode("morse"), false);
  assert.equal(session.setMode("semaphore"), true);
  assert.equal(session.question.mode, "semaphore");
});

test("signal modes drive questions and audio flags", () => {
  assert.deepEqual(SIGNAL_MODES.map((mode) => mode.value), ["morse", "semaphore"]);
  assert.equal(getSignalMode("morse").hasAudio, true);
  assert.equal(getSignalMode("semaphore").hasAudio, false);
  assert.equal(getSignalMode("morse").kind, "text");
  assert.equal(getSignalMode("semaphore").kind, "image");
  assert.equal(getSignalMode("nope").value, "morse");
  assert.equal(createModeQuestion("semaphore").options.length, 4);
});

test("getOptionForKey maps 1-4 to options and ignores other keys", () => {
  const options = ["A", "B", "C", "D"];
  assert.equal(getOptionForKey({ key: "2" }, options), "B");
  assert.equal(getOptionForKey({ key: "5" }, options), undefined);
  assert.equal(getOptionForKey({ key: "a" }, options), undefined);
  assert.equal(getOptionForKey({ key: "2", repeat: true }, options), undefined);
});
