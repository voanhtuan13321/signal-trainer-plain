import { escapeHtml } from "./escape-html.js";

/**
 * Render an attribute object as an HTML attribute string with escaped values.
 * `true` renders a bare boolean attribute; `false`, `null` and `undefined`
 * are skipped.
 *
 * @param {Record<string, string | number | boolean | null | undefined>} attrs
 */
export function renderAttrs(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== false && value != null)
    .map(([name, value]) => (value === true ? escapeHtml(name) : `${escapeHtml(name)}="${escapeHtml(value)}"`))
    .join(" ");
}
