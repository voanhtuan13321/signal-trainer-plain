import test from "node:test";
import assert from "node:assert/strict";
import { parseChangelog } from "../src/lib/changelog.js";
import { renderVersionBadge } from "../src/components/VersionBadge.js";
import { renderReleaseCard } from "../src/components/ReleaseCard.js";
import { renderReleaseTimeline } from "../src/components/ReleaseTimeline.js";

test("parseChangelog keeps the newest release first", () => {
  const releases = parseChangelog("## [0.2.0] - 2026-09-01\n\n### Thêm\n- Tính năng mới");
  assert.equal(releases[0].version, "0.2.0");
  assert.deepEqual(releases[0].changes.added, ["Tính năng mới"]);
});

test("version badge links to the updates page", () => {
  const html = renderVersionBadge({ version: "0.2.0", date: "2026-09-01" });
  assert.match(html, /href="#\/updates"/);
  assert.match(html, /v0\.2\.0/);
});

test("release card renders change groups", () => {
  const html = renderReleaseCard({ version: "0.2.0", date: "2026-09-01", changes: { added: ["A"], changed: ["B"], fixed: ["C"] } });
  assert.match(html, /Thêm/);
  assert.match(html, /Thay đổi/);
  assert.match(html, /Sửa lỗi/);
});

test("release timeline wraps releases in timeline items", () => {
  const html = renderReleaseTimeline([{ version: "0.2.0", date: "2026-09-01", changes: {} }]);
  assert.match(html, /release-timeline/);
  assert.match(html, /release-timeline__item/);
});
