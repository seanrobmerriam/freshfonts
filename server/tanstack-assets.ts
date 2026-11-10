import { defineHandler } from "nitro";
import { fetchViteEnv } from "nitro/vite/runtime";

// These dynamic asset URLs must reach TanStack's server routes before Vite's
// static asset middleware, including requests with style/font/image destinations.
export default defineHandler((event) => fetchViteEnv("ssr", event.req));
