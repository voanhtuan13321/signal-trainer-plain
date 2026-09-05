import { escapeHtml } from "../../lib/escape-html.js";

export function renderButton({ label, className = "", type = "button", attributes = "" }) {
  return `<button class="button ${escapeHtml(className)}" type="${escapeHtml(type)}" ${attributes}>${escapeHtml(label)}</button>`;
}
