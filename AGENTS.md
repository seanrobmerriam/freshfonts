# Freshfonts TanStack app

This directory is the migrated app. Parent instructions describing Deno/Fresh
apply to the original project, not the implementation here.

- Use Bun for package management, React 19 for components, and TanStack Start for
  SSR, server functions, and server routes. Use Node filesystem APIs, not Deno.
- Run `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`
  before completing changes.
- Keep filesystem work inside server handlers/server functions; never expose it
  to client-side loaders directly. Catalog server functions are in
  `src/lib/catalog.functions.ts`.
- Preserve public URLs, filename/path validation, CSS selection behavior, MIME
  types, CORS headers, and cache headers when editing endpoints.
- Keep React preview state scoped with `FontPreviewProvider`; module-level state
  must not leak across SSR requests.
- Keep Tailwind v4 and daisyUI configuration in `src/styles.css`.
- Font/icon assets remain ignored by Git except `.gitkeep`. Runtime filesystem
  discovery reads `./assets/fonts` and `./assets/icons` from the project cwd.
- Do not edit `src/routeTree.gen.ts` by hand. Vite regenerates it.
- `islands/` is a migration naming convention here; its files are ordinary React
  components and have no Fresh runtime dependency.
