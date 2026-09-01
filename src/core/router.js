import { renderHome } from "../features/home.js";
import { renderLearn } from "../features/learn/learn-view.js";
import {
  cleanupPracticeKeyboardHandler,
  renderPractice
} from "../features/practice/practice-view.js";
import { renderNotFound } from "../features/not-found.js";

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
    "/practice": () => renderPractice(app)
  };

  function renderRoute() {
    // Practice owns a document-level keyboard handler, so route changes must
    // release it before rendering a different screen.
    cleanupPracticeKeyboardHandler();

    const rawHash = window.location.hash.slice(1) || "/";
    const path = rawHash.split("?")[0];
    const render = routes[path] || (() => renderNotFound(app));

    // Route state belongs on body so layout rules can react without rebuilding
    // the persistent header and navigation markup.
    document.body.classList.remove("route-home", "route-learn", "route-practice");
    document.body.classList.add(
      path === "/" ? "route-home" : `route-${path.slice(1) || "not-found"}`,
    );

    render();

    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === path);
    });

    // Restart the page-enter animation on hash navigation without changing markup.
    app.classList.remove("page-enter");
    void app.offsetWidth;
    app.classList.add("page-enter");

    // Mobile Safari may keep the scroll offset on both scrolling roots. Reset
    // both explicitly so the persistent header is never left above the viewport.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  return { renderRoute };
}
