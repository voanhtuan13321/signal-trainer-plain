import test from "node:test";
import assert from "node:assert/strict";
import { renderButton } from "../src/components/common/Button.js";
import { renderTabs } from "../src/components/common/Tabs.js";
import { renderVersionBadge } from "../src/components/updates/VersionBadge.js";
import { renderSignalCard } from "../src/components/learn/SignalCard.js";
import { renderQuizOption } from "../src/components/practice/QuizOption.js";
import { renderSemaphoreImage } from "../src/components/common/SemaphoreImage.js";
import { SEMAPHORE_POSES } from "../src/data/semaphore.js";
import { renderSemaphoreSvg } from "../src/lib/semaphore-svg.js";

test("renderButton creates a reusable styled button", () => {
  assert.match(renderButton({ label: "Nghe", className: "button--ghost" }), /button--ghost/);
  assert.match(renderButton({ label: "Nghe" }), />Nghe<\/button>/);
});

test("renderTabs marks the active item and exposes its value", () => {
  const html = renderTabs({ items: [{ value: "morse", label: "Morse" }, { value: "semaphore", label: "Semaphore" }], activeValue: "semaphore" });
  assert.match(html, /data-tab="semaphore"/);
  assert.match(html, /class="tab is-active"/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tab"/);
  assert.match(html, /aria-selected="true"/);
});

test("shared renderers escape interpolated text", () => {
  assert.doesNotMatch(renderButton({ label: "<img>" }), /<img>/);
  assert.match(renderQuizOption({ value: '" onmouseover="bad' }), /data-answer="&quot; onmouseover=&quot;bad"/);
});

test("renderSignalCard composes a signal card", () => {
  const html = renderSignalCard({ character: "A", contentHtml: " .- ", actionsHtml: "Play" });
  assert.match(html, /alphabet-card__letter">A/);
  assert.match(html, /Play/);
});

test("renderQuizOption supports disabled and result states", () => {
  const html = renderQuizOption({ value: "A", disabled: true, result: "correct" });
  assert.match(html, /is-correct/);
  assert.match(html, /disabled/);
});

test("semaphore SVG provides a complete pose for every letter", () => {
  assert.equal(Object.keys(SEMAPHORE_POSES).length, 26);
  for (const character of Object.keys(SEMAPHORE_POSES)) {
    const svg = renderSemaphoreSvg(character, SEMAPHORE_POSES);
    assert.match(svg, /viewBox="0 -20 200 220"/);
    assert.match(svg, /semaphore-svg__flag--yellow/);
    assert.match(svg, /semaphore-svg__flag-outline/);
  }
});

test("SemaphoreImage resolves its data and SVG dependencies from common", () => {
  assert.match(renderSemaphoreImage("A"), /<svg/);
});

test("renderTabs uses idPrefix so two tablists never share ids", () => {
  const items = [{ value: "morse", label: "Morse" }];
  assert.match(renderTabs({ items, activeValue: "morse" }), /id="tab-morse"/);
  assert.match(renderTabs({ items, activeValue: "morse", idPrefix: "start-tab" }), /id="start-tab-morse"/);
});

test("renderButton and renderTabs render attribute objects with escaping", () => {
  const button = renderButton({ label: "Go", attrs: { "data-start": true, hidden: false, title: '"x"' } });
  assert.match(button, /data-start(?!=)/);
  assert.doesNotMatch(button, /hidden/);
  assert.match(button, /title="&quot;x&quot;"/);
  assert.match(renderTabs({ items: [{ value: "a", label: "A" }], activeValue: "a", containerAttrs: { "aria-label": "Chọn" } }), /aria-label="Chọn"/);
});

test("renderSignalCard escapes the character but keeps trusted markup", () => {
  const html = renderSignalCard({ character: "<b>", contentHtml: "<i>ok</i>" });
  assert.match(html, /&lt;b&gt;/);
  assert.match(html, /<i>ok<\/i>/);
});

test("renderVersionBadge escapes release fields", () => {
  const html = renderVersionBadge({ version: "<1>", date: "<d>" });
  assert.doesNotMatch(html, /<1>|<d>/);
});

test("renderQuestionPrompt follows the mode kind", async () => {
  const { renderQuestionPrompt } = await import("../src/components/practice/QuestionPrompt.js");
  assert.equal(renderQuestionPrompt({ mode: "morse", question: { prompt: ".-", key: "A" } }), ".-");
  assert.match(renderQuestionPrompt({ mode: "semaphore", question: { prompt: "x", key: "A" } }), /<svg/);
});

test("every signal mode has a Learn grid renderer", async () => {
  const { readFile } = await import("node:fs/promises");
  const learn = await readFile(new URL("../src/pages/LearnPage.js", import.meta.url), "utf8");
  const { SIGNAL_MODES } = await import("../src/features/signals/modes.js");
  for (const mode of SIGNAL_MODES) assert.match(learn, new RegExp(`${mode.value}: render`));
});
