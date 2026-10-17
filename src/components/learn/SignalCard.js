import { escapeHtml } from "../../lib/escape-html.js";

/**
 * `character` is plain text and is escaped; `contentHtml` and `actionsHtml`
 * are trusted markup produced by other renderers. The card id lets the Learn
 * page scroll to a character from its jump bar.
 */
export function renderSignalCard({ character, contentHtml, actionsHtml = "" }) {
  return `
    <article class="card alphabet-card" id="signal-${escapeHtml(character)}">
      <div class="alphabet-card__letter">${escapeHtml(character)}</div>
      ${contentHtml}
      ${actionsHtml ? `<div class="actions">${actionsHtml}</div>` : ""}
    </article>
  `.trim();
}
