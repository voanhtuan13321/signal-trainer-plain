/**
 * Canonical Morse lookup used by the reference grid and quiz generator.
 * Digit keys are integer-like, so JS always lists them before letters; use
 * MORSE_ORDER when letters should come first.
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
  9: "----.",
};

/** A subset of the Morse code mapping that includes only letters A-Z. */
export const MORSE_LETTERS = Object.fromEntries(
  Object.entries(MORSE_CODE).filter(([character]) => /^[A-Z]$/.test(character))
);

/** Display order for the reference: letters first, then digits. */
export const MORSE_ORDER = [
  ...Object.keys(MORSE_CODE).filter((character) => /^[A-Z]$/.test(character)),
  ...Object.keys(MORSE_CODE).filter((character) => /^[0-9]$/.test(character))
];
