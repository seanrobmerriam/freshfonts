import { createFileRoute } from "@tanstack/react-router";
import { generateFontCss } from "../lib/fonts/css.ts";
import { getFonts } from "../lib/fonts/registry.ts";

export const Route = createFileRoute("/fonts/{$family}.css")({
	server: {
		handlers: {
			async GET({ request, params }) {
				const familySlug = params.family;

				const fonts = await getFonts();
				const font = fonts.find((font) => font.slug === familySlug);

				if (!font) {
					return new Response("Font family not found", {
						status: 404,
					});
				}

				const css = generateFontCss(font, new URL(request.url).origin);

				return new Response(css, {
					headers: {
						"Content-Type": "text/css; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
						"Access-Control-Allow-Origin": "*",
					},
				});
			},
		},
	},
});
