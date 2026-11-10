import { assertEquals } from "./assert.ts";
import { test } from "node:test";

import {
  buildFontEmbedCode,
  buildIconHtml,
  buildIconUrl,
} from "../src/lib/embed.ts";

test("builds a font embed tag", () => {
  assertEquals(
    buildFontEmbedCode(
      "https://fonts.example.com",
      "inter",
    ),
    '<link rel="stylesheet" href="https://fonts.example.com/fonts/inter.css">',
  );
});

test("builds an icon URL", () => {
  assertEquals(
    buildIconUrl(
      "https://fonts.example.com",
      "lucide",
      "search.svg",
    ),
    "https://fonts.example.com/icons/lucide/search.svg",
  );
});

test("builds icon HTML", () => {
  assertEquals(
    buildIconHtml(
      "https://fonts.example.com",
      "lucide",
      "search.svg",
    ),
    '<img src="https://fonts.example.com/icons/lucide/search.svg" alt="">',
  );
});
