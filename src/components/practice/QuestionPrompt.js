import { escapeHtml } from "../../lib/escape-html.js";
import { getSignalMode } from "../../features/signals/modes.js";
import { renderSemaphoreImage } from "../common/SemaphoreImage.js";

/** Draw Morse as shapes (dot = circle, dash = bar) so it reads at a glance. */
export function renderMorseShapes(code, className = "") {
  const shapes = [...String(code)]
    .map((symbol) => `<span class="${symbol === "." ? "morse-dot" : "morse-dash"}"></span>`)
    .join("");
  const spoken = [...String(code)].map((symbol) => (symbol === "." ? "chấm" : "vạch")).join(" ");
  return `<span class="morse-signal${className ? ` ${className}` : ""}" role="img" aria-label="${escapeHtml(spoken)}" data-code="${escapeHtml(code)}">${shapes}</span>`;
}

/**
 * Render the current signal prompt according to the mode's `kind`: text modes
 * show the signal string, image modes show an image keyed by the answer.
 */
export function renderQuestionPrompt({ mode, question }) {
  if (getSignalMode(mode).kind === "image") {
    return `<div class="semaphore">${renderSemaphoreImage(question.key, "semaphore__image semaphore__image--prompt")}</div>`;
  }
  return renderMorseShapes(question.prompt);
}
