import type { Icon, IconSet } from "./types.ts";

export const DEFAULT_ICON_DIRECTORY = "./assets/icons";

export async function getIconSets(
  root = DEFAULT_ICON_DIRECTORY,
): Promise<IconSet[]> {
  const sets: IconSet[] = [];

  for await (const entry of Deno.readDir(root)) {
    if (!entry.isDirectory) {
      continue;
    }

    const slug = entry.name;
    const directory = `${root}/${slug}`;

    const icons = await getIcons(directory);

    if (icons.length === 0) {
      continue;
    }

    sets.push({
      slug,
      name: slugToDisplayName(slug),
      count: icons.length,
      icons,
    });
  }

  return sets.sort((a, b) => a.name.localeCompare(b.name));
}

async function getIcons(
  directory: string,
): Promise<Icon[]> {
  const icons: Icon[] = [];

  for await (const entry of Deno.readDir(directory)) {
    if (!entry.isFile) {
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".svg")) {
      continue;
    }

    icons.push({
      name: entry.name.replace(/\.svg$/i, ""),
      file: entry.name,
    });
  }

  return icons.sort((a, b) => a.name.localeCompare(b.name));
}

function slugToDisplayName(
  slug: string,
): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) =>
      part.charAt(0).toUpperCase() +
      part.slice(1)
    )
    .join(" ");
}
