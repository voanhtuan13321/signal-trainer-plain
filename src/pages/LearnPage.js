import { MORSE_CODE } from "../data/morse.js";
import { SEMAPHORE_CODE } from "../data/semaphore.js";
import { cancelMorseAudio, playMorseCharacter } from "../services/morseAudio.js";
import { renderSemaphoreImage } from "../components/common/SemaphoreImage.js";
import { renderButton } from "../components/common/Button.js";
import { renderTabs } from "../components/common/Tabs.js";
import { bindTablistKeyboard } from "../components/common/tabs-behavior.js";
import { renderSignalCard } from "../components/learn/SignalCard.js";
import { DEFAULT_MODE, SIGNAL_MODES, getSignalMode } from "../features/signals/modes.js";

/**
 * Read the optional tab query from the hash route.
 * The default stays Morse because it is the broader reference table.
 */
function getLearnTabFromHash() {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");

  if (queryIndex === -1) {
    return DEFAULT_MODE;
  }

  const params = new URLSearchParams(hash.slice(queryIndex + 1));
  return getSignalMode(params.get("tab")).value;
}

/**
 * Render the Morse reference cards; play buttons are wired by delegation.
 */
function renderMorseGrid() {
  const cards = Object.keys(MORSE_CODE)
    .map((character) => {
      const code = MORSE_CODE[character];

      return renderSignalCard({
        character,
        contentHtml: `<div class="morse-code">${code}</div>`,
        actionsHtml: renderButton({
          label: "▶",
          className: "button--icon",
          attrs: { "data-play-morse": code, "aria-label": `Nghe chữ ${character}` }
        })
      });
    })
    .join("");

  return `
    <div class="callout">Chấm = 1 đơn vị, vạch = 3 đơn vị. Bấm ▶ để nghe.</div>
    <div class="grid grid--alphabet section tab-panel">${cards}</div>
  `.trim();
}

/**
 * Render pre-generated Semaphore cards. Image path ownership stays in data.
 */
function renderSemaphoreGrid() {
  const cards = Object.keys(SEMAPHORE_CODE)
    .map((character) =>
      renderSignalCard({
        character,
        contentHtml: `<div class="semaphore">${renderSemaphoreImage(character)}</div>`
      })
    )
    .join("");

  return `<div class="grid grid--alphabet section tab-panel">${cards}</div>`;
}

/** Horizontal strip of characters that scrolls the grid to a card. */
function renderJumpBar(modeValue) {
  const chips = Object.keys(getSignalMode(modeValue).referenceData)
    .map((character) => `<button class="chip" type="button" data-jump="${character}">${character}</button>`)
    .join("");
  return `<nav class="jump-bar" aria-label="Nhảy tới ký tự">${chips}</nav>`;
}

/** Reference grid per mode value; keep in step with SIGNAL_MODES. */
const GRID_RENDERERS = {
  morse: renderMorseGrid,
  semaphore: renderSemaphoreGrid
};

/**
 * Render the learning screen. Listeners are delegated from `app` once and
 * removed by the returned cleanup function, so tab redraws never rebind.
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
            ${renderTabs({
              items: SIGNAL_MODES,
              activeValue: activeTab,
              panelId: "learn-panel",
              containerAttrs: { "aria-label": "Chọn loại tín hiệu" }
            })}
          </div>
          ${renderJumpBar(activeTab)}
          <p class="feedback feedback--danger" data-audio-error role="alert" hidden></p>
          <div id="learn-panel" role="tabpanel" aria-labelledby="tab-${activeTab}">
            ${GRID_RENDERERS[activeTab]()}
          </div>
        </div>
      </section>
    `.trim();
  }

  async function playCode(button) {
    const errorBox = app.querySelector("[data-audio-error]");
    try {
      errorBox.hidden = true;
      button.disabled = true;
      await playMorseCharacter(button.dataset.playMorse);
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.hidden = false;
    } finally {
      button.disabled = false;
    }
  }

  function jumpTo(character) {
    const card = document.getElementById(`signal-${character}`);
    if (!card) return;
    // Instant jump: smooth scrolling over 2000px+ is slow and motion-heavy.
    card.scrollIntoView({ behavior: "auto", block: "center" });
    card.classList.remove("is-flash");
    void card.offsetWidth;
    card.classList.add("is-flash");
  }

  function onClick(event) {
    const chip = event.target.closest("[data-jump]");
    if (chip) {
      jumpTo(chip.dataset.jump);
      return;
    }

    const tab = event.target.closest("[data-tab]");
    if (tab) {
      activeTab = tab.dataset.tab;
      draw();
      return;
    }

    const playButton = event.target.closest("[data-play-morse]");
    if (playButton) playCode(playButton);
  }

  const unbindTabs = bindTablistKeyboard(app);
  app.addEventListener("click", onClick);
  draw();

  return () => {
    cancelMorseAudio();
    unbindTabs();
    app.removeEventListener("click", onClick);
  };
}
