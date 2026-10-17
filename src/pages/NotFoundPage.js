/**
 * Shown when a page throws while rendering, so the user is never left with a
 * blank screen.
 */
export function renderError(app) {
  app.innerHTML = `
    <section class="card empty-state">
      <div class="page-enter">
        <div class="eyebrow">Lỗi</div>
        <h1>Đã xảy ra lỗi</h1>
        <p>Không thể hiển thị trang này. Hãy thử lại từ trang chủ.</p>
        <a href="#/" class="button">Về trang chủ</a>
      </div>
    </section>
  `.trim();
}

/**
 * Render a lightweight fallback for unknown hash routes.
 */
export function renderNotFound(app) {
  app.innerHTML = `
    <section class="card empty-state">
      <div class="page-enter">
        <div class="eyebrow">404</div>
        <h1>Không tìm thấy trang</h1>
        <p>Địa chỉ này không tồn tại hoặc đã bị di chuyển.</p>
        <a href="#/" class="button">Về trang chủ</a>
      </div>
    </section>
  `.trim();
}
