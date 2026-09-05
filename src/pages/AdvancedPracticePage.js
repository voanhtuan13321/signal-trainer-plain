import { MORSE_LETTERS } from "../data/morse.js";
import { SEMAPHORE_CODE } from "../data/semaphore.js";
import { renderSemaphoreImage } from "../components/common/SemaphoreImage.js";
import { renderTabs } from "../components/common/Tabs.js";
import { renderButton } from "../components/common/Button.js";
import { renderQuizOption } from "../components/practice/QuizOption.js";
import { createChoiceQuestion, isCorrectAnswer } from "../lib/quiz.js";
import { getAdvancedTimeLimit } from "../features/practice/advanced-session.js";
import { cancelMorseAudio, playMorseCharacter } from "../services/morseAudio.js";

let cleanupAdvanced = null;
export function cleanupAdvancedPractice() { cleanupAdvanced?.(); cleanupAdvanced = null; }

export function renderAdvancedPractice(app) {
  const state = { mode: "morse", question: null, correct: 0, best: 0, startedAt: 0, ended: false, started: false, reason: "" };
  let interval = null;
  let autoPlayTimer = null;

  function stopTimer() { if (interval) { window.clearInterval(interval); interval = null; } }
  cleanupAdvanced = () => { stopTimer(); cancelMorseAudio(); if (autoPlayTimer) { window.clearTimeout(autoPlayTimer); autoPlayTimer = null; } };
  function limit() { return getAdvancedTimeLimit(state.correct); }
  function createQuestion() { state.question = createChoiceQuestion({ data: state.mode === "morse" ? MORSE_LETTERS : SEMAPHORE_CODE }); state.startedAt = performance.now(); }
  function finish(reason) { stopTimer(); state.ended = true; state.reason = reason; state.best = Math.max(state.best, state.correct); draw(); app.querySelector("dialog")?.showModal(); }
  function answer(value) { if (!state.started || state.ended) return; if (isCorrectAnswer(state.question, value)) { state.correct += 1; createQuestion(); draw(); } else finish("Bạn đã chọn sai đáp án."); }
  function remaining() { return Math.max(0, limit() - (performance.now() - state.startedAt)); }
    function startTimer() { stopTimer(); const meter = app.querySelector("[data-time-meter]"); const label = app.querySelector("[data-time-label]"); const timer = meter?.parentElement; interval = window.setInterval(() => { const time = remaining(); if (meter) { meter.style.width = `${(time / limit()) * 100}%`; timer?.classList.toggle("is-warning", time <= 1000); } if (label) label.textContent = `${(time / 1000).toFixed(1)}s`; if (time <= 0) finish("Hết thời gian."); }, 50); }
  function restart() { stopTimer(); state.correct = 0; state.ended = false; state.started = false; state.question = null; state.reason = ""; draw(); }
  function startGame() { state.started = true; state.ended = false; state.correct = 0; createQuestion(); draw(); startTimer(); }
  function draw() {
    const prompt = state.started ? (state.mode === "semaphore" ? `<div class="semaphore">${renderSemaphoreImage(state.question.key, "semaphore__image semaphore__image--prompt")}</div>` : String(state.question.prompt)) : "Sẵn sàng?";
    const options = state.started ? state.question.options.map((value) => renderQuizOption({ value })).join("") : "";
    const dialog = state.ended
      ? `<div class="eyebrow">Kết thúc lượt</div><h2>${state.reason}</h2><p>Bạn trả lời đúng <strong>${state.correct}</strong> câu liên tiếp.</p><p>Kỷ lục trong lượt này: <strong>${state.best}</strong> câu.</p>${renderButton({ label: "Bắt đầu lại", className: "button--secondary", attributes: 'data-restart' })}<a class="button button--ghost button--small" href="#/practice">Về luyện tập thường</a>`
      : `<div class="eyebrow">Chọn chế độ</div><h2>Bắt đầu luyện tập</h2><p>Chọn loại tín hiệu để bắt đầu lượt luyện tốc độ cao.</p>${renderTabs({ items: [{ value: "morse", label: "Morse" }, { value: "semaphore", label: "Semaphore" }], activeValue: state.mode, attribute: "data-start-mode", className: "start-mode-tabs" })}${renderButton({ label: "Bắt đầu", className: "button--secondary", attributes: 'data-start' })}<a class="button button--ghost button--small" href="#/practice">Về luyện tập thường</a>`;
    app.innerHTML = `<section><div class="page-enter"><div class="section__header"><div><div class="eyebrow">Tốc độ cao</div><h1>Luyện tập nâng cao</h1><p>Trả lời đúng để câu hỏi tiếp theo xuất hiện ngay và thời gian ngắn dần.</p></div></div><article class="card advanced-quiz"><div class="advanced-quiz__meta"><span>Streak <strong>${state.correct}</strong></span><span>Giới hạn <strong>${(limit() / 1000).toFixed(2)}s</strong></span></div>${state.started ? renderTabs({ items: [{ value: "morse", label: "Morse" }, { value: "semaphore", label: "Semaphore" }], activeValue: state.mode, attribute: "data-mode", className: "tabs--compact", panelId: "advanced-panel" }) : ""}<div id="advanced-panel" role="tabpanel" aria-labelledby="tab-${state.mode}"><div class="quiz-timer" aria-label="Thời gian còn lại"><div data-time-meter></div></div><div class="quiz-timer__label" data-time-label>${(limit() / 1000).toFixed(1)}s</div><div class="quiz__signal">${prompt}</div><div class="quiz__options">${options}</div></div></article><dialog class="restart-dialog" data-session-dialog>${dialog}</dialog></div></section>`;
    app.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { state.mode = button.dataset.mode; state.correct = 0; createQuestion(); draw(); }));
    app.querySelectorAll('[role="tab"]').forEach((button) => button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const tabs = [...app.querySelectorAll('[role="tab"]')];
      const currentIndex = tabs.indexOf(button);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(currentIndex + delta + tabs.length) % tabs.length];
      event.preventDefault();
      next.click();
      next.focus();
    }));
    app.querySelectorAll("[data-start-mode]").forEach((button) => button.addEventListener("click", () => {
      state.mode = button.dataset.startMode;
      app.querySelectorAll("[data-start-mode]").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.startMode === state.mode));
    }));
    app.querySelector("[data-start]")?.addEventListener("click", () => { app.querySelector("[data-session-dialog]")?.close(); startGame(); });
    app.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answer(button.dataset.answer)));
    app.querySelector("[data-restart]")?.addEventListener("click", () => { app.querySelector("dialog")?.close(); restart(); });
    if (!state.started) requestAnimationFrame(() => app.querySelector("[data-session-dialog]")?.showModal());
    if (state.started && !state.ended) startTimer();
    if (state.started && state.mode === "morse" && !state.ended) {
      autoPlayTimer = window.setTimeout(() => {
        autoPlayTimer = null;
        playMorseCharacter(state.question.prompt).catch(() => {});
      }, 0);
    }
  }
  draw();
}
