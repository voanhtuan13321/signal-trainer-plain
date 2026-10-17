import { MORSE_CODE, MORSE_LETTERS, MORSE_ORDER } from "../../data/morse.js";
import { SEMAPHORE_CODE } from "../../data/semaphore.js";
import { createChoiceQuestion } from "../../lib/quiz.js";

/**
 * Single source of truth for the signal types the app teaches.
 *
 * - `kind`: how a prompt is shown, "text" (the signal string) or "image"
 *   (an SVG keyed by the answer character).
 * - `data`: question pool; `referenceData`: full table shown on the Learn page.
 * - `referenceOrder`: keys of `referenceData` in display order (JS lists
 *   integer-like keys first, so the order is explicit).
 * - `hasAudio`: whether the prompt can be played as sound.
 */
export const SIGNAL_MODES = [
  { value: "morse", label: "Morse", data: MORSE_LETTERS, referenceData: MORSE_CODE, referenceOrder: MORSE_ORDER, kind: "text", hasAudio: true },
  { value: "semaphore", label: "Semaphore", data: SEMAPHORE_CODE, referenceData: SEMAPHORE_CODE, referenceOrder: Object.keys(SEMAPHORE_CODE), kind: "image", hasAudio: false }
];

export const DEFAULT_MODE = SIGNAL_MODES[0].value;

export function getSignalMode(value) {
  return SIGNAL_MODES.find((mode) => mode.value === value) || SIGNAL_MODES[0];
}

export function createModeQuestion(modeValue) {
  return createChoiceQuestion({ data: getSignalMode(modeValue).data });
}
