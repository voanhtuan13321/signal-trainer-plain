import { createRouter } from "./app/router.js";

/**
 * Application bootstrap.
 *
 * The app intentionally has a single module entry point so index.html does not
 * depend on script ordering. Feature modules declare their own imports instead.
 */
const app = document.getElementById("app");

if (!app) {
  throw new Error("Không tìm thấy #app.");
}

const router = createRouter(app);

// Only navigation after load moves focus; the first render keeps the browser default.
window.addEventListener("hashchange", () => router.renderRoute({ moveFocus: true }));
router.renderRoute();
