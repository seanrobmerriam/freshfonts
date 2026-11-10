# Icon search

Approved direction: provide a separate `/icon-search` route with search, previews,
a selector for each icon's available variants, and Add. Link to it with a
"Search for more icons" button above the icon sets on `/`.

Add installs the selected SVG into `assets/icons/thesvg`, refreshes the catalog,
and shows an Added state with a link to the collection. Existing files must not
be overwritten. Search and import failures must be visible and retryable.

Approaches: terminal-output parsing is brittle; use the CLI's static registry for
structured search, previews, and available variants. Keep `@thesvg/cli` as a runtime
dependency and run its add command in a subprocess for imports. Downloads go into
a temporary directory, are checked, and copied exclusively into the catalog.
This avoids the CLI's overwrite and variant fallback behavior affecting existing
icons. Use a per-icon folder (`thesvg/imported/<slug>/<variant>.svg`) to avoid name
collisions between slugs and variants. This storage layout is an implementation
choice. Keep the original imported icons unchanged.

Use TanStack server functions for search and mutations, Node filesystem APIs,
React 19 and existing daisyUI styles. The browser never accesses filesystem or
executes CLI commands. Validate query length, icon slug, and available variant;
use fixed upstream URLs and argument arrays, bounded subprocess execution, and
same-origin POST protection. No authentication system is introduced.
