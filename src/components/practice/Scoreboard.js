import { escapeHtml } from "../../lib/escape-html.js";

/** Zero-pad counters so the board keeps a stable width. */
export function padScore(value, width = 3) {
  return String(value).padStart(width, "0");
}

/**
 * Arcade-style score strip. Numbers are padded; strings are shown as given.
 *
 * @param {{ label: string, value: number | string }[]} items
 */
export function renderScoreboard(items) {
  const cells = items
    .map(({ label, value }) => `
      <div class="scoreboard__cell">
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(typeof value === "number" ? padScore(value) : value)}</dd>
      </div>`)
    .join("");
  return `<dl class="scoreboard" aria-label="Bảng điểm">${cells}</dl>`;
}
