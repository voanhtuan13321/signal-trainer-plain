import { escapeHtml } from "../../lib/escape-html.js";
import { renderAttrs } from "../../lib/html-attrs.js";

/**
 * Render a tablist. `idPrefix` keeps tab ids unique when more than one tablist
 * is on screen (for example the in-card tabs and the start dialog tabs).
 * `attribute` is the data attribute that carries each tab's value.
 *
 * @param {{ items: { value: string, label: string }[], activeValue: string,
 *   attribute?: string, className?: string, containerAttrs?: Record<string, string>,
 *   panelId?: string, idPrefix?: string }} options
 */
export function renderTabs({ items, activeValue, attribute = "data-tab", className = "", containerAttrs = {}, panelId = "", idPrefix = "tab" }) {
  const tabs = items.map(({ value, label }) => {
    const active = value === activeValue;
    const attrs = renderAttrs({
      id: `${idPrefix}-${value}`,
      role: "tab",
      "aria-selected": String(active),
      tabindex: active ? "0" : "-1",
      "aria-controls": panelId || null,
      [attribute]: value
    });
    return `<button class="tab ${active ? "is-active" : ""}" type="button" ${attrs}>${escapeHtml(label)}</button>`;
  }).join("");

  return `<div class="tabs ${escapeHtml(className)}" role="tablist" ${renderAttrs(containerAttrs)}>${tabs}</div>`;
}
