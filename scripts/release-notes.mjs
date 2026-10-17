/**
 * Release helper used by the release workflow and tests.
 *
 * Usage: node scripts/release-notes.mjs <tag> [output-file]
 *
 * Fails (exit code 1) when the tag is malformed, differs from
 * APP_META.version, or CHANGELOG.md has no section for that version. On
 * success it writes that section to `output-file`, or stdout when omitted.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { APP_META } from "../src/data/app-meta.js";

export const TAG_PREFIX = "signal-trainer-plain-v";

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

/** Version number of a release tag such as `signal-trainer-plain-v1.2.1`. */
export function versionFromTag(tag) {
  const version = String(tag).startsWith(TAG_PREFIX) ? String(tag).slice(TAG_PREFIX.length) : "";
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`Tag "${tag}" must look like ${TAG_PREFIX}X.Y.Z`);
  }
  return version;
}

/** Body of the `## [version]` section, without the heading. */
export function extractReleaseNotes(markdown, version) {
  const header = `## [${version}]`;
  const notes = [];
  let found = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith(header)) {
      found = true;
    } else if (line.startsWith("## [")) {
      if (found) break;
    } else if (found) {
      notes.push(line);
    }
  }

  const text = notes.join("\n").trim();
  if (!text) throw new Error(`CHANGELOG.md has no notes for version ${version}`);
  return text;
}

/** Validate a release and return its version and notes. */
export function prepareRelease({ tag, appVersion, changelog }) {
  const version = versionFromTag(tag);
  if (version !== appVersion) {
    throw new Error(`Tag version ${version} does not match APP_META.version ${appVersion}`);
  }
  return { version, notes: extractReleaseNotes(changelog, version) };
}

async function main([tag, outputFile]) {
  if (!tag) throw new Error("Usage: node scripts/release-notes.mjs <tag> [output-file]");
  const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
  const { version, notes } = prepareRelease({ tag, appVersion: APP_META.version, changelog });

  if (outputFile) {
    await writeFile(outputFile, `${notes}\n`);
    console.log(`Release ${version}: notes written to ${outputFile}`);
  } else {
    console.log(notes);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`::error::${error.message}`);
    process.exit(1);
  });
}
