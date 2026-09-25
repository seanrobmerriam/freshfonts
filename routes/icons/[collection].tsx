import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import CopyButton from "../../islands/CopyButton.tsx";

import { buildIconHtml, buildIconUrl } from "../../lib/embed.ts";

import { getIconSets } from "../../lib/icons/registry.ts";

export default define.page(async function IconCollection(ctx) {
  const slug = ctx.params.collection;

  const iconSets = await getIconSets();

  const iconSet = iconSets.find(
    (set) => set.slug === slug,
  );

  if (!iconSet) {
    return (
      <main class="max-w-screen-xl mx-auto px-4 py-12">
        <a
          href="/"
          class="link link-hover text-sm opacity-70"
        >
          ← Back
        </a>

        <h1 class="text-4xl font-bold mt-4">
          Icon set not found
        </h1>

        <p class="mt-4 opacity-70">
          No icon collection named <code>{slug}</code> was found.
        </p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>
          {iconSet.name} Icons | FreshFont
        </title>

        <meta
          name="description"
          content={`Browse ${iconSet.count} SVG icons from the ${iconSet.name} collection.`}
        />
      </Head>

      <main class="max-w-screen-xl mx-auto px-4 py-12">
        <header>
          <a
            href="/"
            class="link link-hover text-sm opacity-70"
          >
            ← Back to FreshFont
          </a>

          <div class="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 class="text-5xl font-bold">
                {iconSet.name}
              </h1>

              <p class="mt-2 opacity-60">
                {iconSet.count} {iconSet.count === 1 ? "SVG icon" : "SVG icons"}
              </p>
            </div>

            <code class="text-sm bg-base-200 px-3 py-2 rounded-box">
              /icons/{iconSet.slug}/&lt;icon&gt;.svg
            </code>
          </div>
        </header>

        <section class="mt-10">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {iconSet.icons.map((icon) => {
              const url = buildIconUrl(
                ctx.url.origin,
                iconSet.slug,
                icon.file,
              );

              const html = buildIconHtml(
                ctx.url.origin,
                iconSet.slug,
                icon.file,
              );

              return (
                <article
                  class="card bg-base-100 border border-base-300 hover:border-base-content/30 transition-colors"
                  key={icon.name}
                >
                  <div class="card-body p-4">
                    <div class="h-24 flex items-center justify-center rounded-box bg-base-200">
                      <img
                        src={`/icons/${iconSet.slug}/${icon.file}`}
                        alt=""
                        class="size-10"
                        loading="lazy"
                      />
                    </div>

                    <div class="mt-2 min-w-0">
                      <h2
                        class="font-semibold truncate"
                        title={icon.name}
                      >
                        {icon.name}
                      </h2>

                      <p
                        class="text-xs opacity-50 truncate mt-1"
                        title={icon.file}
                      >
                        {icon.file}
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mt-2">
                      <CopyButton
                        value={url}
                        label="URL"
                        copiedLabel="Copied"
                        class="btn btn-sm"
                      />

                      <CopyButton
                        value={html}
                        label="HTML"
                        copiedLabel="Copied"
                        class="btn btn-sm btn-ghost"
                      />
                    </div>

                    <a
                      href={`/icons/${iconSet.slug}/${icon.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-xs btn-ghost mt-1"
                    >
                      Open SVG
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
});
