import { escapeHtml } from "../../lib/escape-html.js";

/**
 * One answer button. `hint` is the keyboard shortcut shown as a small badge;
 * it is decorative, so screen readers only hear the answer itself.
 */
export function renderQuizOption({ value, disabled = false, result = "", hint = "" }) {
  const resultClass = result ? ` is-${result}` : "";
  const badge = hint ? `<span class="option__key" aria-hidden="true">${escapeHtml(hint)}</span>` : "";
  return `<button class="option${escapeHtml(resultClass)}" type="button" data-answer="${escapeHtml(value)}"${disabled ? " disabled" : ""}>${badge}${escapeHtml(value)}</button>`;
}
