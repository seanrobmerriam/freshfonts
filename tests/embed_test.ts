import { assertEquals } from "jsr:@std/assert";

import {
  buildFontEmbedCode,
  buildIconHtml,
  buildIconUrl,
} from "../lib/embed.ts";

Deno.test("builds a font embed tag", () => {
  assertEquals(
    buildFontEmbedCode(
      "https://fonts.example.com",
      "inter",
    ),
    '<link rel="stylesheet" href="https://fonts.example.com/fonts/inter.css">',
  );
});

Deno.test("builds an icon URL", () => {
  assertEquals(
    buildIconUrl(
      "https://fonts.example.com",
      "lucide",
      "search.svg",
    ),
    "https://fonts.example.com/icons/lucide/search.svg",
  );
});

Deno.test("builds icon HTML", () => {
  assertEquals(
    buildIconHtml(
      "https://fonts.example.com",
      "lucide",
      "search.svg",
    ),
    '<img src="https://fonts.example.com/icons/lucide/search.svg" alt="">',
  );
});
