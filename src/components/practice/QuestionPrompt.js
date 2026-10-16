import { escapeHtml } from "../../lib/escape-html.js";
import { getSignalMode } from "../../features/signals/modes.js";
import { renderSemaphoreImage } from "../common/SemaphoreImage.js";

/**
 * Render the current signal prompt according to the mode's `kind`: text modes
 * show the signal string, image modes show an image keyed by the answer.
 */
export function renderQuestionPrompt({ mode, question }) {
  if (getSignalMode(mode).kind === "image") {
    return `<div class="semaphore">${renderSemaphoreImage(question.key, "semaphore__image semaphore__image--prompt")}</div>`;
  }
  return escapeHtml(question.prompt);
}
