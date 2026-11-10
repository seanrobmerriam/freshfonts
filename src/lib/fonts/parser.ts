import type { FontVariant } from "./types.ts";

const FONT_FILENAME_PATTERN = /^([1-9]00)(-italic)?\.woff2$/;

export function parseFontFilename(filename: string): FontVariant {
	const match = filename.match(FONT_FILENAME_PATTERN);

	if (!match) {
		throw new Error(`Unsupported font filename: ${filename}`);
	}

	const [, weight, italic] = match;

	return {
		weight: Number(weight),
		style: italic ? "italic" : "normal",
		file: filename,
	};
}
