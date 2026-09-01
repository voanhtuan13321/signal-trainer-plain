/**
 * Canonical Morse lookup used by both the reference grid and quiz generator.
 * Values intentionally stay as dot/dash strings so they can be displayed and
 * passed directly to the Web Audio player without an adapter layer.
 */
export const MORSE_CODE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----."
};

/**
 * Practice mode currently trains letters only. Numbers remain in MORSE_CODE
 * for the reference table, but excluding them here keeps answer options compact.
 */
export const MORSE_LETTERS = Object.fromEntries(
  Object.entries(MORSE_CODE).filter(([character]) => /^[A-Z]$/.test(character))
);

/**
 * App metadata is duplicated in the UI so users can verify the deployed build.
 * Keep this in sync with version.json during release prep.
 */
export const APP_META = {
  version: "0.1.0",
  releaseDate: "2026-08-31",
  site: "https://voanhtuan13321.github.io/signal-trainer-plain/"
};

/**
 * Semaphore characters supported by the app.
 *
 * The current UI renders pre-generated PNGs, so arm geometry is intentionally
 * not duplicated in JavaScript.
 */
export const SEMAPHORE_CODE = Object.fromEntries(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((character) => [character, null])
);

/**
 * Image URLs are relative to index.html because native browser modules resolve
 * DOM asset paths from the document, not from the importing JavaScript file.
 */
export const SEMAPHORE_IMAGES = Object.fromEntries(
  Object.keys(SEMAPHORE_CODE).map((character) => [
    character,
    `./public/assets/semaphore/${character}.png`
  ])
);
