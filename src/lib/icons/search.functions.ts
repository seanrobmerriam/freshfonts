import { createServerFn } from "@tanstack/react-start";
import { addIconInput, searchInput } from "./thesvg";
import { iconSearchService } from "./thesvg.server";

export const searchIcons = createServerFn({ method: "GET" })
	.validator((value: string) => searchInput.parse(value))
	.handler(async ({ data }) => {
		try {
			return { ok: true as const, ...(await iconSearchService.search(data)) };
		} catch (error) {
			console.error("theSVG search failed", error);
			return {
				ok: false as const,
				error: "Could not search theSVG. Please try again.",
			};
		}
	});

export const addIcon = createServerFn({ method: "POST" })
	.validator((value: { slug: string; variant: string }) =>
		addIconInput.parse(value),
	)
	.handler(async ({ data }) => {
		try {
			return { ok: true as const, ...(await iconSearchService.add(data)) };
		} catch (error) {
			console.error("theSVG import failed", error);
			return {
				ok: false as const,
				error:
					"Could not add this icon. Please try again or choose another variant.",
			};
		}
	});
