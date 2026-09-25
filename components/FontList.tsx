import type { FontFamily } from "../lib/fonts/types.ts";

interface FontListProps {
  fonts: FontFamily[];
}

export function FontList({ fonts }: FontListProps) {
  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Fonts</h2>
          <p class="text-sm opacity-70">
            {fonts.length} font {fonts.length === 1 ? "family" : "families"}
          </p>
        </div>
      </div>

      {fonts.length === 0
        ? (
          <div class="alert">
            <span>
              No fonts found in <code class="font-mono">./assets/fonts</code>
            </span>
          </div>
        )
        : (
          <ul class="list bg-base-100 rounded-box shadow-md">
            {fonts.map((font) => {
              const weights = [
                ...new Set(
                  font.variants.map((variant) => variant.weight),
                ),
              ];

              const hasItalic = font.variants.some(
                (variant) => variant.style === "italic",
              );

              return (
                <li class="list-row" key={font.slug}>
                  <div class="size-12 rounded-box bg-base-200 flex items-center justify-center">
                    <span class="text-xl font-bold">
                      Aa
                    </span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="font-bold">
                      {font.family}
                    </div>

                    <div class="text-xs uppercase font-semibold opacity-60">
                      {weights.join(" · ")}
                      {hasItalic ? " · Italic" : ""}
                    </div>
                  </div>

                  <a
                    href={`/fonts/${font.slug}`}
                    class="btn btn-square btn-ghost"
                    title={`Preview ${font.family}`}
                    aria-label={`Preview ${font.family}`}
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
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </a>

                  <a
                    href={`/fonts/${font.slug}.css`}
                    class="btn btn-square btn-ghost"
                    title={`Open embed CSS for ${font.family}`}
                    aria-label={`Open embed CSS for ${font.family}`}
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
                      <path d="m16 18 6-6-6-6" />
                      <path d="m8 6-6 6 6 6" />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}
