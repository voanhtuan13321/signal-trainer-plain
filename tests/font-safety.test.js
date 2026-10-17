import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MORSE_CODE } from "../src/data/morse.js";
import { SEMAPHORE_CODE } from "../src/data/semaphore.js";
import { SIGNAL_MODES } from "../src/features/signals/modes.js";
import { renderSignalCard } from "../src/components/learn/SignalCard.js";
import { renderQuizOption } from "../src/components/practice/QuizOption.js";
import { renderScoreboard, padScore } from "../src/components/practice/Scoreboard.js";
import { renderReleaseCard } from "../src/components/updates/ReleaseCard.js";
import { renderHome } from "../src/pages/HomePage.js";
import { parseChangelog } from "../src/lib/changelog.js";

/*
 * "Press Start 2P" has no Vietnamese diacritics. If a character is missing it
 * falls back to VT323 mid-word, which looks misaligned. So text styled with
 * --font-head must stay ASCII; Vietnamese text uses --font-body (VT323).
 */

const ASCII = /^[\x00-\x7F]*$/;

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

/** Visible text of every element whose class list includes `className`. */
function textOfClass(html, className) {
  const pattern = new RegExp(`<(\\w+)[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`, "g");
  return [...html.matchAll(pattern)].map((match) => match[2].replace(/<[^>]+>/g, "").trim());
}

function assertAscii(texts, where) {
  assert.ok(texts.length > 0, `${where}: expected to find text to check`);
  for (const text of texts) {
    assert.match(text, ASCII, `${where}: "${text}" has non-ASCII characters but uses the pixel heading font`);
  }
}

// Selectors allowed to use --font-head. Adding one means promising its text is
// ASCII and adding a rendering check below.
const PIXEL_FONT_SELECTORS = [
  ".alphabet-card__letter",
  ".brand strong",
  ".brand__mark",
  ".chip",
  ".option",
  ".option__key",
  ".path-card .path-card__tag",
  ".quiz-timer__label",
  ".release-card__header time",
  ".scoreboard dd"
];

test("only reviewed selectors use the ASCII-only pixel font", async () => {
  const css = (await Promise.all(["../styles/base.css", "../styles/layout.css", "../styles/components.css", "../styles/animations.css"].map(read))).join("\n");
  const used = [...css.matchAll(/([^{}]+)\{[^{}]*font-family:\s*var\(--font-head\)[^{}]*\}/g)]
    .flatMap((match) => match[1].split(","))
    .map((selector) => selector.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .sort();
  assert.deepEqual(used, [...PIXEL_FONT_SELECTORS].sort(),
    "A selector now uses --font-head. Make sure its text is ASCII, then update PIXEL_FONT_SELECTORS and add a check.");
});

test("signal data keys are ASCII (cards, chips and answers use the pixel font)", () => {
  for (const mode of SIGNAL_MODES) {
    assertAscii(Object.keys(mode.referenceData), `${mode.value} reference keys`);
    assertAscii(Object.keys(mode.data), `${mode.value} question keys`);
  }
});

test("signal cards, answer buttons and key hints render ASCII", () => {
  const characters = [...Object.keys(MORSE_CODE), ...Object.keys(SEMAPHORE_CODE)];
  const cards = characters.map((character) => renderSignalCard({ character, contentHtml: "" })).join("");
  assertAscii(textOfClass(cards, "alphabet-card__letter"), "alphabet-card__letter");

  const options = characters.map((value, index) => renderQuizOption({ value, hint: String((index % 4) + 1) })).join("");
  assertAscii(textOfClass(options, "option"), "option");
  assertAscii(textOfClass(options, "option__key"), "option__key");
});

test("scoreboard values as the pages send them are ASCII", () => {
  const html = renderScoreboard([
    { label: "Chuỗi", value: 7 },
    { label: "Đúng", value: `${padScore(3, 2)}/${padScore(11, 2)}` },
    { label: "Giới hạn", value: `${(3550 / 1000).toFixed(2)}s` }
  ]);
  assertAscii([...html.matchAll(/<dd>([\s\S]*?)<\/dd>/g)].map((match) => match[1]), "scoreboard dd");
});

test("home level tags render ASCII", () => {
  const app = { innerHTML: "" };
  renderHome(app);
  assertAscii(textOfClass(app.innerHTML, "path-card__tag"), "path-card__tag");
});

test("brand name and mark in index.html are ASCII", async () => {
  const html = await read("../index.html");
  assertAscii(textOfClass(html, "brand__mark"), "brand__mark");
  assertAscii([...html.matchAll(/<strong>([^<]*)<\/strong>/g)].map((m) => m[1]).slice(0, 1), "brand strong");
});

test("release dates from the real CHANGELOG render ASCII", async () => {
  const releases = parseChangelog(await read("../CHANGELOG.md"));
  const html = releases.map(renderReleaseCard).join("");
  const dates = [...html.matchAll(/<time[^>]*>([^<]*)<\/time>/g)].map((m) => m[1]);
  assertAscii(dates, "release time");
});

test("the safety check itself catches non-ASCII text", () => {
  assert.throws(() => assertAscii(["Luyện tập"], "sample"), /non-ASCII/);
});
