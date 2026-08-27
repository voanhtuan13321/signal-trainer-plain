(function () {
  "use strict";

  var audioContext = null;
  var MORSE_WPM = 16;
  var MORSE_FREQUENCY = 650;

  function getMorseUnitMs() {
    return 1200 / MORSE_WPM;
  }

  function ensureAudioContext() {
    var AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return Promise.reject(
        new Error("Trình duyệt không hỗ trợ Web Audio API.")
      );
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      return audioContext.resume();
    }

    return Promise.resolve();
  }

  function beep(durationMs) {
    return new Promise(function (resolve) {
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      var now = audioContext.currentTime;
      var durationSeconds = durationMs / 1000;

      oscillator.type = "sine";
      oscillator.frequency.value = MORSE_FREQUENCY;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      gain.gain.setValueAtTime(
        0.2,
        Math.max(now + 0.01, now + durationSeconds - 0.01)
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + durationSeconds
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + durationSeconds);
      oscillator.addEventListener("ended", resolve, { once: true });
    });
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function playMorseCharacter(code) {
    await ensureAudioContext();

    var symbols = code.split("");
    for (var index = 0; index < symbols.length; index += 1) {
      var durationUnits = symbols[index] === "." ? 1 : 3;

      await beep(durationUnits * getMorseUnitMs());
      if (index < symbols.length - 1) {
        await sleep(getMorseUnitMs());
      }
    }
  }

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.audio = {
    playMorseCharacter: playMorseCharacter
  };
})();
