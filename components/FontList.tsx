import type { FontFamily } from "../lib/fonts/types.ts";
import CopyButton from "../islands/CopyButton.tsx";
import { buildFontEmbedCode } from "../lib/embed.ts";
import FontPreviewButton from "../islands/FontPreviewButton.tsx";

interface FontListProps {
  fonts: FontFamily[];
  origin: string;
}

export function FontList({
  fonts,
  origin,
}: FontListProps) {
  return (
    <section class="w-full">
      <header class="mb-4">
        <h2 class="text-2xl font-bold">
          Fonts
        </h2>

        <p class="text-sm opacity-60 mt-1">
          {fonts.length} {fonts.length === 1 ? "family" : "families"}
        </p>
      </header>

      {fonts.length === 0
        ? (
          <div class="alert">
            <span>
              No fonts found in <code>./assets/fonts</code>.
            </span>
          </div>
        )
        : (
          <ul class="list bg-base-100 rounded-box border border-base-300">
            {fonts.map((font) => {
              const weights = [
                ...new Set(
                  font.variants.map(
                    (variant) => variant.weight,
                  ),
                ),
              ];

              const hasItalic = font.variants.some(
                (variant) => variant.style === "italic",
              );

              const embed = buildFontEmbedCode(
                origin,
                font.slug,
              );

              return (
                <li
                  class="list-row"
                  key={font.slug}
                >
                  <div class="size-12 rounded-box bg-base-200 flex items-center justify-center">
                    <span
                      class="text-xl"
                      style={`font-family: "${font.family}", sans-serif; font-weight: 700;`}
                    >
                      Aa
                    </span>
                  </div>

                  <div class="min-w-0">
                    <div class="font-bold">
                      {font.family}
                    </div>

                    <div class="text-xs opacity-60 mt-1">
                      {weights.join(" · ")}
                      {hasItalic ? " · Italic" : ""}
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <FontPreviewButton
                      slug={font.slug}
                      family={font.family}
                      weights={weights}
                    />

                    <a
                      href={`/fonts/${font.slug}`}
                      class="btn btn-sm btn-ghost"
                    >
                      Details
                    </a>

                    <a
                      href={`/fonts/${font.slug}.css`}
                      class="btn btn-sm btn-ghost"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CSS
                    </a>

                    <CopyButton
                      value={embed}
                      label="Embed"
                      copiedLabel="Copied"
                      class="btn btn-sm"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
}
