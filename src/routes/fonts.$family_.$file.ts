import { createFileRoute } from "@tanstack/react-router";
import { isMissingFont, readFont } from "../lib/fonts/storage.server.ts";

export const Route = createFileRoute("/fonts/$family_/$file")({
	server: {
		handlers: {
			async GET({ params }) {
				const family = params.family;
				const file = params.file;

				if (!isSafePathSegment(family) || !isSafeFontFilename(file)) {
					return new Response("Not found", {
						status: 404,
					});
				}

				try {
					const data = new Uint8Array(await readFont(family, file));

					return new Response(data, {
						headers: {
							"Content-Type": "font/woff2",
							"Cache-Control": "public, max-age=31536000, immutable",
							"Access-Control-Allow-Origin": "*",
						},
					});
				} catch (error) {
					if (isMissingFont(error)) {
						return new Response("Font not found", {
							status: 404,
						});
					}

					console.error(error);

					return new Response("Internal Server Error", {
						status: 500,
					});
				}
			},
		},
	},
});

function isSafePathSegment(value: string): boolean {
	return /^[a-z0-9][a-z0-9-]*$/i.test(value);
}

function isSafeFontFilename(value: string): boolean {
	return /^[1-9]00(?:-italic)?\.woff2$/.test(value);
}
