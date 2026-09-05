import { renderReleaseTimeline } from "../components/updates/ReleaseTimeline.js";
import { fetchChangelog } from "../lib/changelog.js";

export function renderUpdates(app) {
  app.innerHTML = `
    <section>
      <div class="page-enter">
        <div class="section__header">
          <div>
            <div class="eyebrow">Changelog</div>
            <h1>Cập nhật ứng dụng</h1>
            <p>Lịch sử thay đổi của Signal Trainer theo từng phiên bản.</p>
          </div>
        </div>
        <div class="release-list" aria-live="polite">Đang tải lịch sử cập nhật...</div>
      </div>
    </section>
  `.trim();

  fetchChangelog()
    .then((releases) => {
      app.querySelector(".release-list").innerHTML = releases.length
        ? renderReleaseTimeline(releases)
        : "<p>Chưa có thông tin cập nhật.</p>";
    })
    .catch((error) => {
      app.querySelector(".release-list").innerHTML = `<p class="feedback feedback--danger">${error.message}</p>`;
    });
}
