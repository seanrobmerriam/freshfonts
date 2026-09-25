import type { IconSet } from "../lib/icons/types.ts";

interface IconListProps {
  iconSets: IconSet[];
}

export function IconList({ iconSets }: IconListProps) {
  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Icon Sets</h2>
          <p class="text-sm opacity-70">
            {iconSets.length} icon {iconSets.length === 1 ? "set" : "sets"}
          </p>
        </div>
      </div>

      {iconSets.length === 0
        ? (
          <div class="alert">
            <span>
              No icon sets found in{" "}
              <code class="font-mono">./assets/icons</code>
            </span>
          </div>
        )
        : (
          <ul class="list bg-base-100 rounded-box shadow-md">
            {iconSets.map((iconSet) => {
              const previewIcon = iconSet.icons[0];

              return (
                <li class="list-row" key={iconSet.slug}>
                  <div class="size-12 rounded-box bg-base-200 flex items-center justify-center overflow-hidden">
                    {previewIcon
                      ? (
                        <img
                          src={`/icons/${iconSet.slug}/${previewIcon.file}`}
                          alt=""
                          class="size-6"
                          loading="lazy"
                        />
                      )
                      : (
                        <span class="text-lg font-bold">
                          ◇
                        </span>
                      )}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="font-bold">
                      {iconSet.name}
                    </div>

                    <div class="text-xs uppercase font-semibold opacity-60">
                      {iconSet.count} {iconSet.count === 1 ? "icon" : "icons"}
                    </div>
                  </div>

                  <a
                    href={`/icons/${iconSet.slug}`}
                    class="btn btn-square btn-ghost"
                    title={`Browse ${iconSet.name}`}
                    aria-label={`Browse ${iconSet.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="size-5"
                      aria-hidden="true"
                    >
                      <path d="M3 6a3 3 0 0 1 3-3h2l2 2h8a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
                    </svg>
                  </a>

                  {previewIcon && (
                    <a
                      href={`/icons/${iconSet.slug}/${previewIcon.file}`}
                      class="btn btn-square btn-ghost"
                      title={`Open an SVG from ${iconSet.name}`}
                      aria-label={`Open an SVG from ${iconSet.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="size-5"
                        aria-hidden="true"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}
