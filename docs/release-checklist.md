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
- Create a tag like `signal-trainer-plain-vX.Y.Z`
- Push `main`
- Push the tag

## GitHub Release

- Pushing the tag runs the `Release` workflow, which creates the GitHub Release automatically
  (title `vX.Y.Z`, notes taken from the matching `CHANGELOG.md` section)
- The workflow fails if the tag version differs from `APP_META.version` or the changelog section is missing
- Check that title, version, and date all match
- For an existing tag, run the workflow manually from the Actions tab and enter the tag name

## After Release

- Wait for GitHub Pages deployment to finish
- Open the live site and verify the version shown in the UI
- Create a fresh `Unreleased` section if needed for the next cycle
