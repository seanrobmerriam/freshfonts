import { assertEquals } from "jsr:@std/assert";

import { getFonts } from "../lib/fonts/registry.ts";

async function createTempFontsDirectory(): Promise<string> {
  const root = await Deno.makeTempDir();

  await Deno.mkdir(`${root}/inter`, {
    recursive: true,
  });

  await Deno.writeTextFile(
    `${root}/inter/400.woff2`,
    "",
  );

  await Deno.writeTextFile(
    `${root}/inter/700.woff2`,
    "",
  );

  await Deno.writeTextFile(
    `${root}/inter/700-italic.woff2`,
    "",
  );

  return root;
}

Deno.test("discovers font families", async () => {
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
    await Deno.remove(root, {
      recursive: true,
    });
  }
});

Deno.test("ignores non-directory entries at the font root", async () => {
  const root = await createTempFontsDirectory();

  try {
    await Deno.writeTextFile(
      `${root}/README.md`,
      "fonts",
    );

    const fonts = await getFonts(root);

    assertEquals(fonts.length, 1);
    assertEquals(fonts[0].slug, "inter");
  } finally {
    await Deno.remove(root, {
      recursive: true,
    });
  }
});

Deno.test("ignores unsupported files inside a font family", async () => {
  const root = await createTempFontsDirectory();

  try {
    await Deno.writeTextFile(
      `${root}/inter/license.txt`,
      "",
    );

    const fonts = await getFonts(root);

    assertEquals(fonts[0].variants.length, 3);
  } finally {
    await Deno.remove(root, {
      recursive: true,
    });
  }
});
