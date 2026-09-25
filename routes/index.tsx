import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

import BrowserMockup from "../islands/BrowserMockup.tsx";

import { FontList } from "../components/FontList.tsx";
import { IconList } from "../components/IconList.tsx";

import { getFonts } from "../lib/fonts/registry.ts";
import { getIconSets } from "../lib/icons/registry.ts";

export default define.page(async function Home(ctx) {
  const [fonts, iconSets] = await Promise.all([
    getFonts(),
    getIconSets(),
  ]);

  const defaultFont = fonts[0]
    ? {
      slug: fonts[0].slug,
      family: fonts[0].family,
      weights: [
        ...new Set(
          fonts[0].variants.map(
            (variant) => variant.weight,
          ),
        ),
      ].sort((a, b) => a - b),
    }
    : undefined;

  return (
    <>
      <Head>
        <title>FreshFont Icon & Font Server</title>

  <link
    rel="stylesheet"
    href="/fonts/newsreader.css"
  />
  <link
    rel="stylesheet"
    href="/fonts/red-hat-mono.css"
  />
        <meta
          name="description"
          content="Self-hosted WOFF2 fonts and SVG icons with Google Fonts-style embeds."
        />
      </Head>

      <header class="mt-10 text-center">
        <h1 class="hero-title">
          Freshfonts
        </h1>

        <p class="mt-3 text-lg opacity-70">
          Self-hosted fonts and SVG icons with zero-config filesystem discovery.
        </p>

        <p class="mt-4 mb-10 text-sm opacity-50">
          Drop assets into <code>./assets/fonts</code> or{" "}
          <code>./assets/icons</code>.
        </p>
      </header>

      <main class="px-4 py-8 min-h-screen">
        <div class="max-w-screen-xl mx-auto">
          <BrowserMockup
            defaultFont={defaultFont}
          />

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 items-start">
            <FontList
              fonts={fonts}
              origin={ctx.url.origin}
            />

            <IconList
              iconSets={iconSets}
            />
          </div>
        </div>
      </main>
    </>
  );
});
