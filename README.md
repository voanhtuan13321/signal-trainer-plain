# Signal Trainer

Signal Trainer is a small mobile-first static web app for learning Morse and Semaphore.

## Live Site

- GitHub Pages: [https://voanhtuan13321.github.io/signal-trainer-plain/](https://voanhtuan13321.github.io/signal-trainer-plain/)

## Project Structure

- `index.html`: app shell
- `styles/`: split CSS files
- `src/core/`: app bootstrap and router
- `src/data/`: current app metadata and static signal dictionaries
- `src/audio/`: Morse Web Audio playback
- `src/features/`: screen-level feature modules
- `src/ui/`: shared rendering and quiz helpers
- `public/assets/semaphore/`: per-letter Semaphore images
- `version.json`: current release version metadata
- `CHANGELOG.md`: release history

## Local Run

GitHub Pages supports native ES modules, so the production site can stay build-free.
For local development, serve the folder over HTTP because browsers restrict ES module
imports opened through `file://`.

```bash
node scripts/dev-server.mjs
```

Then open [http://localhost:8000](http://localhost:8000).

## Release Workflow

1. Update `version.json`
2. Update `src/data/signals.js` app metadata so the in-app version matches the release
3. Move release notes from `Unreleased` into a new version section in `CHANGELOG.md`
4. Commit the release changes
5. Create and push a git tag
6. Create a GitHub Release using the changelog content
7. Wait for GitHub Pages to finish deploying

## Suggested Release Commands

```bash
git add .
git commit -m "release: v0.1.0"
git tag signal-trainer-plain-v0.1.0
git push origin main
git push origin signal-trainer-plain-v0.1.0
```

## Tag Format

Use this release tag format:

- `signal-trainer-plain-v0.1.0`

This keeps the project name and version together so release tags stay unambiguous.

## Release Notes Format

Use this short structure:

- `Added`: new features or screens
- `Changed`: UI or behavior updates
- `Fixed`: bug fixes and regressions

## Release Checklist

See [docs/release-checklist.md](docs/release-checklist.md) for the step-by-step checklist before tagging a release.

## Versioning

This project currently uses a simple semantic version style:

- `MAJOR`: breaking or structural changes
- `MINOR`: new features
- `PATCH`: fixes only
