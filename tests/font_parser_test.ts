import { assertEquals, assertThrows } from "jsr:@std/assert";

import { parseFontFilename } from "../lib/fonts/parser.ts";

Deno.test("parses a normal font filename", () => {
  assertEquals(parseFontFilename("400.woff2"), {
    weight: 400,
    style: "normal",
    file: "400.woff2",
  });
});

Deno.test("parses an italic font filename", () => {
  assertEquals(parseFontFilename("700-italic.woff2"), {
    weight: 700,
    style: "italic",
    file: "700-italic.woff2",
  });
});

Deno.test("rejects unsupported font extensions", () => {
  assertThrows(
    () => parseFontFilename("400.ttf"),
    Error,
    "Unsupported font filename",
  );
});

Deno.test("rejects malformed weights", () => {
  assertThrows(
    () => parseFontFilename("bold.woff2"),
    Error,
    "Unsupported font filename",
  );
});

Deno.test("rejects unsupported styles", () => {
  assertThrows(
    () => parseFontFilename("700-oblique.woff2"),
    Error,
    "Unsupported font filename",
  );
});
