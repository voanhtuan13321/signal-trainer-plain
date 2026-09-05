import test from "node:test";
import assert from "node:assert/strict";
import { getAdvancedTimeLimit } from "../src/features/practice/advanced-session.js";

test("advanced practice reduces the time limit and respects the floor", () => {
  assert.equal(getAdvancedTimeLimit(0), 4000);
  assert.equal(getAdvancedTimeLimit(5), 3250);
  assert.equal(getAdvancedTimeLimit(30), 700);
  assert.equal(getAdvancedTimeLimit(100), 700);
});
