/**
 * Render a lightweight fallback for unknown hash routes.
 */
export function renderNotFound(app) {
  app.innerHTML = `
    <section class="card empty-state">
      <div class="page-enter">
        <div class="eyebrow">404</div>
        <h1>Không tìm thấy trang</h1>
        <p>Route hiện tại không tồn tại.</p>
        <a href="#/" class="button">Về trang chủ</a>
      </div>
    </section>
  `.trim();
}
