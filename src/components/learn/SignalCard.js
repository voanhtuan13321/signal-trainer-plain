export function renderSignalCard({ character, content, actions = "" }) {
  return `
    <article class="card alphabet-card">
      <div class="alphabet-card__letter">${character}</div>
      ${content}
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </article>
  `.trim();
}
