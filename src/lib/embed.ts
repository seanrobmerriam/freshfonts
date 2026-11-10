export function buildFontEmbedCode(origin: string, family: string): string {
	return `<link rel="stylesheet" href="${origin}/fonts/${family}.css">`;
}

export function buildIconUrl(
	origin: string,
	collection: string,
	file: string,
): string {
	return `${origin}/icons/${collection}/${file}`;
}

export function buildIconHtml(
	origin: string,
	collection: string,
	file: string,
): string {
	const url = buildIconUrl(origin, collection, file);

	return `<img src="${url}" alt="">`;
}
