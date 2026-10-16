import { escapeHtml } from "../../lib/escape-html.js";

/**
 * Render a tablist. `idPrefix` keeps tab ids unique when more than one tablist
 * is on screen (for example the in-card tabs and the start dialog tabs).
 */
export function renderTabs({ items, activeValue, attribute = "data-tab", className = "", containerAttributes = "", panelId = "", idPrefix = "tab" }) {
  const tabs = items.map(({ value, label }) =>
    `<button id="${escapeHtml(idPrefix)}-${escapeHtml(value)}" class="tab ${value === activeValue ? "is-active" : ""}" role="tab" aria-selected="${value === activeValue}" tabindex="${value === activeValue ? "0" : "-1"}" type="button" ${panelId ? `aria-controls="${escapeHtml(panelId)}"` : ""} ${escapeHtml(attribute)}="${escapeHtml(value)}">${escapeHtml(label)}</button>`
  ).join("");

  return `<div class="tabs ${escapeHtml(className)}" role="tablist" ${containerAttributes}>${tabs}</div>`;
}
