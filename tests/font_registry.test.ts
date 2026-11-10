import { assertEquals } from "./assert.ts";
import { test } from "node:test";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getFonts } from "../src/lib/fonts/registry.ts";

async function createTempFontsDirectory(): Promise<string> {
  const root = await fs.mkdtemp(join(tmpdir(), "freshfonts-"));

  await fs.mkdir(`${root}/inter`, {
    recursive: true,
  });

  await fs.writeFile(
    `${root}/inter/400.woff2`,
    "",
  );

  await fs.writeFile(
    `${root}/inter/700.woff2`,
    "",
  );

  await fs.writeFile(
    `${root}/inter/700-italic.woff2`,
    "",
  );

  return root;
}

test("discovers font families", async () => {
  const root = await createTempFontsDirectory();

  try {
    const fonts = await getFonts(root);

    assertEquals(fonts.length, 1);

    assertEquals(fonts[0], {
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
        {
          weight: 700,
          style: "italic",
          file: "700-italic.woff2",
        },
      ],
    });
  } finally {
    await fs.rm(root, {
      recursive: true, force: true,
    });
  }
});

test("ignores non-directory entries at the font root", async () => {
  const root = await createTempFontsDirectory();

  try {
    await fs.writeFile(
      `${root}/README.md`,
      "fonts",
    );

    const fonts = await getFonts(root);

    assertEquals(fonts.length, 1);
    assertEquals(fonts[0].slug, "inter");
  } finally {
    await fs.rm(root, {
      recursive: true, force: true,
    });
  }
});

test("ignores unsupported files inside a font family", async () => {
  const root = await createTempFontsDirectory();

  try {
    await fs.writeFile(
      `${root}/inter/license.txt`,
      "",
    );

    const fonts = await getFonts(root);

    assertEquals(fonts[0].variants.length, 3);
  } finally {
    await fs.rm(root, {
      recursive: true, force: true,
    });
  }
});
