# Ark UI migration

Scope: replace the current UI in the ark-ui worktree, preserving public URLs,
filesystem security, catalog behavior, search/import behavior, font preview
provider isolation, and layout. Keep React 19, TanStack Start, and Tailwind v4.

- [x] Add behavioral tests for clipboard feedback, keyboard variant selection,
  search field labeling, and provider-scoped font selection.
- [x] Introduce styled Ark button, field, select, clipboard, and progress primitives.
- [x] Migrate all existing pages/components; retain semantic HTML for presentational
  layouts where Ark has no equivalent. Replace daisyUI class names and theme tokens
  with app-owned CSS and Tailwind tokens. Remove daisyUI and unused competing UI deps.
- [x] Update project guidance/docs and verify existing routes/assets and new controls.
- [x] Run bun run test, typecheck, check, and build, then review the migration.

Ark UI is headless; app-owned styles live in src/styles.css. No redesign or new
product behavior is intended. Font/icon assets stay ignored and local to each worktree.

Verification: original 28 tests plus seven DOM interaction tests pass. TypeScript, Biome, and production build pass. Production SSR checks cover home, font details, collection, search and SVG preview, plus real font/CSS/icon endpoints. Independent review found missing lazy thumbnail behavior, fixed with native lazy loading and a layout-preserving Avatar image; regression test covers load/fallback state.

Local ignored asset snapshots were copied into this worktree for development verification; no symlink or shared write directory was introduced. Main checkout remains separate.
