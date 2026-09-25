import type { FontFamily, FontVariant } from "./types.ts";

export interface RequestedFont {
  family: string;
  weights: number[];
}

export function parseFontQuery(url: URL): RequestedFont[] {
  const families = url.searchParams.getAll("family");

  return families.map((value) => {
    const [familyPart, weightPart] = value.split(":");

    const family = familyPart.trim();

    if (!family) {
      throw new Error("Font family is required");
    }

    const weights = weightPart
      ? weightPart
        .split(",")
        .map((weight) => Number(weight))
        .filter((weight) => Number.isInteger(weight))
      : [];

    return {
      family,
      weights,
    };
  });
}

export function selectFontVariants(
  font: FontFamily,
  weights: number[],
): FontVariant[] {
  if (weights.length === 0) {
    return font.variants;
  }

  const requested = new Set(weights);

  return font.variants.filter((variant) =>
    requested.has(variant.weight)
  );
}

export function familyNameToSlug(
  family: string,
): string {
  return family
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}