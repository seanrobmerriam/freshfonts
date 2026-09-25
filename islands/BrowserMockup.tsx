import { useEffect } from "preact/hooks";
import { selectedFont } from "./fontPreviewState.ts";

interface BrowserMockupProps {
  defaultFont?: {
    slug: string;
    family: string;
    weights: number[];
  };
}

export default function BrowserMockup({
  defaultFont,
}: BrowserMockupProps) {
  const font = selectedFont.value ?? defaultFont ?? null;

  useEffect(() => {
    if (!font) {
      return;
    }

    const id = `font-preview-${font.slug}`;

    const existing = document.getElementById(id);

    if (existing) {
      return;
    }

    const link = document.createElement("link");

    link.id = id;
    link.rel = "stylesheet";
    link.href = `/fonts/${font.slug}.css`;

    document.head.appendChild(link);
  }, [font?.slug]);

  const family = font?.family ?? "FreshFont";

  const weights = font?.weights.length
    ? font.weights
    : [400, 700];

  return (
    <div class="mockup-browser border border-base-300 bg-base-200 max-w-4xl mx-auto">
      <div class="mockup-browser-toolbar">
        <div class="input border border-base-300">
          freshfont.local
        </div>
      </div>

      <div class="bg-base-100 px-8 py-10 min-h-[360px]">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-widest opacity-50">
                Font Preview
              </p>

              <h2
                class="text-5xl mt-2"
                style={font
                  ? `font-family: "${family}", sans-serif; font-weight: 700;`
                  : undefined}
              >
                {family}
              </h2>
            </div>

            {font && (
              <a
                href={`/fonts/${font.slug}`}
                class="btn btn-sm btn-ghost"
              >
                Details
              </a>
            )}
          </div>

          <p
            class="text-3xl leading-snug mt-8"
            style={font
              ? `font-family: "${family}", sans-serif; font-weight: 400;`
              : undefined}
          >
            Sphinx of black quartz, judge my vow.
          </p>

          <p
            class="text-xl tracking-widest"
            style={font
              ? `font-family: "${family}", sans-serif; font-weight: 400;`
              : undefined}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789
          </p>

          {font && (
            <div class="mt-8">
              <p class="text-sm font-semibold mb-3">
                Available weights
              </p>

              <div class="flex flex-wrap gap-2">
                {weights.map((weight) => (
                  <span
                    key={weight}
                    class="badge badge-outline"
                    style={`font-family: "${family}", sans-serif; font-weight: ${weight};`}
                  >
                    {weight}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}