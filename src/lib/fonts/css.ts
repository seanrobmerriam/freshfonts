import type { FontFamily, FontVariant } from "./types.ts";

export function generateFontCss(
	font: FontFamily,
	origin: string,
	variants: FontVariant[] = font.variants,
): string {
	return variants
		.map((variant) => {
			return `@font-face {
  font-family: "${font.family}";
  font-style: ${variant.style};
  font-weight: ${variant.weight};
  font-display: swap;
  src: url("${origin}/fonts/${font.slug}/${variant.file}") format("woff2");
}`;
		})
		.join("\n\n");
}
