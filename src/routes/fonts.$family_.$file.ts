import { readFile } from "node:fs/promises";
import { createFileRoute } from "@tanstack/react-router";

const FONT_ROOT = "./assets/fonts";

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

				const path = `${FONT_ROOT}/${family}/${file}`;

				try {
					const data = new Uint8Array(await readFile(path));

					return new Response(data, {
						headers: {
							"Content-Type": "font/woff2",
							"Cache-Control": "public, max-age=31536000, immutable",
							"Access-Control-Allow-Origin": "*",
						},
					});
				} catch (error) {
					if ((error as NodeJS.ErrnoException).code === "ENOENT") {
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
