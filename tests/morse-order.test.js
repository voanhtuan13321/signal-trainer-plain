import test from "node:test";
import assert from "node:assert/strict";
import { MORSE_CODE, MORSE_ORDER } from "../src/data/morse.js";

test("morse reference lists letters first, then digits, with nothing missing", () => {
  assert.equal(MORSE_ORDER.length, Object.keys(MORSE_CODE).length);
  assert.equal(MORSE_ORDER.length, 36);
  assert.equal(MORSE_ORDER.slice(0, 26).join(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  assert.equal(MORSE_ORDER.slice(26).join(""), "0123456789");
});

test("every mode lists each reference key exactly once, in display order", async () => {
  const { SIGNAL_MODES } = await import("../src/features/signals/modes.js");
  for (const mode of SIGNAL_MODES) {
    assert.deepEqual([...mode.referenceOrder].sort(), Object.keys(mode.referenceData).sort(), mode.value);
    assert.equal(new Set(mode.referenceOrder).size, mode.referenceOrder.length, mode.value);
  }
});
