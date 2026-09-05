import { MORSE_LETTERS } from "../data/morse.js";
import { SEMAPHORE_CODE } from "../data/semaphore.js";
import { cancelMorseAudio, playMorseCharacter } from "../services/morseAudio.js";
import { renderSemaphoreImage } from "../components/common/SemaphoreImage.js";
import { createChoiceQuestion, isCorrectAnswer } from "../lib/quiz.js";
import { renderTabs } from "../components/common/Tabs.js";
import { renderButton } from "../components/common/Button.js";
import { renderQuizOption } from "../components/practice/QuizOption.js";

// The practice screen binds one document-level keyboard handler. Keeping the
// reference at module scope lets the router clean it up before changing routes.
let currentKeyboardHandler = null;
let currentPracticeCleanup = null;

export function cleanupPractice() {
  currentPracticeCleanup?.();
  currentPracticeCleanup = null;
}

/**
 * Release the active keyboard shortcut handler, if the practice view installed
 * one during its latest render cycle.
 */
export function cleanupPracticeKeyboardHandler() {
  if (!currentKeyboardHandler) {
    return;
  }

  document.removeEventListener("keydown", currentKeyboardHandler);
  currentKeyboardHandler = null;
}

/**
 * Render the current signal prompt. Morse prompts are text, Semaphore prompts
 * are images keyed by the underlying answer character.
 */
function renderQuestionPrompt(state) {
  if (state.mode === "semaphore") {
    return `<div class="semaphore">${renderSemaphoreImage(
      state.question.key,
      "semaphore__image semaphore__image--prompt",
    )}</div>`;
  }

  return String(state.question.prompt);
}

/**
 * Render answer buttons from the generated question shape.
 */
function renderQuestionOptions(state) {
  return state.question.options
    .map(
      (option) => renderQuizOption({ value: option }),
    )
    .join("");
}

/**
 * Render the practice screen and own the short-lived quiz state for this route.
 *
 * State is intentionally local to the render call so switching away and back
 * starts a fresh session without persisted timers or stale answer buttons.
 */
export function renderPractice(app) {
  const state = {
    mode: "morse",
    direction: "value-to-key",
    question: null,
    answered: false,
    showNextButton: false,
    autoAdvanceTimer: null,
    feedbackMessage: "",
    feedbackClassName: "feedback"
  };
  let autoPlayTimer = null;

  currentPracticeCleanup = () => {
    cancelMorseAudio();
    cleanupPracticeKeyboardHandler();
    if (state.autoAdvanceTimer) {
      window.clearTimeout(state.autoAdvanceTimer);
      state.autoAdvanceTimer = null;
    }
    if (autoPlayTimer) {
      window.clearTimeout(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  function createQuestion() {
    // A pending auto-advance belongs to the previous question and must not fire
    // after mode switches or manual "next question" actions.
    if (state.autoAdvanceTimer) {
      window.clearTimeout(state.autoAdvanceTimer);
      state.autoAdvanceTimer = null;
    }

    state.answered = false;
    state.showNextButton = false;
    state.feedbackMessage = "";
    state.feedbackClassName = "feedback";
    state.question = createChoiceQuestion({
      data: state.mode === "morse" ? MORSE_LETTERS : SEMAPHORE_CODE,
      direction: state.mode === "morse" ? state.direction : "value-to-key"
    });
  }

  function submitAnswer(answer) {
    if (state.answered) {
      return;
    }

    state.answered = true;
    const correct = isCorrectAnswer(state.question, answer);

    // Apply result classes before showing feedback so the UI updates as one
    // coherent answer state.
    app.querySelectorAll("[data-answer]").forEach((button) => {
      const buttonAnswer = button.getAttribute("data-answer");

      button.disabled = true;

      if (buttonAnswer === String(state.question.answer)) {
        button.classList.add("is-correct");
      } else if (buttonAnswer === String(answer)) {
        button.classList.add("is-wrong");
      }
    });

    state.feedbackClassName = `feedback ${correct ? "feedback--success" : "feedback--danger"}`;
    state.feedbackMessage = correct
      ? "Đúng."
      : `Sai. Đáp án đúng là ${String(state.question.answer)}.`;

    const feedback = document.getElementById("feedback");
    if (feedback) {
      feedback.className = state.feedbackClassName;
      feedback.textContent = state.feedbackMessage;
      feedback.hidden = false;
    }

    const quizFooter = document.getElementById("quiz-footer");
    if (quizFooter) {
      quizFooter.hidden = false;
    }

    if (correct) {
      // Correct answers advance quickly, while wrong answers leave space to review.
      state.autoAdvanceTimer = window.setTimeout(() => {
        nextQuestion();
      }, 700);
    } else {
      state.showNextButton = true;
      const nextQuestionButton = document.getElementById("next-question");
      if (nextQuestionButton) {
        nextQuestionButton.hidden = false;
        nextQuestionButton.disabled = false;
      }
    }
  }

  function nextQuestion() {
    if (state.autoAdvanceTimer) {
      window.clearTimeout(state.autoAdvanceTimer);
      state.autoAdvanceTimer = null;
    }

    currentPracticeCleanup?.();
    createQuestion();
    draw();
  }

  /**
   * Attempt to play a newly rendered Morse prompt without blocking the UI.
   * Browsers may reject this before the first user gesture; that is expected.
   */
  function autoPlayQuestion() {
    if (state.mode !== "morse") {
      return;
    }

    autoPlayTimer = window.setTimeout(async () => {
      autoPlayTimer = null;
      try {
        await playMorseCharacter(state.question.prompt);
      } catch (error) {
        console.info(
            "Morse audio chưa thể tự phát. Bạn có thể dùng nút Nghe hoặc phím Space để phát.",
          error,
        );
      }
    }, 0);
  }

  function setMode(mode) {
    if (state.mode === mode) {
      return;
    }

    state.mode = mode;
    currentPracticeCleanup?.();
    createQuestion();
    draw();
  }

  function bindPracticeEvents() {
    app.querySelectorAll("[data-practice-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.getAttribute("data-practice-mode"));
      });
    });

    app.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        submitAnswer(button.getAttribute("data-answer"));
      });
    });

    const nextQuestionButton = document.getElementById("next-question");
    if (nextQuestionButton) {
      nextQuestionButton.addEventListener("click", nextQuestion);
    }

    const playButton = document.getElementById("play-question");
    if (playButton) {
      playButton.addEventListener("click", () => {
        if (state.mode === "morse") {
          playMorseCharacter(state.question.prompt).catch(() => {});
        }
      });
    }

    // Keyboard shortcuts intentionally mirror the visible option order so the
    // same flow works on desktop without adding extra UI text.
    currentKeyboardHandler = (event) => {
      if (["1", "2", "3", "4"].indexOf(event.key) !== -1) {
        if (state.answered) {
          return;
        }

        const option = state.question.options[Number(event.key) - 1];
        if (typeof option !== "undefined") {
          submitAnswer(String(option));
        }
      }

      if (event.key === "Enter" && state.answered) {
        nextQuestion();
      }

      if (
        event.code === "Space" &&
        state.mode === "morse" &&
        state.direction === "value-to-key"
      ) {
        event.preventDefault();
        playMorseCharacter(state.question.prompt).catch(() => {});
      }
    };

    document.addEventListener("keydown", currentKeyboardHandler);
    autoPlayQuestion();
  }

  function draw() {
    if (!state.question) {
      createQuestion();
    }

    app.innerHTML = `
      <section>
        <div class="page-enter">
          <div class="practice-layout">
            <article class="card quiz">
              <div class="quiz__controls">
                ${renderTabs({ items: [{ value: "morse", label: "Morse" }, { value: "semaphore", label: "Semaphore" }], activeValue: state.mode, attribute: "data-practice-mode", className: "tabs--compact", panelId: "practice-panel", containerAttributes: 'aria-label="Chọn chế độ"' })}
                <a class="button button--ghost button--small practice__advanced-link" href="#/advanced-practice">Luyện tập nâng cao</a>
              </div>
              <div id="practice-panel" class="quiz__prompt" role="tabpanel" aria-labelledby="tab-${state.mode}">
                <div class="quiz__signal">${renderQuestionPrompt(state)}</div>
                ${state.mode === "morse" ? renderButton({ label: "Nghe", className: "button--ghost button--small quiz__play", attributes: 'id="play-question"' }) : ""}
              </div>
              <div class="quiz__options">${renderQuestionOptions(state)}</div>
              <div class="quiz__footer" id="quiz-footer" ${state.feedbackMessage || state.showNextButton ? "" : "hidden"}>
                <div id="feedback" class="${state.feedbackClassName}" aria-live="polite" ${state.feedbackMessage ? "" : "hidden"}>${state.feedbackMessage}</div>
                ${state.showNextButton
                  ? renderButton({ label: "Câu tiếp theo", className: "button--secondary button--small", attributes: 'id="next-question"' })
                  : renderButton({ label: "Câu tiếp theo", className: "button--secondary button--small", attributes: 'id="next-question" hidden disabled' })}
              </div>
            </article>
          </div>
        </div>
      </section>
    `.trim();

    bindPracticeEvents();
  }

  draw();
}
