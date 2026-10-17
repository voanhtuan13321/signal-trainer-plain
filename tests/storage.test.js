import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { loadBest, saveBest } from "../src/services/storage.js";
import { createAdvancedSession } from "../src/features/practice/advanced-session.js";
import { createPracticeSession } from "../src/features/practice/practice-session.js";

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (key) => (key in data ? data[key] : null), setItem: (key, value) => { data[key] = String(value); }, data };
}

test("saveBest and loadBest round-trip under a namespaced key", () => {
  const storage = memoryStorage();
  assert.equal(saveBest("best-practice", 12, storage), true);
  assert.equal(storage.data["signal-trainer:best-practice"], "12");
  assert.equal(loadBest("best-practice", storage), 12);
});

test("loadBest treats missing, corrupt or negative values as zero", () => {
  assert.equal(loadBest("x", memoryStorage()), 0);
  assert.equal(loadBest("x", memoryStorage({ "signal-trainer:x": "abc" })), 0);
  assert.equal(loadBest("x", memoryStorage({ "signal-trainer:x": "-3" })), 0);
  assert.equal(loadBest("x", memoryStorage({ "signal-trainer:x": "2.5" })), 0);
  assert.equal(loadBest("x", null), 0);
});

test("storage failures never throw", () => {
  const broken = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
  assert.equal(loadBest("x", broken), 0);
  assert.equal(saveBest("x", 5, broken), false);
  assert.equal(saveBest("x", 5, null), false);
});

test("sessions start from a stored best score", () => {
  const advanced = createAdvancedSession({ createQuestion: () => ({ answer: "A" }), best: 9 });
  assert.equal(advanced.best, 9);
  advanced.start();
  advanced.answer("A");
  advanced.commitBest();
  assert.equal(advanced.best, 9, "a lower streak must not replace the stored best");
  for (let i = 0; i < 9; i += 1) advanced.answer("A");
  advanced.commitBest();
  assert.equal(advanced.best, 10);

  const practice = createPracticeSession({ createQuestion: () => ({ answer: "A", options: ["A"] }), best: 4 });
  assert.equal(practice.best, 4);
  practice.answer("A");
  assert.equal(practice.best, 4);
});

test("commitBest keeps a streak that was cut short by leaving the page", () => {
  const session = createAdvancedSession({ createQuestion: () => ({ answer: "A" }) });
  session.start();
  session.answer("A");
  session.answer("A");
  session.commitBest();
  assert.equal(session.best, 2);
});

test("fonts are self-hosted: every font file exists and no external font host is used", async () => {
  const css = await readFile(new URL("../styles/fonts.css", import.meta.url), "utf8");
  const files = [...css.matchAll(/url\("\.\/(fonts\/[^"]+)"\)/g)].map((match) => match[1]);
  assert.ok(files.length >= 4);
  for (const file of files) await access(new URL(`../styles/${file}`, import.meta.url));
  await access(new URL("../styles/fonts/LICENSE.md", import.meta.url));

  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/);
  assert.match(html, /styles\/fonts\.css/);
});
