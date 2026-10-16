import { MORSE_LETTERS } from "../../data/morse.js";
import { SEMAPHORE_CODE } from "../../data/semaphore.js";
import { createChoiceQuestion } from "../../lib/quiz.js";

/**
 * Single source of truth for the signal types the app teaches.
 *
 * - `kind`: how a prompt is shown, "text" (the signal string) or "image"
 *   (an SVG keyed by the answer character).
 * - `hasAudio`: whether the prompt can be played as sound.
 */
export const SIGNAL_MODES = [
  { value: "morse", label: "Morse", data: MORSE_LETTERS, kind: "text", hasAudio: true },
  { value: "semaphore", label: "Semaphore", data: SEMAPHORE_CODE, kind: "image", hasAudio: false }
];

export const DEFAULT_MODE = SIGNAL_MODES[0].value;

export function getSignalMode(value) {
  return SIGNAL_MODES.find((mode) => mode.value === value) || SIGNAL_MODES[0];
}

export function createModeQuestion(modeValue) {
  return createChoiceQuestion({ data: getSignalMode(modeValue).data });
}
