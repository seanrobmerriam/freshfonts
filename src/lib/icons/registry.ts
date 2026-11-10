import { readdir } from "node:fs/promises";
import type { Icon, IconSet } from "./types.ts";

export const DEFAULT_ICON_DIRECTORY = "./assets/icons";

export async function getIconSets(
	root = DEFAULT_ICON_DIRECTORY,
): Promise<IconSet[]> {
	const sets: IconSet[] = [];

	for (const entry of await readdir(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
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

async function getIcons(directory: string, prefix = ""): Promise<Icon[]> {
	const icons: Icon[] = [];

	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = `${prefix}${entry.name}`;
		if (entry.isDirectory()) {
			icons.push(...(await getIcons(`${directory}/${entry.name}`, `${file}/`)));
			continue;
		}

		if (!entry.isFile()) {
			continue;
		}

		if (!entry.name.toLowerCase().endsWith(".svg")) {
			continue;
		}

		icons.push({
			name: file.replace(/\.svg$/i, ""),
			file,
		});
	}

	return icons.sort((a, b) => a.name.localeCompare(b.name));
}

function slugToDisplayName(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}
