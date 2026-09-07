import { renderReleaseCard } from "./ReleaseCard.js";

export function renderReleaseTimeline(releases) {
  return `<div class="release-timeline">${releases.map((release) => `
    <div class="release-timeline__item">
      <div class="release-timeline__marker" aria-hidden="true"></div>
      ${renderReleaseCard(release)}
    </div>
  `.trim()).join("")}</div>`;
}

export function renderReleaseTimelineSkeleton(count = 3) {
  const items = Array.from({ length: count }, () => `
    <div class="release-timeline__item">
      <div class="release-timeline__marker" aria-hidden="true"></div>
      <article class="card release-card release-card--skeleton" aria-hidden="true">
        <div class="skeleton-block skeleton-block--title"></div>
        <div class="skeleton-block skeleton-block--date"></div>
        <div class="skeleton-block skeleton-block--section"></div>
        <div class="skeleton-block skeleton-block--line"></div>
        <div class="skeleton-block skeleton-block--line skeleton-block--line-short"></div>
      </article>
    </div>
  `.trim()).join("");

  return `<div class="release-timeline release-timeline--skeleton">${items}</div>`;
}
