import { escapeHtml } from "../../lib/escape-html.js";

/**
 * `character` is plain text and is escaped; `contentHtml` and `actionsHtml`
 * are trusted markup produced by other renderers.
 */
export function renderSignalCard({ character, contentHtml, actionsHtml = "" }) {
  return `
    <article class="card alphabet-card">
      <div class="alphabet-card__letter">${escapeHtml(character)}</div>
      ${contentHtml}
      ${actionsHtml ? `<div class="actions">${actionsHtml}</div>` : ""}
    </article>
  `.trim();
}
