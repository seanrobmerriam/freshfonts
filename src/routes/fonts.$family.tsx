import { createFileRoute } from "@tanstack/react-router";
import { ScrollPanel } from "../components/ui/ScrollPanel";
import CopyButton from "../islands/CopyButton.tsx";
import { loadFont } from "../lib/catalog.functions";
export const Route = createFileRoute("/fonts/$family")({
	loader: ({ params }) => loadFont({ data: params.family }),
	head: ({ loaderData }) => ({
		meta: [
			{ title: `${loaderData?.font?.family ?? "Font not found"} | FreshFont` },
		],
		links: loaderData?.font
			? [{ rel: "stylesheet", href: `/fonts/${loaderData.font.slug}.css` }]
			: [],
	}),
	component: Page,
});
function Page() {
	const { font, slug, origin } = Route.useLoaderData();
	if (!font) {
		return (
			<main className="max-w-screen-lg mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold">Font not found</h1>

				<p className="mt-4">
					No font family exists with the slug <code>{slug}</code>.
				</p>

				<a href="/" className="ui-button mt-6">
					Back
				</a>
			</main>
		);
	}

	const stylesheetUrl = `${origin}/fonts/${font.slug}.css`;

	const embedCode = `<link rel="stylesheet" href="${stylesheetUrl}">`;

	const cssUsage = `font-family: "${font.family}", sans-serif;`;

	const weights = [
		...new Set(font.variants.map((variant) => variant.weight)),
	].sort((a, b) => a - b);

	return (
		<main className="max-w-screen-xl mx-auto px-4 py-12">
			<div className="flex items-start justify-between gap-6 flex-wrap">
				<div>
					<a href="/" className="ui-link ui-link-hover text-sm opacity-70">
						← Back to fonts
					</a>

					<h1 className="text-5xl font-bold mt-3">{font.family}</h1>

					<p className="mt-2 opacity-70">{font.variants.length} variants</p>
				</div>
			</div>

			<section className="mt-10">
				<h2 className="text-2xl font-bold mb-4">Embed</h2>

				<div className="bg-subtle rounded-xl p-4">
					<div className="flex items-start gap-4">
						<ScrollPanel label="Embed code" className="flex-1">
							<code className="whitespace-pre">{embedCode}</code>
						</ScrollPanel>

						<CopyButton value={embedCode} label="Copy" />
					</div>
				</div>

				<div className="bg-subtle rounded-xl p-4 mt-3">
					<div className="flex items-start gap-4">
						<ScrollPanel label="Embed code" className="flex-1">
							<code className="whitespace-pre">{cssUsage}</code>
						</ScrollPanel>

						<CopyButton value={cssUsage} label="Copy CSS" />
					</div>
				</div>
			</section>

			<section className="mt-12">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">Preview</h2>

						<p className="opacity-60 mt-1">Available weights</p>
					</div>
				</div>

				<div className="mt-6 space-y-4">
					{weights.map((weight) => (
						<div
							className="ui-card bg-surface shadow-sm border border-line"
							key={weight}
						>
							<div className="ui-card-body">
								<div className="flex justify-between items-center mb-4">
									<span className="ui-badge ">{weight}</span>

									<span className="text-xs opacity-50">{font.family}</span>
								</div>

								<p
									className="text-4xl leading-tight"
									style={{
										fontFamily: `"${font.family}", sans-serif`,
										fontWeight: weight,
										fontStyle: "normal",
									}}
								>
									The quick brown fox jumps over the lazy dog.
								</p>

								<p
									className="text-xl mt-3 opacity-80"
									style={{
										fontFamily: `"${font.family}", sans-serif`,
										fontWeight: weight,
										fontStyle: "normal",
									}}
								>
									ABCDEFGHIJKLMNOPQRSTUVWXYZ
									<br />
									abcdefghijklmnopqrstuvwxyz
									<br />
									0123456789
								</p>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
