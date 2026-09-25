# FreshFont

**FreshFont** is a self-hosted font and SVG icon server built with [Deno Fresh 2](https://fresh.deno.dev/).

Drop WOFF2 fonts into `./assets/fonts/` and SVG icons into `./assets/icons/`. FreshFont discovers them automatically and exposes them through predictable URLs, per-family stylesheets, and a Google Fonts-style CSS endpoint.

No database. No manifest. No asset configuration.

```html
<link
  rel="stylesheet"
  href="https://fonts.example.com/css?family=Inter:400,700,900"
/>
```

```css
body {
  font-family: "Inter", sans-serif;
}
```

---

## Features

- **Google Fonts-style embeds** — load one or more font families and specific weights from a single stylesheet URL
- **Per-family stylesheets** — every discovered family gets its own `/fonts/<family>.css` endpoint
- **Direct font serving** — WOFF2 files are available at predictable URLs with cache headers
- **SVG icon serving** — organize SVGs into collections and serve them directly from `/icons/<collection>/<icon>.svg`
- **Automatic discovery** — directories and filenames define the available fonts, weights, styles, and icon collections
- **Browse UI** — inspect discovered font families and icon collections from the Fresh frontend
- **Live font previews** — preview hosted families directly in the mock browser UI
- **Cross-origin ready** — font and icon responses include CORS headers for use from other sites
- **No database** — the filesystem is the registry

---

## Quick Start

### Requirements

Install [Deno 2](https://docs.deno.com/runtime/getting_started/installation/).

Start the development server:

```bash
deno task dev
```

Then open the URL printed by Vite, typically:

```text
http://localhost:5173
```

---

## Adding Fonts

Create one directory for each font family under:

```text
assets/fonts/
```

Font files must use the following naming convention:

```text
<weight>[-italic].woff2
```

Supported weights are:

```text
100
200
300
400
500
600
700
800
900
```

Append `-italic` for italic variants.

### Example

```text
assets/fonts/
└── inter/
    ├── 100.woff2
    ├── 100-italic.woff2
    ├── 200.woff2
    ├── 200-italic.woff2
    ├── 300.woff2
    ├── 300-italic.woff2
    ├── 400.woff2
    ├── 400-italic.woff2
    ├── 500.woff2
    ├── 500-italic.woff2
    ├── 600.woff2
    ├── 600-italic.woff2
    ├── 700.woff2
    ├── 700-italic.woff2
    ├── 800.woff2
    ├── 800-italic.woff2
    ├── 900.woff2
    └── 900-italic.woff2
```

The directory name becomes the font's URL slug.

For example:

```text
jetbrains-mono
```

becomes:

```text
JetBrains Mono
```

FreshFont converts directory slugs to display names by splitting on `-` and capitalizing each segment.

---

## Using Fonts

### Load Selected Weights

Use `/css` to request a family and specific weights:

```html
<link
  rel="stylesheet"
  href="https://fonts.example.com/css?family=Inter:400,700,900"
/>
```

Then use the family normally:

```css
body {
  font-family: "Inter", sans-serif;
  font-weight: 400;
}

h1 {
  font-weight: 900;
}
```

The generated stylesheet contains only the requested variants.

### Load Multiple Families

Repeat the `family` parameter:

```html
<link
  rel="stylesheet"
  href="https://fonts.example.com/css?family=Inter:400,700&family=JetBrains%20Mono:400,700"
/>
```

### Load Every Available Variant

Omit the weights:

```html
<link
  rel="stylesheet"
  href="https://fonts.example.com/css?family=Inter"
/>
```

### Load a Family Directly

Every family also has its own stylesheet:

```text
https://fonts.example.com/fonts/inter.css
```

This stylesheet includes every discovered variant for that family.

---

## Generated CSS

A request such as:

```text
/css?family=Inter:400,700
```

returns:

```css
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("https://fonts.example.com/fonts/inter/400.woff2") format("woff2");
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("https://fonts.example.com/fonts/inter/700.woff2") format("woff2");
}
```

The generated `src` values use absolute URLs, so the stylesheet can be embedded from another origin.

---

## Direct Font URLs

Every font variant is also directly accessible:

```text
/fonts/<family>/<file>
```

For example:

```text
/fonts/inter/400.woff2
/fonts/inter/700.woff2
/fonts/inter/700-italic.woff2
```

---

## Font Preview Pages

Every font family has a preview page:

```text
/fonts/<family>
```

For example:

```text
/fonts/inter
```

The preview page displays the available weights and styles using the actual hosted font files.

The home page also supports loading a selected font into the mock browser preview without leaving the page.

---

## Adding Icons

Create one directory per icon collection under:

```text
assets/icons/
```

Then add SVG files directly to the collection.

### Example

```text
assets/icons/
└── lucide/
    ├── github.svg
    ├── menu.svg
    ├── search.svg
    └── x.svg
```

Use lowercase, URL-safe filenames when possible:

```text
left-arrow.svg
arrow-up-right.svg
github.svg
```

Avoid spaces in icon filenames.

Each SVG is available at:

```text
/icons/<collection>/<file>
```

For example:

```text
https://fonts.example.com/icons/lucide/search.svg
```

Use it directly:

```html
<img
  src="https://fonts.example.com/icons/lucide/search.svg"
  alt=""
/>
```

Or from CSS:

```css
.search-icon {
  background-image:
    url("https://fonts.example.com/icons/lucide/search.svg");
}
```

---

## Icon Collection Pages

Each collection has a browse page:

```text
/icons/<collection>
```

For example:

```text
/icons/lucide
```

The collection browser lets you:

- preview SVG icons
- copy direct icon URLs
- copy HTML snippets
- open individual SVG files

---

## Converting Fonts to WOFF2

FreshFont serves WOFF2 files rather than TTF or OTF files.

One option for converting fonts is [FontTools](https://fonttools.readthedocs.io/) with Brotli support:

```bash
python -m pip install fonttools brotli
```

Convert a font with:

```bash
pyftsubset Inter-Regular.ttf \
  --output-file=400.woff2 \
  --flavor=woff2 \
  --unicodes='*'
```

For production use, prefer official WOFF2 releases from the font project when available.

---

## Routes

### Fonts

| Route | Purpose |
| --- | --- |
| `/css?family=Inter:400,700` | Generate CSS for selected families and weights |
| `/fonts/inter.css` | Generate CSS for every Inter variant |
| `/fonts/inter/400.woff2` | Serve a specific font file |
| `/fonts/inter` | Browse and preview a font family |

### Icons

| Route | Purpose |
| --- | --- |
| `/icons/lucide/search.svg` | Serve an SVG directly |
| `/icons/lucide` | Browse an icon collection |

---

## Architecture

FreshFont is intentionally filesystem-driven.

```text
assets/
├── fonts/
│   └── <family>/
│       └── <weight>[-italic].woff2
└── icons/
    └── <collection>/
        └── <icon>.svg

lib/
├── fonts/
│   ├── css.ts
│   ├── parser.ts
│   ├── query.ts
│   ├── registry.ts
│   └── types.ts
├── icons/
│   ├── registry.ts
│   └── types.ts
└── embed.ts

routes/
├── index.tsx
├── css.ts
├── fonts/
│   ├── [family].css.ts
│   ├── [family].tsx
│   └── [family]/
│       └── [file].ts
└── icons/
    ├── [collection].tsx
    └── [collection]/
        └── [file].ts

components/
├── FontList.tsx
└── IconList.tsx

islands/
├── BrowserMockup.tsx
├── CopyButton.tsx
├── FontPreviewButton.tsx
└── fontPreviewState.ts

tests/
```

### Font Request Flow

```text
assets/fonts
    ↓
font registry
    ↓
query / family selection
    ↓
CSS generator
    ↓
Fresh route
```

### Icon Request Flow

```text
assets/icons
    ↓
icon registry
    ↓
Fresh route
```

The filesystem remains the source of truth.

---

## Stack

- [Deno 2](https://deno.com/)
- [Fresh 2](https://fresh.deno.dev/)
- Preact
- Preact Signals
- Vite
- Tailwind CSS v4
- daisyUI v5

Fresh provides routing and server rendering while Vite handles development and production builds.

---

## Development

### Run the Development Server

```bash
deno task dev
```

### Run the Test Suite

```bash
deno test --allow-read --allow-write
```

The write permission is required because registry tests create temporary filesystem fixtures.

### Check the Project

```bash
deno task check
```

### Build for Production

```bash
deno task build
```

### Run the Production Build

```bash
deno task start
```

---

## Commands

| Command | Description |
| --- | --- |
| `deno task dev` | Start the Vite development server with HMR |
| `deno task build` | Create the production Fresh build |
| `deno task start` | Run the production server |
| `deno task check` | Format check, lint, and type-check |
| `deno task update` | Update Fresh framework files |
| `deno test --allow-read --allow-write` | Run the test suite |

---

## Caching

Generated CSS responses use a shorter cache lifetime:

```text
Cache-Control: public, max-age=3600
```

Font and SVG asset responses can use longer cache lifetimes in production.

During development, using `no-store` is recommended when replacing assets at the same URL.

If immutable caching is enabled:

```text
Cache-Control: public, max-age=31536000, immutable
```

the corresponding asset URLs should also be treated as immutable.

For stronger production guarantees, fingerprinted asset URLs are recommended.

---

## Security

Asset routes do not pass arbitrary URL values directly to the filesystem.

Font families and icon collections are restricted to safe path segments, and font filenames must match the expected weight/style convention.

Examples of accepted font filenames:

```text
400.woff2
700.woff2
700-italic.woff2
```

Invalid paths and unsupported filenames return `404`.

This prevents request paths from being used for filesystem traversal.

---

## Testing

The test suite covers the core domain logic independently of Fresh routing:

```text
tests/
├── css_generator_test.ts
├── embed_test.ts
├── font_parser_test.ts
├── font_query_test.ts
├── font_registry_test.ts
└── icon_registry_test.ts
```

Coverage includes:

- font filename parsing
- weight and style detection
- filesystem font discovery
- filesystem icon discovery
- CSS generation
- family query parsing
- requested weight filtering
- embed URL generation

Run all tests with:

```bash
deno test --allow-read --allow-write
```

---

## License

FreshFont's source code is distributed under the repository's project license.

Fonts and icon sets remain subject to their respective upstream licenses.

The bundled Inter assets are subject to the [Inter typeface license](https://github.com/rsms/inter/blob/master/LICENSE.txt).

When adding additional fonts or icon collections, verify that their licenses permit self-hosting and redistribution.
