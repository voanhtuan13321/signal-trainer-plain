import { escapeHtml } from "../../lib/escape-html.js";
import { renderAttrs } from "../../lib/html-attrs.js";

/**
 * @param {{ label: string, className?: string, type?: string, attrs?: Record<string, string | boolean> }} options
 */
export function renderButton({ label, className = "", type = "button", attrs = {} }) {
  return `<button class="button ${escapeHtml(className)}" type="${escapeHtml(type)}" ${renderAttrs(attrs)}>${escapeHtml(label)}</button>`;
}
