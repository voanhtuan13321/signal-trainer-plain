(function () {
  "use strict";

  var themeToggleButton = document.getElementById("theme-toggle");
  var themeToggleLabel = document.getElementById(
    "theme-toggle-label"
  );

  function getPreferredTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return "dark";
  }

  function applyTheme(theme) {
    var resolvedTheme =
      theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute(
      "data-theme",
      resolvedTheme
    );

    if (themeToggleButton) {
      var nextThemeLabel =
        resolvedTheme === "dark" ? "Dark" : "Light";

      themeToggleButton.classList.toggle(
        "is-light",
        resolvedTheme === "light"
      );
      themeToggleButton.setAttribute(
        "aria-pressed",
        String(resolvedTheme === "light")
      );
      themeToggleButton.setAttribute(
        "aria-label",
        resolvedTheme === "dark"
          ? "Đang ở dark mode, chạm để chuyển sang light mode"
          : "Đang ở light mode, chạm để chuyển sang dark mode"
      );

      if (themeToggleLabel) {
        themeToggleLabel.textContent = nextThemeLabel;
      }
    }
  }

  function toggleTheme() {
    var currentTheme =
      document.documentElement.getAttribute("data-theme") ||
      getPreferredTheme();
    var nextTheme =
      currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    if (
      window.SignalTrainer &&
      window.SignalTrainer.router &&
      typeof window.SignalTrainer.router.renderRoute === "function"
    ) {
      window.SignalTrainer.router.renderRoute();
    }
  }

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.theme = {
    applyTheme: applyTheme,
    getPreferredTheme: getPreferredTheme,
    toggleTheme: toggleTheme,
    themeToggleButton: themeToggleButton
  };
})();
