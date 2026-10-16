import { cancelMorseAudio } from "../services/morseAudio.js";
import { renderTabs } from "../components/common/Tabs.js";
import { bindTablistKeyboard } from "../components/common/tabs-behavior.js";
import { renderButton } from "../components/common/Button.js";
import { renderQuizOption } from "../components/practice/QuizOption.js";
import { renderQuestionPrompt } from "../components/practice/QuestionPrompt.js";
import { createPracticeSession } from "../features/practice/practice-session.js";
import { SIGNAL_MODES, createModeQuestion, getSignalMode } from "../features/signals/modes.js";
import { playPrompt } from "../features/signals/play-prompt.js";
import { escapeHtml } from "../lib/escape-html.js";
import { getOptionForKey, hasShortcutModifier, isOnControl } from "../lib/keyboard.js";

// Correct answers advance quickly, while wrong answers leave space to review.
const AUTO_ADVANCE_MS = 700;

function describeOutcome({ correct, answer }) {
  return correct ? "Đúng." : `Sai. Đáp án đúng là ${String(answer)}.`;
}

/**
 * Render the practice screen. State lives in a pure session object and the
 * view is redrawn from it after every change; listeners are delegated from
 * `app` once and removed by the returned cleanup function.
 */
export function renderPractice(app) {
  const session = createPracticeSession({ createQuestion: createModeQuestion });
  let autoAdvanceTimer = null;
  let firstDraw = true;
  let promptedQuestion = null;
  let autoPlayTimer = null;

  // The live region must outlive redraws: screen readers only announce text
  // that changes inside a region that already existed.
  const liveRegion = document.createElement("div");
  liveRegion.className = "visually-hidden";
  liveRegion.setAttribute("aria-live", "polite");
  document.body.append(liveRegion);

  function clearAutoAdvance() {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }

  function playQuestion() {
    playPrompt(session.mode, session.question);
  }

  /** Autoplay may be rejected before the first user gesture; that is expected. */
  function autoPlayQuestion() {
    playPrompt(session.mode, session.question, {
      onError: (error) => console.info("Morse audio chưa thể tự phát. Bạn có thể dùng nút Nghe hoặc phím Space để phát.", error)
    });
  }

  function goToQuestion(change) {
    clearAutoAdvance();
    cancelMorseAudio();
    change();
    draw();
  }

  function nextQuestion() {
    goToQuestion(() => session.next());
  }

  function setMode(mode) {
    if (mode !== session.mode) goToQuestion(() => session.setMode(mode));
  }

  function submitAnswer(value) {
    const result = session.answer(value);
    if (result === "ignored") return;
    draw();
    if (result === "correct") {
      autoAdvanceTimer = window.setTimeout(nextQuestion, AUTO_ADVANCE_MS);
    }
  }

  function onClick(event) {
    const target = event.target.closest("[data-practice-mode], [data-answer], [data-play], [data-next]");
    if (!target) return;

    if (target.matches("[data-practice-mode]")) setMode(target.dataset.practiceMode);
    else if (target.matches("[data-answer]")) submitAnswer(target.dataset.answer);
    else if (target.matches("[data-play]")) playQuestion();
    else nextQuestion();
  }

  // Shortcuts mirror the visible option order so the same flow works on
  // desktop without adding extra UI text.
  function onKeydown(event) {
    if (hasShortcutModifier(event)) return;

    const option = getOptionForKey(event, session.question.options);
    if (option !== undefined) {
      submitAnswer(String(option));
      return;
    }

    if (isOnControl(event)) return;
    if (event.key === "Enter" && session.answered) nextQuestion();
    if (event.code === "Space" && getSignalMode(session.mode).hasAudio) {
      event.preventDefault();
      playQuestion();
    }
  }

  function renderFooter() {
    const outcome = session.outcome;
    return `
      <div class="quiz__footer" ${outcome ? "" : "hidden"}>
        <div class="feedback ${outcome ? `feedback--${outcome.correct ? "success" : "danger"}` : ""}" ${outcome ? "" : "hidden"}>${outcome ? escapeHtml(describeOutcome(outcome)) : ""}</div>
        ${renderButton({ label: "Câu tiếp theo", className: "button--secondary button--small", attrs: { "data-next": true, hidden: !session.showNext } })}
      </div>`;
  }

  function draw() {
    const mode = getSignalMode(session.mode);
    const options = session.question.options
      .map((option) => renderQuizOption({ value: option, disabled: session.answered, result: session.resultFor(option) }))
      .join("");

    app.innerHTML = `
      <section>
        <div class="${firstDraw ? "page-enter" : ""}">
          <div class="practice-layout">
            <article class="card quiz">
              <div class="quiz__controls">
                ${renderTabs({
                  items: SIGNAL_MODES,
                  activeValue: session.mode,
                  attribute: "data-practice-mode",
                  className: "tabs--compact",
                  panelId: "practice-panel",
                  containerAttrs: { "aria-label": "Chọn chế độ" }
                })}
                <a class="button button--ghost button--small practice__advanced-link" href="#/advanced-practice">Luyện tập nâng cao</a>
              </div>
              <div id="practice-panel" class="quiz__prompt" role="tabpanel" aria-labelledby="tab-${escapeHtml(session.mode)}">
                <div class="quiz__signal">${renderQuestionPrompt({ mode: session.mode, question: session.question })}</div>
                ${mode.hasAudio ? renderButton({ label: "Nghe", className: "button--ghost button--small quiz__play", attrs: { "data-play": true } }) : ""}
              </div>
              <div class="quiz__options">${options}</div>
              ${renderFooter()}
            </article>
          </div>
        </div>
      </section>
    `.trim();
    firstDraw = false;
    liveRegion.textContent = session.outcome ? describeOutcome(session.outcome) : "";

    // Answer redraws keep the same question, so only a new one is auto-played.
    if (promptedQuestion !== session.question) {
      promptedQuestion = session.question;
      window.clearTimeout(autoPlayTimer);
      autoPlayTimer = window.setTimeout(autoPlayQuestion, 0);
    }
  }

  const unbindTabs = bindTablistKeyboard(app);
  app.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  draw();

  return () => {
    clearAutoAdvance();
    window.clearTimeout(autoPlayTimer);
    cancelMorseAudio();
    unbindTabs();
    liveRegion.remove();
    app.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeydown);
  };
}
