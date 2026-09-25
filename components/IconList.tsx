import type { IconSet } from "../lib/icons/types.ts";

interface IconListProps {
  iconSets: IconSet[];
}

export function IconList({
  iconSets,
}: IconListProps) {
  return (
    <section class="w-full">
      <header class="mb-4">
        <h2 class="text-2xl font-bold">
          Icon Sets
        </h2>

        <p class="text-sm opacity-60 mt-1">
          {iconSets.length}{" "}
          {iconSets.length === 1 ? "collection" : "collections"}
        </p>
      </header>

      {iconSets.length === 0
        ? (
          <div class="alert">
            <span>
              No icon sets found in <code>./assets/icons</code>.
            </span>
          </div>
        )
        : (
          <ul class="list bg-base-100 rounded-box border border-base-300">
            {iconSets.map((iconSet) => {
              const preview = iconSet.icons[0];

              return (
                <li
                  class="list-row"
                  key={iconSet.slug}
                >
                  <div class="size-12 rounded-box bg-base-200 flex items-center justify-center">
                    {preview
                      ? (
                        <img
                          src={`/icons/${iconSet.slug}/${preview.file}`}
                          alt=""
                          class="size-6"
                          loading="lazy"
                        />
                      )
                      : <span>SVG</span>}
                  </div>

                  <div class="min-w-0">
                    <div class="font-bold">
                      {iconSet.name}
                    </div>

                    <div class="text-xs opacity-60 mt-1">
                      {iconSet.count} {iconSet.count === 1 ? "icon" : "icons"}
                    </div>
                  </div>

                  <div>
                    <a
                      href={`/icons/${iconSet.slug}`}
                      class="btn btn-sm"
                    >
                      Browse
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
}
