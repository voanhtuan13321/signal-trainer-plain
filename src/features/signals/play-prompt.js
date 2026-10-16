import { playMorseCharacter } from "../../services/morseAudio.js";
import { getSignalMode } from "./modes.js";

/**
 * Play a question's prompt as sound when its mode supports audio; otherwise do
 * nothing. Playback failures (autoplay blocked, no Web Audio) never throw;
 * pass `onError` to observe them.
 *
 * @param {string} modeValue
 * @param {{ prompt: unknown }} question
 * @param {{ onError?: (error: unknown) => void }} [options]
 */
export function playPrompt(modeValue, question, { onError } = {}) {
  if (!getSignalMode(modeValue).hasAudio) return;
  playMorseCharacter(question.prompt).catch((error) => onError?.(error));
}
