import { APP_META } from "../data/signals.js";

/**
 * Render the static landing screen. Keeping this as a feature module makes the
 * router map declarative and keeps metadata formatting close to the UI.
 */
export function renderHome(app) {
  app.innerHTML = `
    <section class="hero hero--compact page-enter">
      <div class="card hero__content">
        <div class="eyebrow">Signal trainer</div>
        <h1>Học Morse và Semaphore theo cách gọn nhất.</h1>
        <p>Mở bảng học khi cần tra cứu, hoặc vào luyện tập ngay trên điện thoại.</p>
        <div class="actions actions--stack">
          <a class="button" href="#/practice">Vào luyện tập</a>
          <a class="button button--secondary" href="#/learn">Xem bảng tín hiệu</a>
        </div>
        <div class="release-chip">v${APP_META.version} · ${APP_META.releaseDate}</div>
      </div>
    </section>
  `.trim();
}
