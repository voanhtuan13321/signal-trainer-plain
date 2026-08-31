(function () {
  "use strict";

  var namespace = window.SignalTrainer || {};
  var APP_META = namespace.data.APP_META;
  var MORSE_CODE = namespace.data.MORSE_CODE;
  var MORSE_LETTERS = namespace.data.MORSE_LETTERS;
  var SEMAPHORE_CODE = namespace.data.SEMAPHORE_CODE;
  var SEMAPHORE_IMAGES = namespace.data.SEMAPHORE_IMAGES;
  var playMorseCharacter = namespace.audio.playMorseCharacter;

  var app = document.getElementById("app");
  var currentKeyboardHandler = null;

  function shuffle(items) {
    var result = items.slice();

    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }

  function createChoiceQuestion(config) {
    var entries = Object.entries(config.data);
    var optionCount = config.optionCount || 4;
    var direction = config.direction || "value-to-key";

    if (entries.length < optionCount) {
      throw new Error("Không đủ dữ liệu để tạo quiz.");
    }

    var correctIndex = Math.floor(Math.random() * entries.length);
    var correctEntry = entries[correctIndex];
    var key = correctEntry[0];
    var value = correctEntry[1];
    var isKeyToValue = direction === "key-to-value";
    var answer = isKeyToValue ? value : key;
    var prompt = isKeyToValue ? key : value;

    var distractors = entries
      .filter(function (entry) {
        return entry[0] !== key;
      })
      .map(function (entry) {
        return isKeyToValue ? entry[1] : entry[0];
      });

    return {
      key: key,
      prompt: prompt,
      answer: answer,
      options: shuffle(
        [answer].concat(
          shuffle(distractors).slice(0, optionCount - 1)
        )
      )
    };
  }

  function isCorrectAnswer(question, answer) {
    return question.answer === answer;
  }

  function cleanupKeyboardHandler() {
    if (!currentKeyboardHandler) {
      return;
    }

    document.removeEventListener(
      "keydown",
      currentKeyboardHandler
    );
    currentKeyboardHandler = null;
  }

  function renderSemaphoreImage(character, className) {
    var imagePath = SEMAPHORE_IMAGES[character];

    if (!imagePath) {
      return "";
    }

    return [
      '<img class="',
      className || "semaphore__image",
      '" src="',
      imagePath,
      '" alt="Semaphore ',
      character,
      '">'
    ].join("");
  }

  function renderHome() {
    app.innerHTML = [
      '<section class="hero hero--compact page-enter">',
      '<div class="card hero__content">',
      '<div class="eyebrow">Signal trainer</div>',
      "<h1>Học Morse và Semaphore theo cách gọn nhất.</h1>",
      "<p>Mở bảng học khi cần tra cứu, hoặc vào luyện tập ngay trên điện thoại.</p>",
      '<div class="actions actions--stack">',
      '<a class="button" href="#/practice">Vào luyện tập</a>',
      '<a class="button button--secondary" href="#/learn">Xem bảng tín hiệu</a>',
      "</div>",
      '<div class="release-chip">',
      "v",
      APP_META.version,
      " · ",
      APP_META.releaseDate,
      "</div>",
      "</div>",
      "</section>"
    ].join("");
  }

  function getLearnTabFromHash() {
    var hash = window.location.hash;
    var queryIndex = hash.indexOf("?");

    if (queryIndex === -1) {
      return "morse";
    }

    var params = new URLSearchParams(hash.slice(queryIndex + 1));
    return params.get("tab") === "semaphore"
      ? "semaphore"
      : "morse";
  }

  function renderMorseGrid() {
    var cards = Object.keys(MORSE_CODE)
      .map(function (character) {
        var code = MORSE_CODE[character];

        return [
          '<article class="card alphabet-card">',
          '<div class="alphabet-card__letter">',
          character,
          "</div>",
          '<div class="morse-code">',
          code,
          "</div>",
          '<div class="actions">',
          '<button class="button button--ghost button--small"',
          ' type="button" data-play-morse="',
          code,
          '">▶ Play</button>',
          "</div>",
          "</article>"
        ].join("");
      })
      .join("");

    return [
      '<div class="callout">Timing: dot = 1 unit, dash = 3 units.</div>',
      '<div class="grid grid--alphabet section tab-panel">',
      cards,
      "</div>"
    ].join("");
  }

  function renderSemaphoreGrid() {
    var cards = Object.keys(SEMAPHORE_CODE)
      .map(function (character) {
        return [
          '<article class="card alphabet-card">',
          '<div class="alphabet-card__letter">',
          character,
          "</div>",
          '<div class="semaphore">',
          renderSemaphoreImage(character),
          "</div>",
          "</article>"
        ].join("");
      })
      .join("");

    return [
      '<div class="grid grid--alphabet section tab-panel">',
      cards,
      "</div>"
    ].join("");
  }

  function renderLearn() {
    var activeTab = getLearnTabFromHash();

    function draw() {
      app.innerHTML = [
        "<section>",
        '<div class="page-enter">',
        '<div class="section__header">',
        "<div>",
        '<div class="eyebrow">Reference</div>',
        "<h1>Học bảng tín hiệu</h1>",
        "<p>Chạm để xem nhanh, nghe nhanh rồi quay lại luyện tập.</p>",
        "</div>",
        '<div class="tabs">',
        '<button class="tab ',
        activeTab === "morse" ? "is-active" : "",
        '" type="button" data-tab="morse">Morse</button>',
        '<button class="tab ',
        activeTab === "semaphore" ? "is-active" : "",
        '" type="button" data-tab="semaphore">Semaphore</button>',
        "</div>",
        "</div>",
        activeTab === "morse"
          ? renderMorseGrid()
          : renderSemaphoreGrid(),
        "</div>",
        "</section>"
      ].join("");

      Array.prototype.forEach.call(
        app.querySelectorAll("[data-tab]"),
        function (button) {
          button.addEventListener("click", function () {
            activeTab = button.getAttribute("data-tab");
            draw();
          });
        }
      );

      Array.prototype.forEach.call(
        app.querySelectorAll("[data-play-morse]"),
        function (button) {
          button.addEventListener("click", async function () {
            try {
              button.disabled = true;
              await playMorseCharacter(
                button.getAttribute("data-play-morse")
              );
            } catch (error) {
              window.alert(error.message);
            } finally {
              button.disabled = false;
            }
          });
        }
      );
    }

    draw();
  }

  function renderQuestionPrompt(state) {
    if (state.mode === "semaphore") {
      return [
        '<div class="semaphore">',
        renderSemaphoreImage(
          state.question.key,
          "semaphore__image semaphore__image--prompt"
        ),
        "</div>"
      ].join("");
    }

    return String(state.question.prompt);
  }

  function renderQuestionOptions(state) {
    return state.question.options
      .map(function (option) {
        return [
          '<button class="option" type="button" data-answer="',
          String(option),
          '">',
          String(option),
          "</button>"
        ].join("");
      })
      .join("");
  }

  function renderPractice() {
    var state = {
      mode: "morse",
      direction: "value-to-key",
      question: null,
      answered: false,
      showNextButton: false,
      autoAdvanceTimer: null,
      feedbackMessage: "",
      feedbackClassName: "feedback"
    };

    function createQuestion() {
      if (state.autoAdvanceTimer) {
        window.clearTimeout(state.autoAdvanceTimer);
        state.autoAdvanceTimer = null;
      }

      state.answered = false;
      state.showNextButton = false;
      state.feedbackMessage = "";
      state.feedbackClassName = "feedback";
      state.question = createChoiceQuestion({
        data:
          state.mode === "morse"
            ? MORSE_LETTERS
            : SEMAPHORE_CODE,
        direction:
          state.mode === "morse"
            ? state.direction
            : "value-to-key"
      });
    }

    function submitAnswer(answer) {
      if (state.answered) {
        return;
      }

      state.answered = true;
      var correct = isCorrectAnswer(state.question, answer);

      Array.prototype.forEach.call(
        app.querySelectorAll("[data-answer]"),
        function (button) {
          var buttonAnswer = button.getAttribute("data-answer");
          button.disabled = true;

          if (buttonAnswer === String(state.question.answer)) {
            button.classList.add("is-correct");
          } else if (buttonAnswer === String(answer)) {
            button.classList.add("is-wrong");
          }
        }
      );

      state.feedbackClassName =
        "feedback " +
        (correct ? "feedback--success" : "feedback--danger");
      state.feedbackMessage = correct
        ? "Đúng."
        : "Sai. Đáp án đúng là " + String(state.question.answer) + ".";

      var feedback = document.getElementById("feedback");
      if (feedback) {
        feedback.className = state.feedbackClassName;
        feedback.textContent = state.feedbackMessage;
        feedback.hidden = false;
      }

      var quizFooter = document.getElementById("quiz-footer");
      if (quizFooter) {
        quizFooter.hidden = false;
      }

      if (correct) {
        state.autoAdvanceTimer = window.setTimeout(function () {
          nextQuestion();
        }, 700);
      } else {
        state.showNextButton = true;
        var nextQuestionButton = document.getElementById("next-question");
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

      cleanupKeyboardHandler();
      createQuestion();
      draw();
    }

    function autoPlayQuestion() {
      if (state.mode !== "morse") {
        return;
      }

      window.setTimeout(function () {
        playMorseCharacter(state.question.prompt).catch(function () {});
      }, 0);
    }

    function setMode(mode) {
      if (state.mode === mode) {
        return;
      }

      state.mode = mode;
      cleanupKeyboardHandler();
      createQuestion();
      draw();
    }

    function bindPracticeEvents() {
      Array.prototype.forEach.call(
        app.querySelectorAll("[data-practice-mode]"),
        function (button) {
          button.addEventListener("click", function () {
            setMode(button.getAttribute("data-practice-mode"));
          });
        }
      );

      Array.prototype.forEach.call(
        app.querySelectorAll("[data-answer]"),
        function (button) {
          button.addEventListener("click", function () {
            submitAnswer(button.getAttribute("data-answer"));
          });
        }
      );

      var nextQuestionButton = document.getElementById("next-question");
      if (nextQuestionButton) {
        nextQuestionButton.addEventListener("click", nextQuestion);
      }

      var playButton = document.getElementById("play-question");
      if (playButton) {
        playButton.addEventListener("click", function () {
          if (state.mode === "morse") {
            playMorseCharacter(state.question.prompt).catch(function () {});
          }
        });
      }

      currentKeyboardHandler = function (event) {
        if (["1", "2", "3", "4"].indexOf(event.key) !== -1) {
          if (state.answered) {
            return;
          }

          var option = state.question.options[Number(event.key) - 1];
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
          playMorseCharacter(state.question.prompt).catch(
            function () {}
          );
        }
      };

      document.addEventListener("keydown", currentKeyboardHandler);
      autoPlayQuestion();
    }

    function draw() {
      if (!state.question) {
        createQuestion();
      }

      app.innerHTML = [
        "<section>",
        '<div class="page-enter">',
        '<div class="practice-layout">',
        '<article class="card quiz">',
        '<div class="quiz__controls">',
        '<div class="tabs tabs--compact" role="tablist" aria-label="Chọn chế độ">',
        '<button class="tab ',
        state.mode === "morse" ? "is-active" : "",
        '" type="button" data-practice-mode="morse">Morse</button>',
        '<button class="tab ',
        state.mode === "semaphore" ? "is-active" : "",
        '" type="button" data-practice-mode="semaphore">Semaphore</button>',
        "</div>",
        "</div>",
        '<div class="quiz__prompt">',
        '<div class="quiz__signal">',
        renderQuestionPrompt(state),
        "</div>",
        state.mode === "morse"
          ? '<button class="button button--ghost button--small quiz__play" id="play-question" type="button">Nghe</button>'
          : "",
        "</div>",
        '<div class="quiz__options">',
        renderQuestionOptions(state),
        "</div>",
        '<div class="quiz__footer" id="quiz-footer" ',
        state.feedbackMessage || state.showNextButton
          ? ""
          : "hidden",
        '>',
        '<div id="feedback" class="',
        state.feedbackClassName,
        '" aria-live="polite" ',
        state.feedbackMessage ? "" : "hidden",
        '>',
        state.feedbackMessage,
        "</div>",
        state.showNextButton
          ? '<button class="button button--secondary button--small" id="next-question" type="button">Câu tiếp theo</button>'
          : '<button class="button button--secondary button--small" id="next-question" type="button" hidden disabled>Câu tiếp theo</button>',
        "</div>",
        "</article>",
        "</div>",
        "</div>",
        "</section>"
      ].join("");

      bindPracticeEvents();
    }

    draw();
  }

  function renderNotFound() {
    app.innerHTML = [
      '<section class="card empty-state">',
      '<div class="page-enter">',
      '<div class="eyebrow">404</div>',
      "<h1>Không tìm thấy trang</h1>",
      "<p>Route hiện tại không tồn tại.</p>",
      '<a href="#/" class="button">Về trang chủ</a>',
      "</div>",
      "</section>"
    ].join("");
  }

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.views = {
    app: app,
    cleanupKeyboardHandler: cleanupKeyboardHandler,
    renderHome: renderHome,
    renderLearn: renderLearn,
    renderPractice: renderPractice,
    renderNotFound: renderNotFound
  };
})();
