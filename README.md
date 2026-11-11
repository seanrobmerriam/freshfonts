# Freshfonts — TanStack Start

Self-hosted WOFF2 fonts and SVG icons, migrated from the Fresh/Deno app to
TanStack Start, React 19, Vite, and Nitro. Interactive components use Ark UI with Tailwind CSS v4 and app-owned styles.

## Run

Use Node.js 22.18+ and Bun. Run commands from this directory:

```sh
bun install
bun run dev
```

Open http://localhost:3000. The home page lists fonts and icon collections,
with interactive font previews and copyable embed snippets. Detail pages show
font weights or an icon collection's SVGs.

Use **Search for more icons** above the icon collections to open `/icon-search`.
Search theSVG by brand, name, or category, choose an available variant, and click
**Add**. The server uses the installed `@thesvg/cli` to download the SVG into
`assets/icons/thesvg/imported/<slug>/<variant>.svg`; the catalog refreshes without
a rebuild. Existing files are preserved. Search, previews, and new downloads
require internet access; icons already added are served locally.

```sh
bun run test       # Ported unit tests using Node's test runner
bun run typecheck  # TypeScript
bun run check      # Biome formatting and lint checks
bun run build      # Production build
bun run start      # Node/Nitro server (default port 3000)
```

Set `PORT` to change the production port, for example `PORT=3100 bun run start`.

## Assets

Place fonts in `assets/fonts/<family-slug>/<weight>[-italic].woff2` and SVG icons
in `assets/icons/<collection-slug>/**/*.svg` (nested folders are supported). Font
weights must be 100–900 in increments of 100; italic filenames use `-italic`. Unsupported font files are
ignored. Registries scan the filesystem per request without caching, so new
assets are discovered without a rebuild.

Assets are local and ignored by Git; `.gitkeep` files preserve empty roots.
The existing local font collection has been copied into this app. When deploying,
include `assets/fonts` and `assets/icons` alongside `.output` and start the server
from the project directory. The `.output` build alone does not contain these
runtime assets.

Icon imports also require the installed production dependencies (`bun install
--production`, including `@thesvg/cli`) and write access to `assets/icons/thesvg`.
Adding icons changes the shared server catalog for all visitors.

## Routes

| URL | Behavior |
| --- | --- |
| `/` | Font and icon catalog |
| `/icon-search` | Search, preview, and add theSVG icons |
| `/fonts/<family>` | Font details and previews |
| `/icons/<collection>` | SVG collection browser |
| `/fonts/<family>.css` | All variants as `@font-face` rules |
| `/css?family=Allan:400,700&family=Honk:400` | Google Fonts style CSS selection |
| `/fonts/<family>/<file>.woff2` | Font binary |
| `/icons/<collection>/<file>.svg` | SVG file |

Omit weights in `/css` to select all variants. CSS responses allow cross-origin
embeds and cache for one hour. Font and SVG responses allow cross-origin access
and use one-year immutable caching. File routes validate path segments and
filenames before reading the filesystem.

The starter's oRPC endpoints and TanStack Query integration are retained.

## Source layout

- `src/routes/`: TanStack pages and server endpoints; file routes are generated
  into `src/routeTree.gen.ts` by Vite.
- `src/lib/catalog.functions.ts`: server functions for catalog/detail loaders.
- `src/lib/fonts/`, `src/lib/icons/`: types, filesystem registries, parsing, CSS.
- `src/components/`, `src/islands/`: React components, clipboard controls, and
  preview context (the migrated islands are ordinary React components).
- `src/styles.css`: Tailwind, theme tokens, and Ark UI component styling.
- `tests/`: migrated parser, query, registry, CSS, and embed tests.

The original Fresh source remains in the parent directory for reference; this
project runs independently and does not import from it.
