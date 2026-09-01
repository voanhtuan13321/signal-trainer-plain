# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, adapted to the needs of this project.

## [0.2.0] - 2026-09-01

### Added
- Release process documentation and in-app version display.
- Native ES module architecture for the GitHub Pages app.
- Local Node.js development server for testing ES modules over HTTP.
- Friendly Morse autoplay fallback when browsers block audio before a user gesture.

### Changed
- Split application code into core, data, audio, feature, and UI modules.
- Moved Semaphore assets to `public/assets/semaphore/`.
- Standardized generated markup on template literals.
- Removed unused theme and settings code, keeping the app light-mode only.
- Improved mobile Home and Practice layout to avoid unnecessary scrolling.

### Fixed
- Fixed route lifecycle cleanup for the Practice keyboard handler.
- Fixed local asset paths and release checklist documentation paths.

## [0.1.0] - 2026-08-31

### Added
- Mobile-first Signal Trainer UI for learning and practicing Morse and Semaphore.
- Semaphore image assets for each letter from `A` to `Z`.
- GitHub Pages-ready static structure using plain HTML, CSS, and JavaScript.
- Release scaffolding with `CHANGELOG.md`, `README.md`, `version.json`, and `.github/release.yml`.

### Changed
- Simplified the home and practice flows for phone-first usage.
- Switched Semaphore rendering from generated SVG to image-based assets.
- Locked the app to light mode only.

### Fixed
- Practice footer now appears only when needed.
- Git line-ending behavior is pinned with `.gitattributes`.
