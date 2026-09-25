import { assertEquals, assertStringIncludes } from "jsr:@std/assert";

import { generateFontCss } from "../lib/fonts/css.ts";

Deno.test("generates CSS for a font family", () => {
  const css = generateFontCss(
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
          weight: 700,
          style: "italic",
          file: "700-italic.woff2",
        },
      ],
    },
    "https://fonts.example.com",
  );

  assertStringIncludes(
    css,
    'font-family: "Inter";',
  );

  assertStringIncludes(
    css,
    "font-weight: 400;",
  );

  assertStringIncludes(
    css,
    "font-style: italic;",
  );

  assertStringIncludes(
    css,
    'url("https://fonts.example.com/fonts/inter/700-italic.woff2")',
  );
});

Deno.test("generates one font-face block per variant", () => {
  const css = generateFontCss(
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
          weight: 700,
          style: "normal",
          file: "700.woff2",
        },
      ],
    },
    "https://fonts.example.com",
  );

  const count = css.match(/@font-face/g)?.length ?? 0;

  assertEquals(count, 2);
});
