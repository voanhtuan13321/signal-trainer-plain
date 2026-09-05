import { escapeHtml } from "../../lib/escape-html.js";

export function renderQuizOption({ value, disabled = false, result = "" }) {
  const resultClass = result ? ` is-${result}` : "";
  return `<button class="option${escapeHtml(resultClass)}" type="button" data-answer="${escapeHtml(value)}"${disabled ? " disabled" : ""}>${escapeHtml(value)}</button>`;
}
