# Signal Trainer

Signal Trainer is a small mobile-first static web app for learning Morse and Semaphore.

## Live Site

- GitHub Pages: [https://voanhtuan13321.github.io/signal-trainer-plain/](https://voanhtuan13321.github.io/signal-trainer-plain/)

## Project Structure

- `index.html`: app shell
- `styles/`: split CSS files
- `scripts/`: split JavaScript files
- `assets/semaphore/`: per-letter Semaphore images
- `scripts/data.js`: current app metadata and static dictionaries
- `version.json`: current release version metadata
- `CHANGELOG.md`: release history

## Local Run

Because this is a plain static site, you can:

1. Open `index.html` directly, or
2. Serve the folder with any static server

## Release Workflow

1. Update `version.json`
2. Update `scripts/data.js` app metadata so the in-app version matches the release
3. Move release notes from `Unreleased` into a new version section in `CHANGELOG.md`
4. Commit the release changes
5. Create and push a git tag
6. Create a GitHub Release using the changelog content
7. Wait for GitHub Pages to finish deploying

## Suggested Release Commands

```bash
git add .
git commit -m "release: v0.1.0"
git tag v0.1.0
git push origin main
git push origin v0.1.0
```

## Release Notes Format

Use this short structure:

- `Added`: new features or screens
- `Changed`: UI or behavior updates
- `Fixed`: bug fixes and regressions

## Release Checklist

See [scripts/release-checklist.md](D:\workspace\projects\signal-trainer-plain\scripts\release-checklist.md) for the step-by-step checklist before tagging a release.

## Versioning

This project currently uses a simple semantic version style:

- `MAJOR`: breaking or structural changes
- `MINOR`: new features
- `PATCH`: fixes only
