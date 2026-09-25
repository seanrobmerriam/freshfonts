# AGENTS.md — fresh-icon-font

Self-hosted font and SVG icon server built with Deno Fresh 2 (Vite plugin). Drop font files into `./assets/fonts/<family>/` and SVG files into `./assets/icons/<collection>/` and the server exposes them via CSS embed endpoints and direct file routes.

## Tech stack

- **Deno** with `nodeModulesDir: "manual"` (npm deps live in `node_modules/`)
- **Fresh 2** (`jsr:@fresh/core`) via `@fresh/plugin-vite`
- **Vite 7** dev server / bundler (`vite.config.ts` at repo root)
- **Preact** with `jsx: "precompile"` (NOT classic JSX transform)
- **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`) + **daisyUI v5** plugin
- **TypeScript** via Deno's built-in type-checker

## Commands

All tasks are run via `deno task`:

| Task | Command | Purpose |
| --- | --- | --- |
| `dev` | `deno task dev` | Vite dev server with HMR (CSS hot reload imports `assets/styles.css` from `client.ts`) |
| `build` | `deno task build` | Production build to `_fresh/` |
| `start` | `deno task start` | Serve the built app via `deno serve -A _fresh/server.js` |
| `check` | `deno task check` | `deno fmt --check` + `deno lint` + `deno check` — run before commits |
| `update` | `deno task update` | `jsr:@fresh/update .` — upgrade Fresh framework files |

Other useful commands:
- `deno test` — runs all `tests/*_test.ts` files
- `deno fmt` / `deno lint` — formatting and linting (fresh + recommended rule tags)

## Directory layout

```
assets/
  fonts/<family-slug>/<weight>[-italic].woff2   # e.g. assets/fonts/inter/400.woff2
  icons/<collection-slug>/*.svg
  styles.css                                    # Tailwind + daisyUI import (loaded via client.ts)

components/    # Preact components (server-rendered, no client islands). Plain `.tsx`, PascalCase.
islands/       # Empty. Reserved for future client-side interactive components.
lib/
  fonts/
    types.ts        # FontStyle, FontVariant, FontFamily
    parser.ts       # parseFontFilename() — regex `/^([1-9]00)(-italic)?\.woff2$/`
    registry.ts     # getFonts() — scans DEFAULT_FONT_DIRECTORY
    css.ts          # generateFontCss() — builds @font-face blocks
    query.ts        # parseFontQuery(), selectFontVariants(), familyNameToSlug()
  icons/
    types.ts        # Icon, IconSet
    registry.ts     # getIconSets() — scans DEFAULT_ICON_DIRECTORY

routes/
  _app.tsx                        # Root <html> shell (title="fresh-icon-font")
  index.tsx                       # Home page — calls getFonts() + getIconSets() in parallel
  css.ts                          # Google-Fonts-style CSS endpoint (?family=Name:400,700)
  fonts/[family].css.ts           # Single-family CSS (all variants)
  fonts/[family]/[file].ts        # Serves individual .woff2 files
  icons/[collection]/[file].ts    # Serves individual .svg files
  api/[name].tsx                  # Demo endpoint (Hello, ${Name})
  api/fonts.ts, api/icons.ts      # Empty stubs

tests/                            # Unit tests for lib/* modules

main.ts        # App entrypoint — App<State>, staticFiles(), example middleware, app.fsRoutes()
client.ts      # Imports assets/styles.css for HMR — DO NOT delete this side-effect import
utils.ts       # createDefine<State>() — defines the ctx.state type for the app
vite.config.ts # Vite plugins: fresh() + tailwindcss()
```

## Architecture & data flow

1. `main.ts` boots `App<State>` with `staticFiles()` middleware and `app.fsRoutes()` which auto-registers everything in `routes/`.
2. `routes/index.tsx` server-renders the home page. It calls `getFonts()` and `getIconSets()` in parallel and passes results to `FontList` and `IconList` components.
3. The registries in `lib/*/registry.ts` scan the `assets/` directories at request time using `Deno.readDir()`. They do NOT cache results — every request re-scans the filesystem.
4. CSS endpoint `/css?family=Inter:400,700` → `parseFontQuery()` → look up family by slug → `selectFontVariants()` → `generateFontCss()` returning concatenated `@font-face` blocks with absolute `src` URLs pointing back at `/fonts/<slug>/<file>`.
5. Static file routes read files from disk and stream them with `font/woff2` or `image/svg+xml` MIME types and `immutable` cache headers.

## Critical conventions

### Font file naming (strict)

The parser at `lib/fonts/parser.ts:3` uses regex `/^([1-9]00)(-italic)?\.woff2$/`:

- Weight MUST be `100`, `200`, ..., `900` (the `[1-9]00` range — no `000`, `250`, `450`, etc.)
- Italic variants MUST end in `-italic.woff2` (NOT `_italic`, NOT `-oblique`)
- Extension MUST be `.woff2` (NOT `.woff`, `.ttf`, `.otf`)
- Non-matching files inside a font directory are silently skipped (see `lib/fonts/registry.ts:50`)

The asset-serve route at `routes/fonts/[family]/[file].ts:49` enforces the same regex for served filenames.

The `assets/fonts/inter/rename.sh` script shows the canonical workflow: take Inter ttfs, run `pyftsubset` with `--flavor=woff2` to produce the 9 standard weights.

### Slug ↔ family name conversion

- Directory slug → family name: `slugToFamilyName()` splits on `-`, capitalizes each segment, joins with spaces. `jetbrains-mono` → `JetBrains Mono`.
- Family name → URL slug: `familyNameToSlug()` lowercases and replaces whitespace with `-`. `JetBrains Mono` → `jetbrains-mono`.
- These conversions are case-sensitive and reversible only when the original family name has no uppercase letters or punctuation.

### CSS query format

`/css?family=Inter:400,700&family=JetBrains%20Mono:400` — comma-separated weights after `:`. Omitting weights returns all variants. `family=` may be repeated. Empty family (`family=:`) throws.

### Path safety

Both static routes validate URL params:
- `[family]` / `[collection]`: `/^[a-z0-9][a-z0-9-]*$/i`
- Font `[file]`: `/^[1-9]00(?:-italic)?\.woff2$/`
- Icon `[file]`: `/^[a-z0-9][a-z0-9._-]*\.svg$/i`

Requests that fail validation get a 404, never a path traversal.

### Preact + Fresh precompiled JSX

- All `.tsx` files use `jsxImportSource: "preact"` (set in `deno.json`).
- `jsx: "precompile"` is enabled — this means JSX is compiled to a lighter precompiled form, not the classic `h()` calls. Do NOT write code that assumes classic JSX behavior.
- `jsxPrecompileSkipElements` lists elements that get standard DOM semantics (lowercase tags) vs. component lookup.

## Styling

- Tailwind v4 is configured CSS-first in `assets/styles.css`:
  ```css
  @import "tailwindcss";
  @plugin "daisyui";
  @theme { --color-base-100: rgb(1, 1, 15); }
  ```
- daisyUI components are used throughout (`.btn`, `.mockup-browser`, `.list`, `.list-row`, `.alert`).
- VS Code uses the Tailwind CSS IntelliSense extension (`.vscode/extensions.json`) — `.css` files are associated to the `tailwindcss` language for IDE highlighting.
- `daisyui` is imported via `npm:daisyui@^5.7.44` in `deno.json` imports.

## State / middleware

- `utils.ts` defines `State` interface and exports `define = createDefine<State>()`. Every route handler and page uses `define.handlers({...})` or `define.page(...)` for typed `ctx`.
- `main.ts` shows an example middleware that sets `ctx.state.shared = "hello"`.
- No additional middleware is registered; auth, rate-limiting, etc. are not implemented.

## Testing

- Tests live in `tests/` and use `jsr:@std/assert`.
- Each test file covers a single `lib/` module (parser, registry, css, query).
- Registry tests create temp directories with `Deno.makeTempDir()` and clean up in `finally` blocks.
- Run with `deno test` (no task defined — invoke directly).

## Gotchas

- **`client.ts` is load-bearing.** It contains `import "./assets/styles.css";`. Removing this breaks Tailwind CSS HMR. The "import CSS files here for hot module reloading" comment is the only line in the file.
- **`islands/` is empty** but Fresh's Vite plugin still expects it (it's part of the conventional Fresh 2 layout). Don't delete the directory.
- **`routes/api/fonts.ts` and `routes/api/icons.ts` are empty placeholders** — they exist but contain no exports, so Fresh doesn't register them. They may be wired up later as JSON listing endpoints; leave them alone unless extending the API.
- **Registrars do not cache** — every page render and every CSS request re-reads the asset directories. Fine for small collections; could be a perf issue with hundreds of fonts/icons.
- **No auth, no rate limiting** — the CSS/file endpoints are open with `Access-Control-Allow-Origin: *` and `immutable` cache headers.
- **`deno.json` excludes `**/_fresh/*` from lint/format/check** — that's the Fresh build output directory.
- **`nodeModulesDir: "manual"`** — `deno install` is required after adding new npm imports; they live in a manual `node_modules/`.
- **No TypeScript config file** — `compilerOptions` are in `deno.json`. The `types: ["vite/client"]` is included so `import.meta.hot` etc. type-check.
- **`vite.config.ts` is at the project root**, not inside `deno.json` — Deno drives Vite via this file through the `deno task dev` / `build` tasks.
- **The `rename.sh` script is intentionally committed** — it's a reference for how the canonical Inter `.woff2` files were generated. Don't delete or "fix" the bash associative-array syntax.
