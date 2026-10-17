import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const FILES = ["base", "layout", "components", "animations"];
const css = Object.fromEntries(
  await Promise.all(FILES.map(async (name) => [name, await readFile(new URL(`../styles/${name}.css`, import.meta.url), "utf8")]))
);
const all = Object.values(css).join("\n");

test("pixel style: no rounded corners and no real borders", () => {
  for (const [, value] of all.matchAll(/border-radius:\s*([^;]+);/g)) {
    assert.match(value.trim(), /^0(px)?$/, `border-radius must be 0, got ${value}`);
  }
  // The only real border is the scrollbar thumb in base.css; edges use box-shadow.
  const borders = [...all.matchAll(/^\s*border:\s*([^;]+);/gm)].map((m) => m[1].trim());
  assert.deepEqual(borders.filter((value) => value !== "0" && value !== "none"), ["4px solid var(--ink)"]);
});

test("mobile nav extends below the viewport so content never shows through", () => {
  const nav = css.components.match(/\.nav\s*\{[^}]*\}/)[0];
  assert.match(nav, /position:\s*fixed/);
  assert.match(nav, /box-shadow:[^;]*0\s+\d+px\s+0\s+0\s+var\(--ink\)/);
});

test("callout matches the visible width of cards", () => {
  assert.match(css.components, /\.callout\s*\{[^}]*margin-inline:\s*calc\(var\(--px\)\s*\*\s*-1\)/);
  assert.match(css.components, /\.callout \+ \.grid\s*\{\s*margin-top/);
});

test("compact Morse blocks in reference cards are white", () => {
  assert.match(css.components, /\.morse-signal--small \.morse-dash\s*\{\s*background:\s*var\(--text\)/);
});

/* ---- WCAG contrast for the colour pairs that carry text ---- */

function tokens() {
  const map = {};
  for (const [, name, value] of css.base.match(/:root\s*\{[^}]*\}/)[0].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6}|var\(--[\w-]+\))/gi)) {
    map[name] = value;
  }
  const resolve = (name) => {
    const value = map[name];
    return value.startsWith("var(") ? resolve(value.slice(6, -1)) : value;
  };
  return resolve;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("text colour pairs meet WCAG AA (4.5:1)", () => {
  const color = tokens();
  const pairs = [
    ["text", "bg"], ["text", "surface"], ["text", "surface-2"],
    ["muted", "bg"], ["muted", "surface"], ["muted", "surface-2"],
    ["ink", "accent"], ["ink", "primary"], ["primary-text", "bg"], ["primary-text", "surface"],
    ["accent", "bg"], ["accent", "surface"]
  ];
  for (const [fg, bgName] of pairs) {
    const ratio = contrast(color(fg), color(bgName));
    assert.ok(ratio >= 4.5, `${fg} on ${bgName} is ${ratio.toFixed(2)}:1`);
  }
});
