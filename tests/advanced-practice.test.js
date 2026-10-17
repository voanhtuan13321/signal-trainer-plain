import test from "node:test";
import assert from "node:assert/strict";
import { createAdvancedSession, getAdvancedTimeLimit } from "../src/features/practice/advanced-session.js";

test("advanced practice reduces the time limit and respects the floor", () => {
  assert.equal(getAdvancedTimeLimit(0), 4000);
  assert.equal(getAdvancedTimeLimit(5), 3250);
  assert.equal(getAdvancedTimeLimit(30), 700);
  assert.equal(getAdvancedTimeLimit(100), 700);
});

function makeSession() {
  let clock = 0;
  const session = createAdvancedSession({
    now: () => clock,
    createQuestion: (mode) => ({ mode, answer: "A" })
  });
  return { session, advance: (ms) => { clock += ms; } };
}

test("session needs a dialog until started and ignores answers meanwhile", () => {
  const { session } = makeSession();
  assert.equal(session.needsDialog, true);
  assert.equal(session.answer("A"), "ignored");
  session.start();
  assert.equal(session.needsDialog, false);
});

test("correct answers extend the streak and shrink the limit", () => {
  const { session } = makeSession();
  session.start();
  assert.equal(session.answer("A"), "correct");
  assert.equal(session.correct, 1);
  assert.equal(session.limit, 3850);
});

test("a wrong answer ends the run and records the best streak", () => {
  const { session } = makeSession();
  session.start();
  session.answer("A");
  session.answer("A");
  assert.equal(session.answer("B"), "wrong");
  assert.equal(session.ended, true);
  assert.equal(session.best, 2);
  assert.equal(session.needsDialog, true);
  assert.equal(session.answer("A"), "ignored");
});

test("remaining time counts down from the question start and floors at zero", () => {
  const { session, advance } = makeSession();
  session.start();
  advance(1000);
  assert.equal(session.remaining, 3000);
  advance(10000);
  assert.equal(session.remaining, 0);
});

test("restart returns to the start dialog but keeps the best streak", () => {
  const { session } = makeSession();
  session.start();
  session.answer("A");
  session.answer("B");
  session.restart();
  assert.equal(session.started, false);
  assert.equal(session.correct, 0);
  assert.equal(session.best, 1);
  assert.equal(session.needsDialog, true);
});

test("switching mode mid-run resets the streak, but not before starting", () => {
  const { session } = makeSession();
  session.setMode("semaphore");
  assert.equal(session.question, null);
  session.start();
  session.answer("A");
  session.setMode("morse");
  assert.equal(session.correct, 0);
  assert.equal(session.question.mode, "morse");
});

test("switching mode mid-run keeps the best streak", () => {
  const { session } = makeSession();
  session.start();
  session.answer("A");
  session.answer("A");
  session.setMode("semaphore");
  session.answer("B");
  assert.equal(session.best, 2);
});
