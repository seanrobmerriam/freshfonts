import { Fieldset } from "@ark-ui/react/fieldset";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { IconImage } from "../components/ui/IconImage";
import { SearchField } from "../components/ui/SearchField";
import { Spinner } from "../components/ui/Spinner";
import { VariantSelect } from "../components/ui/VariantSelect";
import { addIcon, searchIcons } from "../lib/icons/search.functions";
import {
	iconPreviewUrl,
	type SearchIcon,
	variantFilename,
} from "../lib/icons/thesvg";

export const Route = createFileRoute("/icon-search")({
	head: () => ({ meta: [{ title: "Search for icons | Freshfonts" }] }),
	component: IconSearchPage,
});

function IconSearchPage() {
	const search = useServerFn(searchIcons);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<{
		icons: SearchIcon[];
		total: number;
		query: string;
		id: number;
	} | null>(null);
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState("");
	const requestId = useRef(0);

	async function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const term = query.trim();
		if (!term) return;
		const id = ++requestId.current;
		setSearching(true);
		setError("");
		try {
			const result = await search({ data: term });
			if (id !== requestId.current) return;
			if (!result.ok) {
				setError(result.error);
			} else {
				setResults({
					icons: result.icons,
					total: result.total,
					query: term,
					id,
				});
			}
		} catch {
			if (id === requestId.current)
				setError("Could not search theSVG. Please try again.");
		} finally {
			if (id === requestId.current) setSearching(false);
		}
	}

	return (
		<main className="max-w-screen-xl mx-auto px-4 py-12">
			<Link to="/" className="ui-link ui-link-hover text-sm opacity-70">
				← Back to Freshfonts
			</Link>
			<header className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-4xl sm:text-5xl font-bold">Search for icons</h1>
					<p className="mt-3 opacity-70">
						Find brand icons from theSVG and add your favorites to the shared
						catalog.
					</p>
				</div>
				<Link
					to="/icons/$collection"
					params={{ collection: "thesvg" }}
					className="ui-button ui-button-outline ui-button-sm"
				>
					View added icons
				</Link>
			</header>
			<form onSubmit={handleSearch} className="max-w-2xl">
				<Fieldset.Root>
					<Fieldset.Legend className="sr-only">
						Search theSVG catalog
					</Fieldset.Legend>
					<div className="flex items-end gap-2">
						<SearchField value={query} onValueChange={setQuery} />
						<Button
							type="submit"
							className="ui-button-primary"
							disabled={!query.trim()}
						>
							{searching && <Spinner label="Searching" />}Search
						</Button>
					</div>
				</Fieldset.Root>
			</form>
			{error && (
				<p role="alert" className="ui-notice ui-notice-error mt-6">
					{error}
				</p>
			)}
			<output aria-live="polite" className="block mt-6 text-sm opacity-70">
				{searching
					? "Searching theSVG…"
					: results
						? `Showing ${results.icons.length} of ${results.total} results for “${results.query}”.`
						: "Search by brand, name, or category to get started."}
			</output>
			{results && results.icons.length === 0 && !searching && (
				<p className="mt-8 rounded-xl border border-line p-8">
					No icons found. Try a different name or a broader category.
				</p>
			)}
			<section
				aria-label="Icon search results"
				aria-busy={searching}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6"
			>
				{results?.icons.map((icon) => (
					<IconCard key={`${results.id}-${icon.slug}`} icon={icon} />
				))}
			</section>
			<p className="mt-10 text-xs opacity-60">
				Icons provided by{" "}
				<a
					href="https://thesvg.org"
					target="_blank"
					rel="noreferrer"
					className="ui-link"
				>
					theSVG
				</a>
				. Each icon’s license is shown below its name.
			</p>
		</main>
	);
}

function IconCard({ icon }: { icon: SearchIcon }) {
	const add = useServerFn(addIcon);
	const router = useRouter();
	const [variant, setVariant] = useState(
		icon.variants.includes("default") ? "default" : icon.variants[0],
	);
	const [installed, setInstalled] = useState(icon.installed);
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState("");
	const isInstalled = installed.includes(variant);

	async function handleAdd() {
		if (adding || isInstalled) return;
		setAdding(true);
		setError("");
		try {
			const result = await add({ data: { slug: icon.slug, variant } });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			setInstalled((current) => [...current, variant]);
			await router.invalidate();
		} catch {
			setError("Could not add this icon. Please try again.");
		} finally {
			setAdding(false);
		}
	}

	return (
		<article className="ui-card bg-surface border border-line">
			<div className="ui-card-body p-5">
				<IconImage
					src={iconPreviewUrl(icon.slug, variant)}
					alt={`${icon.title}, ${variant}`}
					className="h-28 rounded-xl bg-subtle"
					imageClassName="max-w-full h-14"
				/>
				<h2 className="font-semibold mt-2 break-words">{icon.title}</h2>
				<p className="text-xs opacity-60">
					License: {icon.license || "See source"}
				</p>
				<VariantSelect
					label={`Variant for ${icon.title}`}
					variants={icon.variants}
					value={variant}
					disabled={adding}
					onValueChange={(value) => {
						setVariant(value);
						setError("");
					}}
				/>
				<Button
					type="button"
					className={`ui-button mt-2 ${isInstalled ? "ui-button-outline" : "ui-button-primary"}`}
					onClick={handleAdd}
					disabled={adding || isInstalled}
					aria-label={`${isInstalled ? "Added" : "Add"} ${icon.title} ${variant}`}
				>
					{adding ? (
						<>
							<Spinner label="Adding icon" />
							Adding…
						</>
					) : isInstalled ? (
						"Added"
					) : (
						"Add"
					)}
				</Button>
				{isInstalled && (
					<a
						className="ui-link text-sm text-center"
						href={`/icon-preview/thesvg/imported/${icon.slug}/${variantFilename(variant)}.svg`}
						target="_blank"
						rel="noreferrer"
					>
						Open SVG
					</a>
				)}
				{error && (
					<p role="alert" className="text-danger text-sm">
						{error}
					</p>
				)}
			</div>
		</article>
	);
}
