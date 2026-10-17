# Release Checklist

## Before Release

- Confirm the app opens and the main flows still work
- Check GitHub Pages link still loads
- Update `src/data/app-meta.js` (version and release date)
- Run `npm test`
- Move notes from `Unreleased` to a new version block in `CHANGELOG.md`
- Review `README.md` if setup or links changed

## Tagging

- Run `git status`
- Commit release files with a message like `release: vX.Y.Z`
- Push `main`
- Create an annotated tag like `signal-trainer-plain-vX.Y.Z` on that commit
- Push the tag

## GitHub Release

- Pushing the tag runs the `Deploy Pages & Release on Tag` workflow: verify -> test -> build -> deploy -> release.
  Each job waits for the previous one, so the GitHub Release is only created after the site is deployed
  (title `vX.Y.Z`, notes taken from the matching `CHANGELOG.md` section)
- `verify` runs first and stops everything (nothing is deployed) if the tag is malformed, its commit is not on `main`,
  the tag version differs from `APP_META.version`, or the changelog section is missing
- Dry-run the same check locally: `node scripts/release-notes.mjs signal-trainer-plain-vX.Y.Z`
- Check that title, version, and date all match
- To refresh an existing tag, run the workflow manually from the Actions tab with that tag as the "Use workflow from" ref (this redeploys that version too)

## After Release

- Wait for GitHub Pages deployment to finish
- Open the live site and verify the version shown in the UI
- Create a fresh `Unreleased` section if needed for the next cycle
