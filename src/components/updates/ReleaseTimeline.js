import { renderReleaseCard } from "./ReleaseCard.js";

export function renderReleaseTimeline(releases) {
  return `<div class="release-timeline">${releases.map((release) => `
    <div class="release-timeline__item">
      <div class="release-timeline__marker" aria-hidden="true"></div>
      ${renderReleaseCard(release)}
    </div>
  `.trim()).join("")}</div>`;
}
