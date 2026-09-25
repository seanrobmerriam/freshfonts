import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import CopyButton from "../../islands/CopyButton.tsx";

import { getFonts } from "../../lib/fonts/registry.ts";

export default define.page(async function FontPreview(ctx) {
  const slug = ctx.params.family;

  const fonts = await getFonts();

  const font = fonts.find(
    (font) => font.slug === slug,
  );

  if (!font) {
    return (
      <main class="max-w-screen-lg mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold">
          Font not found
        </h1>

        <p class="mt-4">
          No font family exists with the slug{" "}
          <code>{slug}</code>.
        </p>

        <a
          href="/"
          class="btn mt-6"
        >
          Back
        </a>
      </main>
    );
  }

  const stylesheetUrl =
    `${ctx.url.origin}/fonts/${font.slug}.css`;

  const embedCode =
    `<link rel="stylesheet" href="${stylesheetUrl}">`;

  const cssUsage =
    `font-family: "${font.family}", sans-serif;`;

  const weights = [
    ...new Set(
      font.variants.map((variant) => variant.weight),
    ),
  ].sort((a, b) => a - b);

  return (
    <>
      <Head>
        <title>{font.family} | FreshFont</title>

        <link
          rel="stylesheet"
          href={`/fonts/${font.slug}.css`}
        />
      </Head>

      <main class="max-w-screen-xl mx-auto px-4 py-12">
        <div class="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <a
              href="/"
              class="link link-hover text-sm opacity-70"
            >
              ← Back to fonts
            </a>

            <h1 class="text-5xl font-bold mt-3">
              {font.family}
            </h1>

            <p class="mt-2 opacity-70">
              {font.variants.length} variants
            </p>
          </div>
        </div>

        <section class="mt-10">
          <h2 class="text-2xl font-bold mb-4">
            Embed
          </h2>

          <div class="bg-base-200 rounded-box p-4">
            <div class="flex items-start gap-4">
              <code class="flex-1 overflow-x-auto whitespace-pre">
                {embedCode}
              </code>

              <CopyButton
                value={embedCode}
                label="Copy"
              />
            </div>
          </div>

          <div class="bg-base-200 rounded-box p-4 mt-3">
            <div class="flex items-start gap-4">
              <code class="flex-1 overflow-x-auto whitespace-pre">
                {cssUsage}
              </code>

              <CopyButton
                value={cssUsage}
                label="Copy CSS"
              />
            </div>
          </div>
        </section>

        <section class="mt-12">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">
                Preview
              </h2>

              <p class="opacity-60 mt-1">
                Available weights
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            {weights.map((weight) => (
              <div
                class="card bg-base-100 shadow-sm border border-base-300"
                key={weight}
              >
                <div class="card-body">
                  <div class="flex justify-between items-center mb-4">
                    <span class="badge badge-outline">
                      {weight}
                    </span>

                    <span class="text-xs opacity-50">
                      {font.family}
                    </span>
                  </div>

                  <p
                    class="text-4xl leading-tight"
                    style={{
                      fontFamily: `"${font.family}", sans-serif`,
                      fontWeight: weight,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>

                  <p
                    class="text-xl mt-3 opacity-80"
                    style={{
                      fontFamily: `"${font.family}", sans-serif`,
                      fontWeight: weight,
                    }}
                  >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    <br />
                    abcdefghijklmnopqrstuvwxyz
                    <br />
                    0123456789
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
});