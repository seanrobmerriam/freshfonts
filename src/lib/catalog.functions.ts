import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getFonts } from "./fonts/registry";
import { getIconSets } from "./icons/registry";

export const loadHome = createServerFn({ method: "GET" }).handler(async () => {
	const [fonts, iconSets] = await Promise.all([getFonts(), getIconSets()]);
	return { fonts, iconSets, origin: new URL(getRequest().url).origin };
});

const slugInput = (value: string) => {
	if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/i.test(value)) {
		throw new Error("Invalid asset slug");
	}
	return value;
};

export const loadFont = createServerFn({ method: "GET" })
	.validator(slugInput)
	.handler(async ({ data: slug }) => ({
		font: (await getFonts()).find((font) => font.slug === slug) ?? null,
		slug,
		origin: new URL(getRequest().url).origin,
	}));

export const loadIcons = createServerFn({ method: "GET" })
	.validator(slugInput)
	.handler(async ({ data: slug }) => ({
		iconSet: (await getIconSets()).find((set) => set.slug === slug) ?? null,
		slug,
		origin: new URL(getRequest().url).origin,
	}));
