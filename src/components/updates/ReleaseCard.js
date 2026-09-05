const CHANGE_LABELS = {
  added: "Thêm",
  changed: "Thay đổi",
  fixed: "Sửa lỗi",
  deprecated: "Ngừng hỗ trợ",
  removed: "Xóa",
  security: "Bảo mật"
};

export function renderReleaseCard(release) {
  const groups = Object.entries(release.changes)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => `
      <section class="release-group">
        <h3>${CHANGE_LABELS[key] || key}</h3>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
    `.trim())
    .join("");

  return `
    <article class="card release-card">
      <div class="release-card__header">
        <h2>v${release.version}</h2>
        <time datetime="${release.date}">${release.date}</time>
      </div>
      ${groups}
    </article>
  `.trim();
}
