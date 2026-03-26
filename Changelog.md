# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0] - 2026-03-26

### Changed

- Switched the build pipeline from `rollup-plugin-typescript2` transpilation to a `tsc` plus Rollup flow.
- Updated the published JavaScript target from `ES5` to `ES2018`.
- Updated dependencies to newer major versions, including `bson` `7.2.0`.
- Added a dedicated watch script for the new build flow.

### Breaking Changes

- The published runtime output is no longer transpiled to `ES5`.
- Consumer runtime compatibility may be narrower than in `v1.x`, especially on older Node.js versions.

## [v1.2.13] - 2025-12-08

### Changed

- Updated dependencies to the latest versions.
- Updated metadata.

### Added

- Example script.

## [v1.2.12] - 2025-07-09

### Changed

- Updated peer dependencies.

## [v1.2.11] - 2025-07-09

### Added

- Added a `CHANGELOG.md` file to document changes in the project.

### Changed

- Updated dependencies to the latest versions.
- Updated metadata.
