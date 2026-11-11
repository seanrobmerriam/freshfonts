import { createFileRoute } from "@tanstack/react-router";
import CopyButton from "../islands/CopyButton.tsx";
import { loadIcons } from "../lib/catalog.functions";
import { buildIconHtml, buildIconUrl } from "../lib/embed.ts";
export const Route = createFileRoute("/icons/$collection")({
	loader: ({ params }) => loadIcons({ data: params.collection }),
	head: ({ loaderData }) => ({
		meta: [
			{
				title: `${loaderData?.iconSet?.name ?? "Icon set not found"} Icons | FreshFont`,
			},
		],
	}),
	component: Page,
});
function Page() {
	const { iconSet, slug, origin } = Route.useLoaderData();
	if (!iconSet) {
		return (
			<main className="max-w-screen-xl mx-auto px-4 py-12">
				<a href="/" className="link link-hover text-sm opacity-70">
					← Back
				</a>

				<h1 className="text-4xl font-bold mt-4">Icon set not found</h1>

				<p className="mt-4 opacity-70">
					No icon collection named <code>{slug}</code> was found.
				</p>
			</main>
		);
	}

	return (
		<main className="max-w-screen-xl mx-auto px-4 py-12">
			<header>
				<a href="/" className="link link-hover text-sm opacity-70">
					← Back to FreshFont
				</a>

				<div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
					<div>
						<h1 className="text-5xl font-bold">{iconSet.name}</h1>

						<p className="mt-2 opacity-60">
							{iconSet.count} {iconSet.count === 1 ? "SVG icon" : "SVG icons"}
						</p>
					</div>

					<code className="text-sm bg-base-200 px-3 py-2 rounded-box">
						/icons/{iconSet.slug}/&lt;icon&gt;.svg
					</code>
				</div>
			</header>

			<section className="mt-10">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{iconSet.icons.map((icon) => {
						const url = buildIconUrl(origin, iconSet.slug, icon.file);

						const html = buildIconHtml(origin, iconSet.slug, icon.file);

						return (
							<article
								className="card bg-base-100 border border-base-300 hover:border-base-content/30 transition-colors"
								key={icon.name}
							>
								<div className="card-body p-4">
									<div className="h-24 flex items-center justify-center rounded-box bg-base-200">
										<img
											src={`/icons/${iconSet.slug}/${icon.file}`}
											alt=""
											className="size-10"
											loading="lazy"
										/>
									</div>

									<div className="mt-2 min-w-0">
										<h2 className="font-semibold truncate" title={icon.name}>
											{icon.name}
										</h2>

										<p
											className="text-xs opacity-50 truncate mt-1"
											title={icon.file}
										>
											{icon.file}
										</p>
									</div>

									<div className="grid grid-cols-2 gap-2 mt-2">
										<CopyButton
											value={url}
											label="URL"
											copiedLabel="Copied"
											className="btn btn-sm"
										/>

										<CopyButton
											value={html}
											label="HTML"
											copiedLabel="Copied"
											className="btn btn-sm btn-ghost"
										/>
									</div>

									<a
										href={`/icon-preview/${iconSet.slug}/${icon.file}`}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-xs btn-ghost mt-1"
									>
										Open SVG
									</a>
								</div>
							</article>
						);
					})}
				</div>
			</section>
		</main>
	);
}
