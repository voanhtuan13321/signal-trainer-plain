import { renderTabs } from "../components/common/Tabs.js";
import { bindTablistKeyboard, setActiveTab } from "../components/common/tabs-behavior.js";
import { renderButton } from "../components/common/Button.js";
import { renderQuizOption } from "../components/practice/QuizOption.js";
import { renderQuestionPrompt } from "../components/practice/QuestionPrompt.js";
import { createAdvancedSession } from "../features/practice/advanced-session.js";
import { SIGNAL_MODES, createModeQuestion } from "../features/signals/modes.js";
import { playPrompt } from "../features/signals/play-prompt.js";
import { escapeHtml } from "../lib/escape-html.js";
import { getOptionForKey, hasShortcutModifier } from "../lib/keyboard.js";
import { cancelMorseAudio } from "../services/morseAudio.js";

/** Start dialog before the first run, result dialog after a run ends. */
function renderDialog(session) {
  const backLink = '<a class="button button--secondary" href="#/practice">Về luyện tập thường</a>';

  if (session.ended) {
    return `
      <div class="eyebrow">Kết thúc lượt</div>
      <h2>${escapeHtml(session.reason)}</h2>
      <p>Bạn trả lời đúng <strong>${session.correct}</strong> câu liên tiếp.</p>
      <p>Kỷ lục trong lượt này: <strong>${session.best}</strong> câu.</p>
      ${renderButton({ label: "Bắt đầu lại", attrs: { "data-restart": true } })}
      ${backLink}`;
  }

  return `
    <div class="eyebrow">Chọn chế độ</div>
    <h2>Bắt đầu luyện tập</h2>
    <p>Chọn loại tín hiệu để bắt đầu lượt luyện tốc độ cao.</p>
    ${renderTabs({
      items: SIGNAL_MODES,
      activeValue: session.mode,
      attribute: "data-start-mode",
      className: "start-mode-tabs",
      idPrefix: "start-tab",
      containerAttrs: { "aria-label": "Chọn loại tín hiệu" }
    })}
    ${renderButton({ label: "Bắt đầu", attrs: { "data-start": true } })}
    ${backLink}`;
}

/**
 * Render the timed practice screen. State lives in a pure session object, the
 * view is redrawn from it, and listeners are delegated from `app` once and
 * removed by the returned cleanup function.
 */
export function renderAdvancedPractice(app) {
  const session = createAdvancedSession({ createQuestion: createModeQuestion });
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

  function answer(value) {
    const result = session.answer(value);
    if (result === "wrong") finish(session.reason);
    else if (result === "correct") draw();
  }

  function onClick(event) {
    const target = event.target.closest("[data-mode], [data-start-mode], [data-start], [data-restart], [data-answer]");
    if (!target) return;

    if (target.matches("[data-answer]")) {
      answer(target.dataset.answer);
    } else if (target.matches("[data-mode]")) {
      if (target.dataset.mode === session.mode) return;
      session.setMode(target.dataset.mode);
      draw();
    } else if (target.matches("[data-start-mode]")) {
      session.setMode(target.dataset.startMode);
      setActiveTab(target.closest('[role="tablist"]'), target);
    } else if (target.matches("[data-start]")) {
      session.start();
      draw();
    } else {
      session.restart();
      draw();
    }
  }

  function onKeydown(event) {
    if (hasShortcutModifier(event) || session.needsDialog) return;
    const option = getOptionForKey(event, session.question.options);
    if (option !== undefined) answer(String(option));
  }

  /**
   * The dialog is mandatory: it holds the only Start / Restart control, so Esc
   * must never leave the page without one. Block Esc at keydown and `cancel`,
   * and reopen on `close` for browsers that close despite preventDefault.
   * (`cancel` and `close` do not bubble, so these stay on the dialog itself.)
   */
  function bindDialog(dialog) {
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.preventDefault();
    });
    dialog.addEventListener("cancel", (event) => event.preventDefault());
    dialog.addEventListener("close", () => {
      if (session.needsDialog && dialog.isConnected) dialog.showModal();
    });

    dialog.showModal();
    dialog.querySelector("[data-start], [data-restart]")?.focus();
  }

  function draw() {
    stopTimer();
    stopAutoPlay();

    const playing = !session.needsDialog;
    const options = playing ? session.question.options.map((value, index) => renderQuizOption({ value, hint: String(index + 1) })).join("") : "";

    app.innerHTML = `
      <section class="advanced-page ${playing ? "is-playing" : ""}">
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
              <span>Chuỗi đúng <strong>${session.correct}</strong></span>
              <span>Giới hạn <strong>${(session.limit / 1000).toFixed(2)}s</strong></span>
            </div>
            ${playing ? renderTabs({
              items: SIGNAL_MODES,
              activeValue: session.mode,
              attribute: "data-mode",
              className: "tabs--compact",
              panelId: "advanced-panel",
              containerAttrs: { "aria-label": "Chọn chế độ" }
            }) : ""}
            <div id="advanced-panel" role="tabpanel" ${playing ? `aria-labelledby="tab-${escapeHtml(session.mode)}"` : 'aria-label="Câu hỏi"'}>
              <div class="quiz-timer" aria-label="Thời gian còn lại"><div data-time-meter></div></div>
              <div class="quiz-timer__label" data-time-label>${(session.limit / 1000).toFixed(1)}s</div>
              <div class="quiz__signal">${playing ? renderQuestionPrompt(session) : "Sẵn sàng?"}</div>
              <div class="quiz__options">${options}</div>
            </div>
          </article>
          ${session.needsDialog ? `<dialog class="restart-dialog" data-session-dialog>${renderDialog(session)}</dialog>` : ""}
        </div>
      </section>
    `.trim();
    firstDraw = false;

    const dialog = app.querySelector("[data-session-dialog]");
    if (dialog) {
      bindDialog(dialog);
      return;
    }

    startTimer();
    autoPlayTimer = window.setTimeout(() => {
      autoPlayTimer = null;
      playPrompt(session.mode, session.question);
    }, 0);
  }

  const unbindTabs = bindTablistKeyboard(app);
  app.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  draw();

  return () => {
    stopTimer();
    stopAutoPlay();
    cancelMorseAudio();
    unbindTabs();
    app.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeydown);
  };
}
