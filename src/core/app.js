import { createRouter } from "./router.js";

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

window.addEventListener("hashchange", router.renderRoute);
router.renderRoute();
