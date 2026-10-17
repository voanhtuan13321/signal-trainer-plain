import { renderHome } from "../pages/HomePage.js";
import { renderLearn } from "../pages/LearnPage.js";
import { renderPractice } from "../pages/PracticePage.js";
import { renderNotFound } from "../pages/NotFoundPage.js";
import { renderUpdates } from "../pages/UpdatesPage.js";
import { renderAdvancedPractice } from "../pages/AdvancedPracticePage.js";
import { clearRouteClasses, resolveRoute } from "./route-utils.js";

/**
 * Create the hash router for this single-page static app.
 *
 * Hash routes keep GitHub Pages deployment simple because every navigation still
 * requests index.html from the server.
 *
 * Every route function renders into `app` and may return a cleanup function
 * (listeners, timers, audio). The router calls it before the next render, so
 * pages never register themselves with the router.
 */
export function createRouter(app) {
  const routes = {
    "/": () => renderHome(app),
    "/learn": () => renderLearn(app),
    "/practice": () => renderPractice(app),
    "/updates": () => renderUpdates(app),
    "/advanced-practice": () => renderAdvancedPractice(app)
  };

  let cleanup = null;

  function renderRoute() {
    cleanup?.();
    cleanup = null;

    const { path, known, className } = resolveRoute(window.location.hash, routes);
    const render = known ? routes[path] : () => renderNotFound(app);

    // Route state belongs on body so layout rules can react without rebuilding
    // the persistent header and navigation markup.
    clearRouteClasses(document.body);
    document.body.classList.add(className);

    cleanup = render() || null;

    document.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.getAttribute("data-nav") === path;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    // Mobile Safari may keep the scroll offset on both scrolling roots. Reset
    // both explicitly so the persistent header is never left above the viewport.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  return { renderRoute };
}
