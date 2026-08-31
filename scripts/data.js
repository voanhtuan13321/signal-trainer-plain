(function () {
  "use strict";

  var MORSE_CODE = {
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

  var MORSE_LETTERS = {};
  Object.keys(MORSE_CODE).forEach(function (key) {
    if (/^[A-Z]$/.test(key)) {
      MORSE_LETTERS[key] = MORSE_CODE[key];
    }
  });

  var APP_META = {
    version: "0.1.0",
    releaseDate: "2026-08-31",
    site:
      "https://voanhtuan13321.github.io/signal-trainer-plain/"
  };

  var SEMAPHORE_CODE = {
    A: { left: 225, right: 180 },
    B: { left: 270, right: 180 },
    C: { left: 315, right: 180 },
    D: { left: 0, right: 180 },
    E: { left: 45, right: 225 },
    F: { left: 90, right: 180 },
    G: { left: 135, right: 180 },
    H: { left: 270, right: 90 },
    I: { left: 315, right: 0 },
    J: { left: 90, right: 180 },
    K: { left: 0, right: 225 },
    L: { left: 45, right: 225 },
    M: { left: 45, right: 90 },
    N: { left: 225, right: 135 },
    O: { left: 270, right: 45 },
    P: { left: 0, right: 270 },
    Q: { left: 90, right: 225 },
    R: { left: 270, right: 90 },
    S: { left: 270, right: 135 },
    T: { left: 315, right: 0 },
    U: { left: 315, right: 45 },
    V: { left: 0, right: 135 },
    W: { left: 45, right: 90 },
    X: { left: 45, right: 135 },
    Y: { left: 315, right: 90 },
    Z: { left: 90, right: 135 }
  };

  var SEMAPHORE_IMAGES = {};
  Object.keys(SEMAPHORE_CODE).forEach(function (key) {
    SEMAPHORE_IMAGES[key] =
      "./assets/semaphore/" + key + ".png";
  });

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.data = {
    APP_META: APP_META,
    MORSE_CODE: MORSE_CODE,
    MORSE_LETTERS: MORSE_LETTERS,
    SEMAPHORE_CODE: SEMAPHORE_CODE,
    SEMAPHORE_IMAGES: SEMAPHORE_IMAGES
  };
})();
