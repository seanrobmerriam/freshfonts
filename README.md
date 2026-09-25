# FreshFont Icon & Font Server

A self-hosted font and SVG icon server built with [Deno Fresh 2](https://fresh.deno.dev/). Drop font files into `./assets/fonts/` and SVG files into `./assets/icons/` — the server exposes them as Google-Fonts-style embed CSS and as directly servable files.

## Features

- **Google-Fonts-compatible CSS endpoint** — request multiple families with specific weights in a single `<link>` tag
- **Per-family CSS endpoints** — point any browser at `/fonts/<family-slug>.css` for a complete `@font-face` block
- **Direct file serving** — every font (`/fonts/<family>/<weight>.woff2`) and icon (`/icons/<collection>/<name>.svg`) is available with immutable cache headers
- **Browse UI** — the home page at `/` lists every discovered family and icon collection
- **Zero config** — naming conventions on disk drive everything; no manifest, no database

## Getting started

Install [Deno](https://docs.deno.com/runtime/getting_started/installation) (v2+).

Start the dev server with hot reload:

```
deno task dev
```

Then open <http://localhost:5173> (Vite's default port).

## Commands

| Task | Command | What it does |
| --- | --- | --- |
| `dev` | `deno task dev` | Vite dev server with HMR |
| `build` | `deno task build` | Production build to `_fresh/` |
| `start` | `deno task start` | Run the production build via `deno serve` |
| `check` | `deno task check` | Format check + lint + type check |
| `update` | `deno task update` | Upgrade Fresh framework files |
| — | `deno test` | Run unit tests in `tests/` |

## Adding fonts

Create one directory per family under `./assets/fonts/`. Each `.woff2` file inside must follow this naming convention:

```
<weight>[-italic].woff2
```

- `weight` is one of `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`
- append `-italic` for italic variants

Example:

```
assets/fonts/
  inter/
    100.woff2
    400.woff2
    400-italic.woff2
    700.woff2
    700-italic.woff2
```

The directory name becomes the family slug; it is converted to a display name by splitting on `-` and capitalizing each segment (`jetbrains-mono` → `JetBrains Mono`).

The included `assets/fonts/inter/rename.sh` script shows how the bundled Inter set was generated from upstream TTFs using `pyftsubset --flavor=woff2`.

## Adding icons

Create one directory per collection under `./assets/icons/` and drop SVG files inside:

```
assets/icons/
  lucide/
    search.svg
    menu.svg
    github.svg
```

Every `.svg` file is served at `/icons/<collection>/<file>.svg`.

## Embedding fonts in your site

Use the CSS endpoint just like Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.example.com/css?family=Inter:400,700&family=JetBrains%20Mono:400" />
```

- repeat `family=` to bundle multiple families in one request
- comma-separate weights after `:` (omit the `:weights` part to include every variant the family has)
- `Cache-Control: public, max-age=3600` is set on CSS responses, so it's safe to hot-link
- the response includes absolute URLs in each `@font-face` `src`, so the embed works from any origin

Or grab a single family's CSS directly:

```
https://fonts.example.com/fonts/inter.css
```

## Architecture

- **Fresh 2** via `@fresh/plugin-vite` — Vite handles dev/build, Fresh provides the routing primitives
- **Preact** with `jsx: "precompile"` for server rendering
- **Tailwind CSS v4** (CSS-first config) + **daisyUI v5** for the browse UI
- No database — the asset registries in `lib/fonts/registry.ts` and `lib/icons/registry.ts` scan the filesystem on every request

```
main.ts                    App entrypoint, mounts fsRoutes()
routes/                    File-system based routes (auto-registered)
  _app.tsx                 <html> shell
  index.tsx                Home page (calls getFonts + getIconSets)
  css.ts                   Google-Fonts-style CSS endpoint
  fonts/[family].css.ts    Single-family CSS
  fonts/[family]/[file].ts Serves individual woff2 files
  icons/[collection]/[file].ts  Serves individual svg files
lib/                       Domain logic (registries, parsers, CSS gen)
components/                Server-rendered Preact components
assets/fonts/<family>/     Self-hosted woff2 fonts
assets/icons/<collection>  Self-hosted SVG icons
```

## Security

Static file routes validate URL parameters against strict regexes (`[family]` and `[collection]` must match `/^[a-z0-9][a-z0-9-]*$/i`, font filenames must match the weight pattern, icon filenames must end in `.svg`). Invalid requests get a 404 — no path traversal is possible.

## License

Fonts bundled in `assets/fonts/inter/` are subject to the [Inter typeface license](https://github.com/rsms/inter/blob/master/LICENSE.txt). Add other families under their own licenses.
