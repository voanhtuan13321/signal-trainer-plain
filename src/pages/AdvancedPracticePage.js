import { MORSE_LETTERS } from "../data/morse.js";
import { SEMAPHORE_CODE } from "../data/semaphore.js";
import { renderSemaphoreImage } from "../components/common/SemaphoreImage.js";
import { renderTabs } from "../components/common/Tabs.js";
import { bindTablistKeyboard, setActiveTab } from "../components/common/tabs-behavior.js";
import { renderButton } from "../components/common/Button.js";
import { renderQuizOption } from "../components/practice/QuizOption.js";
import { createChoiceQuestion } from "../lib/quiz.js";
import { createAdvancedSession } from "../features/practice/advanced-session.js";
import { escapeHtml } from "../lib/escape-html.js";
import { cancelMorseAudio, playMorseCharacter } from "../services/morseAudio.js";

const MODE_ITEMS = [
  { value: "morse", label: "Morse" },
  { value: "semaphore", label: "Semaphore" }
];

let cleanupAdvanced = null;

export function cleanupAdvancedPractice() {
  cleanupAdvanced?.();
  cleanupAdvanced = null;
}

function renderPrompt(session) {
  if (!session.started) return "Sẵn sàng?";
  if (session.mode === "semaphore") {
    return `<div class="semaphore">${renderSemaphoreImage(session.question.key, "semaphore__image semaphore__image--prompt")}</div>`;
  }
  return escapeHtml(session.question.prompt);
}

/** Start dialog before the first run, result dialog after a run ends. */
function renderDialog(session) {
  const backLink = '<a class="button button--ghost button--small" href="#/practice">Về luyện tập thường</a>';

  if (session.ended) {
    return `
      <div class="eyebrow">Kết thúc lượt</div>
      <h2>${escapeHtml(session.reason)}</h2>
      <p>Bạn trả lời đúng <strong>${session.correct}</strong> câu liên tiếp.</p>
      <p>Kỷ lục trong lượt này: <strong>${session.best}</strong> câu.</p>
      ${renderButton({ label: "Bắt đầu lại", className: "button--secondary", attributes: "data-restart" })}
      ${backLink}`;
  }

  return `
    <div class="eyebrow">Chọn chế độ</div>
    <h2>Bắt đầu luyện tập</h2>
    <p>Chọn loại tín hiệu để bắt đầu lượt luyện tốc độ cao.</p>
    ${renderTabs({ items: MODE_ITEMS, activeValue: session.mode, attribute: "data-start-mode", className: "start-mode-tabs", idPrefix: "start-tab", containerAttributes: 'aria-label="Chọn loại tín hiệu"' })}
    ${renderButton({ label: "Bắt đầu", className: "button--secondary", attributes: "data-start" })}
    ${backLink}`;
}

export function renderAdvancedPractice(app) {
  const session = createAdvancedSession({
    createQuestion: (mode) => createChoiceQuestion({ data: mode === "morse" ? MORSE_LETTERS : SEMAPHORE_CODE })
  });
  let interval = null;
  let autoPlayTimer = null;
  let firstDraw = true;

  function stopTimer() {
    window.clearInterval(interval);
    interval = null;
  }

  function stopAutoPlay() {
    window.clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
  }

  cleanupAdvanced = () => {
    stopTimer();
    stopAutoPlay();
    cancelMorseAudio();
  };

  function finish(reason) {
    stopTimer();
    session.finish(reason);
    draw();
  }

  function startTimer() {
    stopTimer();
    const meter = app.querySelector("[data-time-meter]");
    const label = app.querySelector("[data-time-label]");

    interval = window.setInterval(() => {
      const remaining = session.remaining;
      if (meter) {
        meter.style.width = `${(remaining / session.limit) * 100}%`;
        meter.parentElement.classList.toggle("is-warning", remaining <= 1000);
      }
      if (label) label.textContent = `${(remaining / 1000).toFixed(1)}s`;
      if (remaining <= 0) finish("Hết thời gian.");
    }, 50);
  }

  function startGame() {
    session.start();
    draw();
  }

  function answer(value) {
    const result = session.answer(value);
    if (result === "wrong") finish(session.reason);
    else if (result === "correct") draw();
  }

  /**
   * The dialog is mandatory: it holds the only Start / Restart control, so Esc
   * must never leave the page without one. Block `cancel`, and reopen on `close`
   * for browsers that close on a repeated Esc despite preventDefault.
   */
  function bindDialog(dialog) {
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.preventDefault();
    });
    dialog.addEventListener("cancel", (event) => event.preventDefault());
    dialog.addEventListener("close", () => {
      if (session.needsDialog && dialog.isConnected) dialog.showModal();
    });

    const startTabs = dialog.querySelector('[role="tablist"]');
    dialog.querySelectorAll("[data-start-mode]").forEach((tab) => {
      tab.addEventListener("click", () => {
        session.setMode(tab.dataset.startMode);
        setActiveTab(startTabs, tab);
      });
    });
    dialog.querySelector("[data-start]")?.addEventListener("click", startGame);
    dialog.querySelector("[data-restart]")?.addEventListener("click", () => {
      session.restart();
      draw();
    });

    dialog.showModal();
    dialog.querySelector("[data-start], [data-restart]")?.focus();
  }

  function draw() {
    stopTimer();
    stopAutoPlay();

    const playing = !session.needsDialog;
    const options = playing ? session.question.options.map((value) => renderQuizOption({ value })).join("") : "";
    const activeTabId = `tab-${session.mode}`;

    app.innerHTML = `
      <section>
        <div class="${firstDraw ? "page-enter" : ""}">
          <div class="section__header">
            <div>
              <div class="eyebrow">Tốc độ cao</div>
              <h1>Luyện tập nâng cao</h1>
              <p>Trả lời đúng để câu hỏi tiếp theo xuất hiện ngay và thời gian ngắn dần.</p>
            </div>
          </div>
          <article class="card advanced-quiz">
            <div class="advanced-quiz__meta">
              <span>Streak <strong>${session.correct}</strong></span>
              <span>Giới hạn <strong>${(session.limit / 1000).toFixed(2)}s</strong></span>
            </div>
            ${playing ? renderTabs({ items: MODE_ITEMS, activeValue: session.mode, attribute: "data-mode", className: "tabs--compact", panelId: "advanced-panel", containerAttributes: 'aria-label="Chọn chế độ"' }) : ""}
            <div id="advanced-panel" role="tabpanel" ${playing ? `aria-labelledby="${activeTabId}"` : 'aria-label="Câu hỏi"'}>
              <div class="quiz-timer" aria-label="Thời gian còn lại"><div data-time-meter></div></div>
              <div class="quiz-timer__label" data-time-label>${(session.limit / 1000).toFixed(1)}s</div>
              <div class="quiz__signal">${renderPrompt(session)}</div>
              <div class="quiz__options">${options}</div>
            </div>
          </article>
          ${session.needsDialog ? `<dialog class="restart-dialog" data-session-dialog>${renderDialog(session)}</dialog>` : ""}
        </div>
      </section>
    `.trim();
    firstDraw = false;

    app.querySelectorAll("[data-mode]").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.dataset.mode === session.mode) return;
        session.setMode(tab.dataset.mode);
        draw();
      });
    });
    app.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => answer(button.dataset.answer));
    });
    bindTablistKeyboard(app);

    const dialog = app.querySelector("[data-session-dialog]");
    if (dialog) {
      bindDialog(dialog);
      return;
    }

    startTimer();
    if (session.mode === "morse") {
      autoPlayTimer = window.setTimeout(() => {
        autoPlayTimer = null;
        playMorseCharacter(session.question.prompt).catch(() => {});
      }, 0);
    }
  }

  draw();
}
