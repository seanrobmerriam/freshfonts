# Icon Search Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users find, preview, and add theSVG icons to the shared catalog from a separate page.
**Architecture:** TanStack server functions call a server-only registry/search and CLI import service. The page submits searches and imports, then invalidates catalog loaders after success.
**Tech Stack:** Bun, React 19, TanStack Start, Node filesystem/process APIs, @thesvg/cli.
**Spec:** docs/superpowers/specs/2026-11-10-icon-search-design.md

## Global Constraints
- Keep filesystem and subprocess work in server handlers/functions.
- Preserve existing asset URLs, validation, MIME types, CORS, and caching.
- Never overwrite existing icons; use only variants reported by the registry.
- Run bun run test, bun run typecheck, bun run check, and bun run build.

## Review Focus
- Unsupported variants must not silently fall back to default.
- Existing files and simultaneous imports must not be overwritten.
- Malformed upstream metadata and failed downloads must produce actionable errors.
- Stale search responses must not replace newer results.
- Search page navigation must not conflict with collection or asset routes.

### Task 1: Search and import service
**Files:** package.json, bun.lock, src/lib/icons/thesvg.server.ts, src/lib/icons/thesvg.ts, src/lib/icons/search.functions.ts, tests/icon_search.test.ts
**Interfaces:** searchIcons(query) returns bounded structured metadata; addIcon({slug,variant}) returns a local URL and added/existing status.
- [x] Write and run failing tests for query filtering, metadata validation, invalid slugs/variants, no-clobber imports, and failed CLI downloads.
- [x] Install @thesvg/cli with Bun. Implement fixed-registry fetching, search, and temporary-directory subprocess imports with exclusive destination creation.
- [x] Add validated GET/POST server functions; verify tests.

### Task 2: Search page and catalog link
**Files:** src/routes/icon-search.tsx, src/components/IconList.tsx, tests/asset_routes.test.ts
**Interfaces:** `/icon-search` consumes server functions; successful Add invalidates router loaders.
- [x] Add an integration assertion for the separate search page and homepage link and observe failure.
- [x] Implement accessible search, loading/error/empty states, preview cards, available-variant selectors, Add/Added states and collection navigation. Guard against stale results.
- [x] Verify page routing, real upstream search, actual CLI import, and catalog discovery; clean up test imports.
- [x] Run all required checks and review changes.

Verification: 28 tests passed; typecheck, Biome check, and production build passed. Live production server functions verified registry search, CLI variant download, served SVG, catalog discovery, installed-state refresh, duplicate preservation, and cross-site POST rejection. Temporary verification imports were removed.

Final review: independent reviewer identified SVG document isolation as important; imported SVG responses now carry a sandbox CSP. The regression test failed without the header and passes with it. Added explicit nondefault-variant CLI fallback coverage. Authentication/public-write policy follows the approved shared-catalog scope; existing deployment layout is retained and runtime CLI dependency requirements are documented. Upstream license text is displayed without attempting to adjudicate it.
