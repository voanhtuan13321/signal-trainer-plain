(function () {
  "use strict";

  var namespace = window.SignalTrainer || {};
  var app = namespace.views && namespace.views.app;
  var router = namespace.router;

  if (!app) {
    throw new Error("Không tìm thấy #app.");
  }

  window.addEventListener("hashchange", router.renderRoute);

  router.renderRoute();
})();
