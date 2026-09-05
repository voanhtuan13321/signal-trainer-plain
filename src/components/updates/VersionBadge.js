export function renderVersionBadge(release) {
  return `<a class="release-chip" href="#/updates" aria-label="Xem cập nhật phiên bản ${release.version}">v${release.version} · ${release.date} · Cập nhật</a>`;
}
