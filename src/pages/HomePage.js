import { APP_META } from "../data/app-meta.js";
import { renderVersionBadge } from "../components/updates/VersionBadge.js";
import { loadBest } from "../services/storage.js";

/**
 * Home is a launcher. The order is the learning path (look up, practise, then
 * the speed challenge) and matches the bottom navigation.
 */
const DESTINATIONS = [
  { id: "learn", href: "#/learn", tag: "LV.01", title: "Bảng tín hiệu", text: "Tra cứu và nghe Morse, xem Semaphore." },
  { id: "practice", href: "#/practice", tag: "LV.02", title: "Luyện tập", text: "Trả lời nhanh, giữ chuỗi đúng thật dài." },
  { id: "advanced", href: "#/advanced-practice", tag: "BOSS", title: "Thử thách tốc độ", text: "Thời gian giảm dần sau mỗi câu đúng." }
];

/**
 * Pick the destination to highlight: new users start with the reference table,
 * returning users (who already scored) go straight to practice.
 *
 * @param {{ hasPracticed: boolean }} options
 */
export function getDestinations({ hasPracticed }) {
  const primaryId = hasPracticed ? "practice" : "learn";
  return DESTINATIONS.map((destination) => ({ ...destination, primary: destination.id === primaryId }));
}

/**
 * Render the static landing screen. Keeping this as a feature module makes the
 * router map declarative and keeps metadata formatting close to the UI.
 */
export function renderHome(app) {
  const hasPracticed = loadBest("best-practice") > 0 || loadBest("best-advanced") > 0;
  const cards = getDestinations({ hasPracticed }).map(({ href, tag, title, text, primary }) => `
    <a class="path-card${primary ? " path-card--primary" : ""}" href="${href}">
      <span class="path-card__tag">${tag}</span>
      <strong>${title}</strong>
      <span>${text}</span>
    </a>`).join("");

  app.innerHTML = `
    <section class="home page-enter">
      <div class="home__sky" aria-hidden="true"><div class="cloud"></div></div>
      <div class="eyebrow">Signal Trainer</div>
      <h1>Học Morse và Semaphore mỗi ngày vài phút.<span class="cursor" aria-hidden="true">█</span></h1>
      <p class="insert-coin">► Chọn màn chơi để bắt đầu</p>
      <div class="path-cards">${cards}</div>
      ${renderVersionBadge({ version: APP_META.version, date: APP_META.releaseDate })}
    </section>
  `.trim();
}
