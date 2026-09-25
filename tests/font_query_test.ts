import {
  assertEquals,
  assertThrows,
} from "jsr:@std/assert";

import {
  familyNameToSlug,
  parseFontQuery,
  selectFontVariants,
} from "../lib/fonts/query.ts";

Deno.test("parses one requested font family", () => {
  const url = new URL(
    "https://fonts.example.com/css?family=Inter:400,500,700",
  );

  assertEquals(parseFontQuery(url), [
    {
      family: "Inter",
      weights: [400, 500, 700],
    },
  ]);
});

Deno.test("parses multiple font families", () => {
  const url = new URL(
    "https://fonts.example.com/css?family=Inter:400,700&family=JetBrains%20Mono:400,700",
  );

  assertEquals(parseFontQuery(url), [
    {
      family: "Inter",
      weights: [400, 700],
    },
    {
      family: "JetBrains Mono",
      weights: [400, 700],
    },
  ]);
});

Deno.test("allows a family without explicit weights", () => {
  const url = new URL(
    "https://fonts.example.com/css?family=Inter",
  );

  assertEquals(parseFontQuery(url), [
    {
      family: "Inter",
      weights: [],
    },
  ]);
});

Deno.test("rejects an empty family", () => {
  const url = new URL(
    "https://fonts.example.com/css?family=:400",
  );

  assertThrows(
    () => parseFontQuery(url),
    Error,
    "Font family is required",
  );
});

Deno.test("converts family names to slugs", () => {
  assertEquals(
    familyNameToSlug("JetBrains Mono"),
    "jetbrains-mono",
  );

  assertEquals(
    familyNameToSlug("  IBM Plex Sans  "),
    "ibm-plex-sans",
  );
});

Deno.test("selects requested weights", () => {
  const variants = selectFontVariants(
    {
      slug: "inter",
      family: "Inter",
      variants: [
        {
          weight: 400,
          style: "normal",
          file: "400.woff2",
        },
        {
          weight: 500,
          style: "normal",
          file: "500.woff2",
        },
        {
          weight: 700,
          style: "normal",
          file: "700.woff2",
        },
      ],
    },
    [400, 700],
  );

  assertEquals(variants, [
    {
      weight: 400,
      style: "normal",
      file: "400.woff2",
    },
    {
      weight: 700,
      style: "normal",
      file: "700.woff2",
    },
  ]);
});