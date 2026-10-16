import test from "node:test";
import assert from "node:assert/strict";
import { fetchChangelog, parseChangelog } from "../src/lib/changelog.js";
import { APP_META } from "../src/data/app-meta.js";
import { renderVersionBadge } from "../src/components/updates/VersionBadge.js";
import { renderReleaseCard } from "../src/components/updates/ReleaseCard.js";
import { renderReleaseTimeline, renderReleaseTimelineSkeleton } from "../src/components/updates/ReleaseTimeline.js";

test("parseChangelog preserves document order", () => {
  const releases = parseChangelog("## [0.2.0] - 2026-09-01\n\n## [0.1.0] - 2026-08-01");
  assert.deepEqual(releases.map((release) => release.version), ["0.2.0", "0.1.0"]);
});

test("parseChangelog does not merge items under unrecognised headings", () => {
  const releases = parseChangelog([
    "## [0.2.0] - 2026-09-01", "### Added", "- A",
    "## [0.3.0-beta] - 2026-09-02", "### Added", "- Beta item",
    "## [0.1.0] - 2026-08-01", "### Added", "- B", "### Notes", "- Stray"
  ].join("\n"));
  assert.deepEqual(releases.map((release) => release.version), ["0.2.0", "0.1.0"]);
  assert.deepEqual(releases[0].changes.added, ["A"]);
  assert.deepEqual(releases[1].changes.added, ["B"]);
});

test("the real CHANGELOG.md parses newest-first and matches APP_META", async () => {
  const { readFile } = await import("node:fs/promises");
  const releases = parseChangelog(await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8"));
  assert.ok(releases.length > 0);
  assert.equal(releases[0].version, APP_META.version);
  assert.equal(releases[0].date, APP_META.releaseDate);
  const dates = releases.map((release) => release.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test("parseChangelog parses a release and its change groups", () => {
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

test("release card escapes changelog content", () => {
  const html = renderReleaseCard({ version: "0.2.0", date: "2026-09-01", changes: { added: ["<script>alert(1)</script>"] } });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test("release timeline skeleton renders loading cards", () => {
  const html = renderReleaseTimelineSkeleton();
  assert.match(html, /release-timeline--skeleton/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /release-card--skeleton/);
});

test("release timeline wraps releases in timeline items", () => {
  const html = renderReleaseTimeline([{ version: "0.2.0", date: "2026-09-01", changes: {} }]);
  assert.match(html, /release-timeline/);
  assert.match(html, /release-timeline__item/);
});

test("fetchChangelog keeps cache entries separate by URL", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return { ok: true, text: async () => `## [0.0.${calls.length}] - 2026-09-0${calls.length}` };
  };
  try {
    await fetchChangelog("/one.md");
    await fetchChangelog("/one.md");
    await fetchChangelog("/two.md");
    assert.deepEqual(calls, ["/one.md", "/two.md"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
