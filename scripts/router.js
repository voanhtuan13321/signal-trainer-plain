(function () {
  "use strict";

  var views = window.SignalTrainer.views;

  var routes = {
    "/": views.renderHome,
    "/learn": views.renderLearn,
    "/practice": views.renderPractice
  };

  function renderRoute() {
    views.cleanupKeyboardHandler();

    var rawHash = window.location.hash.slice(1) || "/";
    var path = rawHash.split("?")[0];
    var render = routes[path] || views.renderNotFound;

    render();

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-nav]"),
      function (link) {
        link.classList.toggle(
          "is-active",
          link.getAttribute("data-nav") === path
        );
      }
    );

    if (views.app) {
      views.app.classList.remove("page-enter");
      void views.app.offsetWidth;
      views.app.classList.add("page-enter");
    }

    window.scrollTo(0, 0);
  }

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.router = {
    renderRoute: renderRoute
  };
})();
