# Signal Trainer

Signal Trainer is a small mobile-first static web app for learning Morse and Semaphore.

## Live Site

- GitHub Pages: [https://voanhtuan13321.github.io/signal-trainer-plain/](https://voanhtuan13321.github.io/signal-trainer-plain/)

## Project Structure

- `index.html`: app shell
- `styles/`: split CSS files
- `src/main.js`: application entry point
- `src/app/`: router and application-level setup
- `src/pages/`: route-level screens (`HomePage`, `LearnPage`, `PracticePage`)
- `src/pages/UpdatesPage.js`: version changelog screen at `#/updates`
- `src/pages/AdvancedPracticePage.js`: timed high-speed practice, opened from the regular Practice page
- `src/components/`: UI grouped into `common`, `learn`, `practice`, and `updates`
- `src/lib/`: framework-independent helpers (quiz, changelog, escaping, HTML attributes, keyboard, SVG)
- `src/features/practice/`: pure practice session state (`practice-session`, `advanced-session`)
- `src/features/signals/`: signal `modes` (Morse, Semaphore) and prompt audio shared by Learn and Practice
- `src/data/`: domain data split into `app-meta.js`, `morse.js`, and `semaphore.js`
- `src/services/`: browser services such as Morse Web Audio playback
- `src/lib/semaphore-svg.js`: vector Semaphore renderer
- `tests/`: Node.js built-in tests for framework-independent logic
- `src/data/app-meta.js`: current release version metadata
- `CHANGELOG.md`: release history

## Code Conventions

- Pages: `render*(app)` draws into `app` and returns an optional cleanup function; the router calls it before the next route. Pages bind listeners once on `app` (event delegation) and redraw from state.
- Components: `render*` functions return HTML strings. Plain-text params are escaped; markup params are named `*Html`; extra attributes are passed as `attrs` objects.
- Files: components use PascalCase (`Button.js`); logic modules use kebab-case (`tabs-behavior.js`).

## Local Run

GitHub Pages supports native ES modules, so the production site can stay build-free.
For local development, serve the folder over HTTP because browsers restrict ES module
imports opened through `file://`.

```bash
node scripts/dev-server.mjs
```

Then open [http://localhost:8000](http://localhost:8000).


## Release Workflow

1. Update `src/data/app-meta.js` with the new version and release date
2. Move release notes from `Unreleased` into a new version section in `CHANGELOG.md`
3. Run `npm test`
4. Commit the release changes
5. Create and push a git tag
6. Create a GitHub Release using the changelog content
7. Wait for GitHub Pages to finish deploying

## Suggested Release Commands

```bash
git add .
git commit -m "release: vX.Y.Z"
git tag signal-trainer-plain-vX.Y.Z
git push origin main
git push origin signal-trainer-plain-vX.Y.Z
```

## Tag Format

Use this release tag format:

- `signal-trainer-plain-vX.Y.Z` (for example `signal-trainer-plain-v1.1.0`)

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
