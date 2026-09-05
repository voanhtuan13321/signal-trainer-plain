import test from "node:test";
import assert from "node:assert/strict";
import { renderButton } from "../src/components/Button.js";
import { renderTabs } from "../src/components/Tabs.js";
import { renderSignalCard } from "../src/components/SignalCard.js";
import { renderQuizOption } from "../src/components/QuizOption.js";

test("renderButton creates a reusable styled button", () => {
  assert.match(renderButton({ label: "Nghe", className: "button--ghost" }), /button--ghost/);
  assert.match(renderButton({ label: "Nghe" }), />Nghe<\/button>/);
});

test("renderTabs marks the active item and exposes its value", () => {
  const html = renderTabs({ items: [{ value: "morse", label: "Morse" }, { value: "semaphore", label: "Semaphore" }], activeValue: "semaphore" });
  assert.match(html, /data-tab="semaphore"/);
  assert.match(html, /class="tab is-active"/);
});

test("renderSignalCard composes a signal card", () => {
  const html = renderSignalCard({ character: "A", content: " .- ", actions: "Play" });
  assert.match(html, /alphabet-card__letter">A/);
  assert.match(html, /Play/);
});

test("renderQuizOption supports disabled and result states", () => {
  const html = renderQuizOption({ value: "A", disabled: true, result: "correct" });
  assert.match(html, /is-correct/);
  assert.match(html, /disabled/);
});
