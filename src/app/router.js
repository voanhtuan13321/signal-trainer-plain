import { renderHome } from "../pages/HomePage.js";
import { renderLearn } from "../pages/LearnPage.js";
import {
  cleanupPractice,
  renderPractice
} from "../pages/PracticePage.js";
import { renderNotFound } from "../pages/NotFoundPage.js";
import { renderUpdates } from "../pages/UpdatesPage.js";
import { clearRouteClasses, resolveRoute } from "./route-utils.js";
import { cleanupAdvancedPractice, renderAdvancedPractice } from "../pages/AdvancedPracticePage.js";

/**
 * Create the hash router for this single-page static app.
 *
 * Hash routes keep GitHub Pages deployment simple because every navigation still
 * requests index.html from the server.
 */
export function createRouter(app) {
  const routes = {
    "/": () => renderHome(app),
    "/learn": () => renderLearn(app),
    "/practice": () => renderPractice(app),
    "/updates": () => renderUpdates(app),
    "/advanced-practice": () => renderAdvancedPractice(app)
  };

  function renderRoute() {
    // Practice owns a document-level keyboard handler, so route changes must
    // release it before rendering a different screen.
    cleanupPractice();
    cleanupAdvancedPractice();

    const { path, known, className } = resolveRoute(window.location.hash, routes);
    const render = known ? routes[path] : () => renderNotFound(app);

    // Route state belongs on body so layout rules can react without rebuilding
    // the persistent header and navigation markup.
    clearRouteClasses(document.body);
    document.body.classList.add(className);

    render();

    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === path);
    });

    // Mobile Safari may keep the scroll offset on both scrolling roots. Reset
    // both explicitly so the persistent header is never left above the viewport.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  return { renderRoute };
}
