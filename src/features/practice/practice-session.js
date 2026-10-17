import { isCorrectAnswer } from "../../lib/quiz.js";
import { DEFAULT_MODE } from "../signals/modes.js";

/**
 * Regular (untimed) practice state, free of DOM and timers so it can be tested.
 *
 * @param {{ createQuestion: (mode: string) => object, best?: number }} deps
 */
export function createPracticeSession({ createQuestion, best = 0 }) {
  const session = {
    mode: DEFAULT_MODE,
    question: createQuestion(DEFAULT_MODE),
    answered: false,
    selected: null,
    correct: false,
    streak: 0,
    best,
    total: 0,
    correctCount: 0,

    /** Result of the answered question, or null while it is still open. */
    get outcome() {
      if (!session.answered) return null;
      return { correct: session.correct, answer: session.question.answer };
    },

    /** Wrong answers wait for the user; correct ones advance on their own. */
    get showNext() {
      return session.answered && !session.correct;
    },

    /** Visual state of one answer button after the question is answered. */
    resultFor(option) {
      if (!session.answered) return "";
      if (option === session.question.answer) return "correct";
      return option === session.selected ? "wrong" : "";
    },

    next() {
      session.question = createQuestion(session.mode);
      session.answered = false;
      session.selected = null;
      session.correct = false;
    },

    setMode(mode) {
      if (mode === session.mode) return false;
      session.mode = mode;
      session.next();
      return true;
    },

    /** @returns {"ignored" | "correct" | "wrong"} */
    answer(value) {
      if (session.answered) return "ignored";
      session.answered = true;
      session.selected = value;
      session.correct = isCorrectAnswer(session.question, value);
      session.total += 1;
      if (session.correct) {
        session.correctCount += 1;
        session.streak += 1;
        session.best = Math.max(session.best, session.streak);
      } else {
        session.streak = 0;
      }
      return session.correct ? "correct" : "wrong";
    }
  };

  return session;
}
