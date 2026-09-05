let audioContext = null;

// 16 WPM keeps training audio clear while still feeling close to real Morse.
const MORSE_WPM = 16;
const MORSE_FREQUENCY = 650;

/**
 * Morse timing standard: one dot is 1200 / WPM milliseconds.
 * Dashes are composed from this unit by the playback loop.
 */
function getMorseUnitMs() {
  return 1200 / MORSE_WPM;
}

/**
 * Browsers require Web Audio to be created/resumed from a user gesture in many
 * cases. This helper centralizes that lifecycle so callers only deal with
 * "play this code" rather than AudioContext state.
 */
function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return Promise.reject(new Error("Trình duyệt không hỗ trợ Web Audio API."));
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    return audioContext.resume();
  }

  return Promise.resolve();
}

/**
 * Play one continuous tone with a tiny gain envelope.
 *
 * @param {number} durationMs Tone length in milliseconds.
 * @returns {Promise<void>} Resolves after the oscillator finishes.
 */
function beep(durationMs) {
  return new Promise((resolve) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const durationSeconds = durationMs / 1000;

    oscillator.type = "sine";
    oscillator.frequency.value = MORSE_FREQUENCY;

    // A short envelope avoids speaker pops when the oscillator starts/stops.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    gain.gain.setValueAtTime(
      0.2,
      Math.max(now + 0.01, now + durationSeconds - 0.01)
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + durationSeconds);
    oscillator.addEventListener("ended", resolve, { once: true });
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Play a single Morse character.
 *
 * @param {string} code Dot/dash sequence such as ".-" or "-...".
 * @returns {Promise<void>} Resolves after all symbols and intra-character gaps.
 */
export async function playMorseCharacter(code) {
  await ensureAudioContext();

  const symbols = code.split("");
  for (let index = 0; index < symbols.length; index += 1) {
    const durationUnits = symbols[index] === "." ? 1 : 3;

    await beep(durationUnits * getMorseUnitMs());
    if (index < symbols.length - 1) {
      await sleep(getMorseUnitMs());
    }
  }
}
