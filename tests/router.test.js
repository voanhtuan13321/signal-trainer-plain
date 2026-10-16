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
