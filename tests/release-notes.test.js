import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { APP_META } from "../src/data/app-meta.js";
import { extractReleaseNotes, prepareRelease, versionFromTag } from "../scripts/release-notes.mjs";

const CHANGELOG = [
  "# Nhật ký thay đổi",
  "",
  "## [Unreleased]",
  "",
  "## [1.2.0] - 2026-10-17",
  "",
  "### Thêm",
  "- Mới",
  "",
  "## [1.1.0] - 2026-10-12",
  "",
  "### Sửa lỗi",
  "- Cũ",
  ""
].join("\n");

test("versionFromTag reads X.Y.Z and rejects malformed tags", () => {
  assert.equal(versionFromTag("signal-trainer-plain-v1.2.10"), "1.2.10");
  for (const tag of ["v1.2.0", "signal-trainer-plain-v1.2", "signal-trainer-plain-v1.2.0-rc1", "", "other-v1.2.0"]) {
    assert.throws(() => versionFromTag(tag), /must look like/, tag);
  }
});

test("extractReleaseNotes returns only the requested section", () => {
  const notes = extractReleaseNotes(CHANGELOG, "1.2.0");
  assert.equal(notes, "### Thêm\n- Mới");
  assert.ok(!notes.includes("Cũ"));
  assert.equal(extractReleaseNotes(CHANGELOG.replace(/\n/g, "\r\n"), "1.1.0"), "### Sửa lỗi\n- Cũ");
});

test("extractReleaseNotes fails for a missing or empty section", () => {
  assert.throws(() => extractReleaseNotes(CHANGELOG, "9.9.9"), /no notes for version 9.9.9/);
  assert.throws(() => extractReleaseNotes(CHANGELOG, "1.2"), /no notes/);
  assert.throws(() => extractReleaseNotes("## [1.0.0] - 2026-01-01\n\n## [0.9.0] - 2025-12-01\n- x", "1.0.0"), /no notes/);
});

test("prepareRelease requires the tag to match the app version", () => {
  const ok = prepareRelease({ tag: "signal-trainer-plain-v1.2.0", appVersion: "1.2.0", changelog: CHANGELOG });
  assert.deepEqual(ok, { version: "1.2.0", notes: "### Thêm\n- Mới" });
  assert.throws(
    () => prepareRelease({ tag: "signal-trainer-plain-v1.2.1", appVersion: "1.2.0", changelog: CHANGELOG }),
    /does not match APP_META.version/
  );
});

test("the real repository is release-ready for its current version", async () => {
  const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
  const { notes } = prepareRelease({ tag: `signal-trainer-plain-v${APP_META.version}`, appVersion: APP_META.version, changelog });
  assert.match(notes, /^### /);
});
