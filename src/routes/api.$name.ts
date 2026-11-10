import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/$name")({
	server: {
		handlers: {
			GET: ({ params }) =>
				new Response(
					`Hello, ${params.name.charAt(0).toUpperCase() + params.name.slice(1)}!`,
				),
		},
	},
});
