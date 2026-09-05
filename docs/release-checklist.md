# Release Checklist

## Before Release

- Confirm the app opens and the main flows still work
- Check GitHub Pages link still loads
- Update `src/data/app-meta.js`
- Update `src/data/app-meta.js` app metadata
- Move notes from `Unreleased` to a new version block in `CHANGELOG.md`
- Review `README.md` if setup or links changed

## Tagging

- Run `git status`
- Commit release files with a message like `release: v0.1.0`
- Create a tag like `signal-trainer-plain-v0.1.0`
- Push `main`
- Push the tag

## GitHub Release

- Create a new GitHub Release from the tag
- Paste the matching section from `CHANGELOG.md`
- Check that title, version, and date all match

## After Release

- Wait for GitHub Pages deployment to finish
- Open the live site and verify the version shown in the UI
- Create a fresh `Unreleased` section if needed for the next cycle
