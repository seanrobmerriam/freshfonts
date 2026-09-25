import { assertEquals } from "jsr:@std/assert";

import { getIconSets } from "../lib/icons/registry.ts";

async function createTempIconDirectory(): Promise<string> {
  const root = await Deno.makeTempDir();

  await Deno.mkdir(`${root}/lucide`, {
    recursive: true,
  });

  await Deno.writeTextFile(
    `${root}/lucide/search.svg`,
    "<svg></svg>",
  );

  await Deno.writeTextFile(
    `${root}/lucide/menu.svg`,
    "<svg></svg>",
  );

  await Deno.writeTextFile(
    `${root}/lucide/github.svg`,
    "<svg></svg>",
  );

  return root;
}

Deno.test("discovers SVG icon sets", async () => {
  const root = await createTempIconDirectory();

  try {
    const iconSets = await getIconSets(root);

    assertEquals(iconSets, [
      {
        slug: "lucide",
        name: "Lucide",
        count: 3,
        icons: [
          {
            name: "github",
            file: "github.svg",
          },
          {
            name: "menu",
            file: "menu.svg",
          },
          {
            name: "search",
            file: "search.svg",
          },
        ],
      },
    ]);
  } finally {
    await Deno.remove(root, {
      recursive: true,
    });
  }
});

Deno.test("ignores non-svg files", async () => {
  const root = await createTempIconDirectory();

  try {
    await Deno.writeTextFile(
      `${root}/lucide/README.md`,
      "",
    );

    await Deno.writeTextFile(
      `${root}/lucide/example.png`,
      "",
    );

    const iconSets = await getIconSets(root);

    assertEquals(iconSets[0].count, 3);
  } finally {
    await Deno.remove(root, {
      recursive: true,
    });
  }
});
