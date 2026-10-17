import { escapeHtml } from "../../lib/escape-html.js";

export function renderVersionBadge(release) {
  const version = escapeHtml(release.version);
  return `<a class="release-chip" href="#/updates" aria-label="Xem cập nhật phiên bản ${version}">v${version} · ${escapeHtml(release.date)} · Cập nhật</a>`;
}
