import { APP_META } from "../data/app-meta.js";
import { renderVersionBadge } from "../components/updates/VersionBadge.js";

/** Home is a launcher: three clear destinations, the main one first. */
const DESTINATIONS = [
  { href: "#/practice", title: "Luyện tập", text: "Trả lời nhanh, giữ chuỗi đúng thật dài.", primary: true },
  { href: "#/learn", title: "Bảng tín hiệu", text: "Tra cứu và nghe Morse, xem Semaphore." },
  { href: "#/advanced-practice", title: "Thử thách tốc độ", text: "Thời gian giảm dần sau mỗi câu đúng." }
];

/**
 * Render the static landing screen. Keeping this as a feature module makes the
 * router map declarative and keeps metadata formatting close to the UI.
 */
export function renderHome(app) {
  const cards = DESTINATIONS.map(({ href, title, text, primary }) => `
    <a class="path-card${primary ? " path-card--primary" : ""}" href="${href}">
      <strong>${title}</strong>
      <span>${text}</span>
    </a>`).join("");

  app.innerHTML = `
    <section class="home page-enter">
      <div class="eyebrow">Signal Trainer</div>
      <h1>Học Morse và Semaphore mỗi ngày vài phút.</h1>
      <div class="path-cards">${cards}</div>
      ${renderVersionBadge({ version: APP_META.version, date: APP_META.releaseDate })}
    </section>
  `.trim();
}
