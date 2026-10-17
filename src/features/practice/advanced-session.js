import { isCorrectAnswer } from "../../lib/quiz.js";

const INITIAL_TIME_LIMIT_MS = 4000;
const TIME_REDUCTION_MS = 150;
const MIN_TIME_LIMIT_MS = 700;

export function getAdvancedTimeLimit(correctCount) {
  return Math.max(MIN_TIME_LIMIT_MS, INITIAL_TIME_LIMIT_MS - correctCount * TIME_REDUCTION_MS);
}

/**
 * Timed practice session state, free of DOM and timers so it can be tested.
 *
 * @param {{ createQuestion: (mode: string) => object, now?: () => number, best?: number }} deps
 */
export function createAdvancedSession({ createQuestion, now = () => performance.now(), best = 0 }) {
  const session = {
    mode: "morse",
    question: null,
    correct: 0,
    best,
    startedAt: 0,
    started: false,
    ended: false,
    reason: "",

    get limit() {
      return getAdvancedTimeLimit(session.correct);
    },

    get remaining() {
      return Math.max(0, session.limit - (now() - session.startedAt));
    },

    /** True while the user still has to pick a mode or restart a finished run. */
    get needsDialog() {
      return !session.started || session.ended;
    },

    nextQuestion() {
      session.question = createQuestion(session.mode);
      session.startedAt = now();
    },

    start() {
      session.started = true;
      session.ended = false;
      session.correct = 0;
      session.reason = "";
      session.nextQuestion();
    },

    /** Switching mode mid-run starts the streak over. */
    setMode(mode) {
      session.mode = mode;
      if (session.started && !session.ended) {
        session.commitBest();
        session.correct = 0;
        session.nextQuestion();
      }
    },

    /** @returns {"ignored" | "correct" | "wrong"} */
    answer(value) {
      if (session.needsDialog) return "ignored";
      if (!isCorrectAnswer(session.question, value)) {
        session.finish("Bạn đã chọn sai đáp án.");
        return "wrong";
      }
      session.correct += 1;
      session.nextQuestion();
      return "correct";
    },

    finish(reason) {
      if (session.ended) return;
      session.ended = true;
      session.reason = reason;
      session.commitBest();
    },

    /** Fold the running streak into the best score (also when leaving mid-run). */
    commitBest() {
      session.best = Math.max(session.best, session.correct);
    },

    /** Back to the start dialog; the best streak is kept. */
    restart() {
      session.started = false;
      session.ended = false;
      session.correct = 0;
      session.question = null;
      session.reason = "";
    }
  };

  return session;
}
