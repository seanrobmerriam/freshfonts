import { readFile } from "node:fs/promises";
import { createFileRoute } from "@tanstack/react-router";

const ICON_ROOT = "./assets/icons";

export const Route = createFileRoute("/icons/$collection_/$file/$")({
	server: {
		handlers: {
			async GET({ params }) {
				const collection = params.collection;
				const file = params._splat
					? `${params.file}/${params._splat}`
					: params.file;

				if (!isSafePathSegment(collection) || !isSafeSvgPath(file)) {
					return new Response("Not found", {
						status: 404,
					});
				}

				const path = `${ICON_ROOT}/${collection}/${file}`;

				try {
					const data = new Uint8Array(await readFile(path));

					return new Response(data, {
						headers: {
							"Content-Type": "image/svg+xml; charset=utf-8",
							"Cache-Control": "public, max-age=31536000, immutable",
							"Access-Control-Allow-Origin": "*",
							...(file.startsWith("imported/")
								? {
										"Content-Security-Policy":
											"sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:",
									}
								: {}),
						},
					});
				} catch (error) {
					if ((error as NodeJS.ErrnoException).code === "ENOENT") {
						return new Response("Icon not found", {
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

function isSafeSvgPath(value: string): boolean {
	const segments = value.split("/");
	const filename = segments.pop() ?? "";
	return (
		segments.every(isSafePathSegment) &&
		/^[a-z0-9][a-z0-9._-]*\.svg$/i.test(filename)
	);
}
