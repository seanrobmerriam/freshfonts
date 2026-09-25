import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

import CopyButton from "../../islands/CopyButton.tsx";

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
        <h1 class="text-3xl font-bold">
          Icon set not found
        </h1>

        <p class="mt-4">
          No icon collection exists with the slug{" "}
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

  return (
    <>
      <Head>
        <title>{iconSet.name} Icons | FreshFont</title>
      </Head>

      <main class="max-w-screen-xl mx-auto px-4 py-12">
        <div>
          <a
            href="/"
            class="link link-hover text-sm opacity-70"
          >
            ← Back to icon sets
          </a>

          <h1 class="text-5xl font-bold mt-3">
            {iconSet.name}
          </h1>

          <p class="mt-2 opacity-70">
            {iconSet.count}{" "}
            {iconSet.count === 1 ? "icon" : "icons"}
          </p>
        </div>

        <section class="mt-10">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {iconSet.icons.map((icon) => {
              const path =
                `/icons/${iconSet.slug}/${icon.file}`;

              const absoluteUrl =
                `${ctx.url.origin}${path}`;

              const html =
                `<img src="${absoluteUrl}" alt="">`;

              return (
                <div
                  class="card bg-base-100 border border-base-300 shadow-sm"
                  key={icon.name}
                >
                  <div class="card-body p-4 items-center text-center">
                    <div class="size-20 flex items-center justify-center">
                      <img
                        src={path}
                        alt={icon.name}
                        class="size-10"
                        loading="lazy"
                      />
                    </div>

                    <div class="w-full min-w-0">
                      <div
                        class="font-semibold text-sm truncate"
                        title={icon.name}
                      >
                        {icon.name}
                      </div>
                    </div>

                    <div class="flex gap-2 mt-2">
                      <CopyButton
                        value={absoluteUrl}
                        label="URL"
                        class="btn btn-xs"
                      />

                      <CopyButton
                        value={html}
                        label="HTML"
                        class="btn btn-xs btn-ghost"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
});