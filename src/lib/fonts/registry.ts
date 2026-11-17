import { readdir } from "node:fs/promises";
import { parseFontFilename } from "./parser.ts";
import { listFontKeys } from "./storage.server.ts";
import type { FontFamily, FontVariant } from "./types.ts";

export const DEFAULT_FONT_DIRECTORY = "./assets/fonts";

export async function getFonts(root?: string): Promise<FontFamily[]> {
	if (root === undefined) {
		const keys = await listFontKeys();
		if (keys !== null) return fontsFromKeys(keys);
	}
	root ??= DEFAULT_FONT_DIRECTORY;
	const fonts: FontFamily[] = [];

	for (const entry of await readdir(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
			continue;
		}

		const slug = entry.name;
		const directory = `${root}/${slug}`;

		const variants = await getFontVariants(directory);

		if (variants.length === 0) {
			continue;
		}

		fonts.push({
			slug,
			family: slugToFamilyName(slug),
			variants,
		});
	}

	return fonts.sort((a, b) => a.family.localeCompare(b.family));
}

async function getFontVariants(directory: string): Promise<FontVariant[]> {
	const variants: FontVariant[] = [];

	for (const entry of await readdir(directory, { withFileTypes: true })) {
		if (!entry.isFile()) {
			continue;
		}

		try {
			variants.push(parseFontFilename(entry.name));
		} catch {
			// Ignore files that don't match our naming convention.
		}
	}

	return variants.sort((a, b) => {
		if (a.weight !== b.weight) {
			return a.weight - b.weight;
		}

		if (a.style === b.style) {
			return 0;
		}

		return a.style === "normal" ? -1 : 1;
	});
}

export function slugToFamilyName(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function fontsFromKeys(keys: string[]): FontFamily[] {
	const families = new Map<string, FontVariant[]>();
	for (const key of keys) {
		const parts = key.split("/");
		if (parts.length !== 2 || !/^[a-z0-9][a-z0-9-]*$/i.test(parts[0])) continue;
		try {
			const variant = parseFontFilename(parts[1]);
			const variants = families.get(parts[0]) ?? [];
			variants.push(variant);
			families.set(parts[0], variants);
		} catch {
			// Ignore unsupported keys just as the local registry ignores files.
		}
	}
	return [...families]
		.map(([slug, variants]) => ({
			slug,
			family: slugToFamilyName(slug),
			variants: variants.sort(
				(a, b) =>
					a.weight - b.weight ||
					(a.style === b.style ? 0 : a.style === "normal" ? -1 : 1),
			),
		}))
		.sort((a, b) => a.family.localeCompare(b.family));
}
