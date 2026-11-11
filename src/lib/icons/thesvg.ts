import { z } from "zod";

export const iconSlug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,99}$/);
export const iconVariant = z
	.string()
	.max(60)
	.regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/);
export const searchInput = z
	.string()
	.trim()
	.min(1, "Enter an icon name.")
	.max(100);
export const addIconInput = z.object({ slug: iconSlug, variant: iconVariant });

export interface SearchIcon {
	slug: string;
	title: string;
	license: string;
	variants: string[];
	installed: string[];
}

export function variantFilename(variant: string): string {
	return variant.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function iconPreviewUrl(slug: string, variant: string): string {
	return `https://thesvg.org/icons/${encodeURIComponent(slug)}/${variantFilename(variant)}.svg`;
}
