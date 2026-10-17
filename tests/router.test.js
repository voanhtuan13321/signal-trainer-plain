import test from "node:test";
import assert from "node:assert/strict";
import { clearRouteClasses, resolveRoute } from "../src/app/route-utils.js";

const routes = { "/": 1, "/learn": 1, "/advanced-practice": 1 };

test("resolveRoute maps known paths to body classes", () => {
  assert.deepEqual(resolveRoute("", routes), { path: "/", known: true, className: "route-home" });
  assert.equal(resolveRoute("#/learn?tab=semaphore", routes).className, "route-learn");
  assert.equal(resolveRoute("#/advanced-practice", routes).className, "route-advanced-practice");
});

test("resolveRoute maps unknown paths to route-not-found", () => {
  assert.equal(resolveRoute("#/foo/bar", routes).className, "route-not-found");
  assert.equal(resolveRoute("#/toString", routes).known, false);
});

test("clearRouteClasses removes every route class and nothing else", () => {
  const classes = new Set(["route-updates", "route-advanced-practice", "other"]);
  const element = {
    get classList() {
      const list = { [Symbol.iterator]: () => classes.values(), remove: (name) => classes.delete(name) };
      return list;
    }
  };
  clearRouteClasses(element);
  assert.deepEqual([...classes], ["other"]);
});

/* ---- createRouter: titles and the error screen ---- */

function stubBrowser(hash) {
  const body = { classList: { add() {}, remove() {}, [Symbol.iterator]: () => [].values() } };
  globalThis.window = { location: { hash }, localStorage: undefined, scrollTo() {} };
  globalThis.document = { title: "", body, documentElement: {}, querySelectorAll: () => [] };
}

function stubApp({ failFirstWrite = false } = {}) {
  let failed = !failFirstWrite;
  return {
    html: "",
    focused: false,
    focus() { this.focused = true; },
    set innerHTML(value) {
      if (!failed) { failed = true; throw new Error("boom"); }
      this.html = value;
    },
    get innerHTML() { return this.html; }
  };
}

test("router sets a per-route document title", async () => {
  const { createRouter } = await import("../src/app/router.js");
  try {
    stubBrowser("#/");
    createRouter(stubApp()).renderRoute();
    assert.equal(document.title, "Signal Trainer");

    stubBrowser("#/nope");
    createRouter(stubApp()).renderRoute();
    assert.equal(document.title, "Không tìm thấy trang · Signal Trainer");
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("router shows the error screen and error title when a page throws", async () => {
  const { createRouter } = await import("../src/app/router.js");
  const originalError = console.error;
  console.error = () => {};
  try {
    stubBrowser("#/nope");
    const app = stubApp({ failFirstWrite: true });
    createRouter(app).renderRoute({ moveFocus: true });
    assert.match(app.html, /Đã xảy ra lỗi/);
    assert.equal(document.title, "Lỗi · Signal Trainer");
    assert.equal(app.focused, true);
  } finally {
    console.error = originalError;
    delete globalThis.window;
    delete globalThis.document;
  }
});
