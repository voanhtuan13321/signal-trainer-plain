export function renderTabs({ items, activeValue, attribute = "data-tab", className = "", containerAttributes = "" }) {
  const tabs = items.map(({ value, label }) =>
    `<button class="tab ${value === activeValue ? "is-active" : ""}" type="button" ${attribute}="${value}">${label}</button>`
  ).join("");

  return `<div class="tabs ${className}" ${containerAttributes}>${tabs}</div>`;
}
