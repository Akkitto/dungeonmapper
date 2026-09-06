# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [0.5.0] - 2026-09-06

### Added
- Added focused development, feature-reference, and sharing documentation while archiving completed roadmap history.
- Added regression coverage for legacy single-map imports and startup migration ordering.

### Changed
- Improved rendering and editing performance by reducing redundant light-FOV work, memoizing fog-visible overlays, avoiding unnecessary tile copies, and optimizing stamp lookup.
- Refreshed `README.md` as a concise landing page while preserving the detailed tool reference in `docs/FEATURES.md`.
- Switched the fork's default development and deployment branch from `main` to `master`.
- Replaced the abbreviated license notice with the full GNU Affero General Public License v3 text and aligned package metadata with `AGPL-3.0-or-later`.
- Set package/release metadata to version `0.5.0`.

### Fixed
- Restored legacy single-map JSON imports by validating the released `tiles` field instead of the nonexistent `cells` field.
- Serialized localStorage migration before IndexedDB restore so migrated saves are available on the first post-upgrade load.
- Hardened dynamic-fog merging and corrected accessibility copy from the post-`0.4.1` upstream changes.

### Security
- Included the post-`0.4.1` transitive dependency audit patches.

## [2026-05-16]

### Added
- `CONTRIBUTING.md` with setup, validation, and PR guidance
- `CODE_OF_CONDUCT.md`
- `docs/ARCHITECTURE.md` and `docs/README.md` for docs navigation
- Issue templates under `.github/ISSUE_TEMPLATE/`
- `PULL_REQUEST_TEMPLATE.md`

### Changed
- README front matter refreshed with badges, quick start, feature highlights, theme gallery, and docs links
- Roadmap updated to mark Phase 12.3 as complete
