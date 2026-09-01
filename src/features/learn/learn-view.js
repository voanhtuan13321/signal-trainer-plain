import { MORSE_CODE, SEMAPHORE_CODE } from "../../data/signals.js";
import { playMorseCharacter } from "../../audio/morse.js";
import { renderSemaphoreImage } from "../../ui/semaphore-image.js";

/**
 * Read the optional tab query from the hash route.
 * The default stays Morse because it is the broader reference table.
 */
function getLearnTabFromHash() {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");

  if (queryIndex === -1) {
    return "morse";
  }

  const params = new URLSearchParams(hash.slice(queryIndex + 1));
  return params.get("tab") === "semaphore" ? "semaphore" : "morse";
}

/**
 * Render the Morse reference cards and attach play buttons later in renderLearn.
 */
function renderMorseGrid() {
  const cards = Object.keys(MORSE_CODE)
    .map((character) => {
      const code = MORSE_CODE[character];

      return `
        <article class="card alphabet-card">
          <div class="alphabet-card__letter">${character}</div>
          <div class="morse-code">${code}</div>
          <div class="actions">
            <button class="button button--ghost button--small" type="button" data-play-morse="${code}">▶ Play</button>
          </div>
        </article>
      `.trim();
    })
    .join("");

  return `
    <div class="callout">Timing: dot = 1 unit, dash = 3 units.</div>
    <div class="grid grid--alphabet section tab-panel">${cards}</div>
  `.trim();
}

/**
 * Render pre-generated Semaphore cards. Image path ownership stays in data.
 */
function renderSemaphoreGrid() {
  const cards = Object.keys(SEMAPHORE_CODE)
    .map((character) =>
      `
        <article class="card alphabet-card">
          <div class="alphabet-card__letter">${character}</div>
          <div class="semaphore">${renderSemaphoreImage(character)}</div>
        </article>
      `.trim()
    )
    .join("");

  return `<div class="grid grid--alphabet section tab-panel">${cards}</div>`;
}

/**
 * Render the learning screen and rebind events after each tab redraw.
 *
 * This view uses innerHTML for a tiny dependency-free app; all event listeners
 * are scoped to the current app subtree and recreated with the markup.
 */
export function renderLearn(app) {
  let activeTab = getLearnTabFromHash();

  function draw() {
    app.innerHTML = `
      <section>
        <div class="page-enter">
          <div class="section__header">
            <div>
              <div class="eyebrow">Reference</div>
              <h1>Học bảng tín hiệu</h1>
              <p>Chạm để xem nhanh, nghe nhanh rồi quay lại luyện tập.</p>
            </div>
            <div class="tabs">
              <button class="tab ${activeTab === "morse" ? "is-active" : ""}" type="button" data-tab="morse">Morse</button>
              <button class="tab ${activeTab === "semaphore" ? "is-active" : ""}" type="button" data-tab="semaphore">Semaphore</button>
            </div>
          </div>
          ${activeTab === "morse" ? renderMorseGrid() : renderSemaphoreGrid()}
        </div>
      </section>
    `.trim();

    app.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.getAttribute("data-tab");
        draw();
      });
    });

    app.querySelectorAll("[data-play-morse]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          button.disabled = true;
          await playMorseCharacter(button.getAttribute("data-play-morse"));
        } catch (error) {
          window.alert(error.message);
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  draw();
}
