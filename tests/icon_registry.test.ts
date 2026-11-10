import { assertEquals } from "./assert.ts";
import { test } from "node:test";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getIconSets } from "../src/lib/icons/registry.ts";

async function createTempIconDirectory(): Promise<string> {
  const root = await fs.mkdtemp(join(tmpdir(), "freshfonts-"));

  await fs.mkdir(`${root}/lucide`, {
    recursive: true,
  });

  await fs.writeFile(
    `${root}/lucide/search.svg`,
    "<svg></svg>",
  );

  await fs.writeFile(
    `${root}/lucide/menu.svg`,
    "<svg></svg>",
  );

  await fs.writeFile(
    `${root}/lucide/github.svg`,
    "<svg></svg>",
  );

  return root;
}

test("discovers SVG icon sets", async () => {
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
    await fs.rm(root, {
      recursive: true, force: true,
    });
  }
});

test("ignores non-svg files", async () => {
  const root = await createTempIconDirectory();

  try {
    await fs.writeFile(
      `${root}/lucide/README.md`,
      "",
    );

    await fs.writeFile(
      `${root}/lucide/example.png`,
      "",
    );

    const iconSets = await getIconSets(root);

    assertEquals(iconSets[0].count, 3);
  } finally {
    await fs.rm(root, {
      recursive: true, force: true,
    });
  }
});

test("discovers nested SVGs with distinct relative names and paths", async () => {
  const root = await createTempIconDirectory();
  try {
    await fs.mkdir(`${root}/thesvg/brands/color`, { recursive: true });
    await fs.mkdir(`${root}/thesvg/brands/mono`, { recursive: true });
    await fs.writeFile(`${root}/thesvg/brands/color/example.svg`, "<svg></svg>");
    await fs.writeFile(`${root}/thesvg/brands/mono/example.svg`, "<svg></svg>");
    await fs.writeFile(`${root}/thesvg/brands/color/download`, "<!DOCTYPE html><html></html>");
    await fs.symlink(`${root}/lucide`, `${root}/thesvg/linked`, "dir");
    const set = (await getIconSets(root)).find((set) => set.slug === "thesvg");
    assertEquals(set?.icons, [
      { name: "brands/color/example", file: "brands/color/example.svg" },
      { name: "brands/mono/example", file: "brands/mono/example.svg" },
    ]);
    assertEquals(set?.count, 2);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
