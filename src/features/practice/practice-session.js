import { isCorrectAnswer } from "../../lib/quiz.js";
import { DEFAULT_MODE } from "../signals/modes.js";

/**
 * Regular (untimed) practice state, free of DOM and timers so it can be tested.
 *
 * @param {{ createQuestion: (mode: string) => object }} deps
 */
export function createPracticeSession({ createQuestion }) {
  const session = {
    mode: DEFAULT_MODE,
    question: createQuestion(DEFAULT_MODE),
    answered: false,
    selected: null,
    correct: false,

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
      return session.correct ? "correct" : "wrong";
    }
  };

  return session;
}
