import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

import { BrowserMockup } from "../components/BrowserMockup.tsx";
import { FontList } from "../components/FontList.tsx";
import { IconList } from "../components/IconList.tsx";

import { getFonts } from "../lib/fonts/registry.ts";
import { getIconSets } from "../lib/icons/registry.ts";

export default define.page(async function Home() {
  const [fonts, iconSets] = await Promise.all([
    getFonts(),
    getIconSets(),
  ]);

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>FreshFont Icon & Font Server</title>

        <meta
          name="description"
          content="Self-hosted font and SVG icon server built with Deno Fresh."
        />
      </Head>

      <div class="max-w-screen-xl mx-auto">
        <BrowserMockup />

        <div class="flex flex-col items-center justify-center mt-8">
          <h1 class="text-4xl font-bold text-center">
            FreshFont Icon & Font Server
          </h1>

          <p class="my-4 text-center opacity-80">
            Add font files and SVG icon files to
            <code class="mx-2">./assets/fonts</code>
            and
            <code class="mx-2">./assets/icons</code>.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
          <FontList fonts={fonts} />
          <IconList iconSets={iconSets} />
        </div>
      </div>
    </div>
  );
});
