import { createFileRoute } from "@tanstack/react-router";

import { FontList } from "../components/FontList.tsx";
import { IconList } from "../components/IconList.tsx";
import BrowserMockup from "../islands/BrowserMockup.tsx";
import { loadHome } from "../lib/catalog.functions";
export const Route = createFileRoute("/")({
	loader: () => loadHome(),
	head: () => ({
		meta: [
			{ title: "FreshFont Icon & Font Server" },
			{
				name: "description",
				content:
					"Self-hosted WOFF2 fonts and SVG icons with Google Fonts-style embeds.",
			},
		],
		links: [
			{ rel: "stylesheet", href: "/fonts/newsreader.css" },
			{ rel: "stylesheet", href: "/fonts/red-hat-mono.css" },
		],
	}),
	component: Page,
});
function Page() {
	const { fonts, iconSets, origin } = Route.useLoaderData();
	const defaultFont = fonts[0]
		? {
				slug: fonts[0].slug,
				family: fonts[0].family,
				weights: [
					...new Set(fonts[0].variants.map((variant) => variant.weight)),
				].sort((a, b) => a - b),
			}
		: undefined;

	return (
		<>
			<header className="mt-10 text-center">
				<h1 className="hero-title">Freshfonts</h1>

				<p className="mt-3 text-lg opacity-70">
					Self-hosted fonts and SVG icons with zero-config filesystem discovery.
				</p>

				<p className="mt-4 mb-10 text-sm opacity-50">
					Drop assets into <code>./assets/fonts</code> or{" "}
					<code>./assets/icons</code>.
				</p>
			</header>

			<main className="px-4 py-8 min-h-screen">
				<div className="max-w-screen-xl mx-auto">
					<BrowserMockup defaultFont={defaultFont} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 items-start">
						<FontList fonts={fonts} origin={origin} />

						<IconList iconSets={iconSets} />
					</div>
				</div>
			</main>
		</>
	);
}
