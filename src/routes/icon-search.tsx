import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useRef, useState } from "react";
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
			<Link to="/" className="link link-hover text-sm opacity-70">
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
					className="btn btn-outline btn-sm"
				>
					View added icons
				</Link>
			</header>
			<form onSubmit={handleSearch} className="max-w-2xl">
				<label htmlFor="icon-query" className="block font-semibold mb-2">
					Icon name or category
				</label>
				<div className="flex gap-2">
					<input
						id="icon-query"
						type="search"
						className="input input-bordered w-full"
						placeholder="Try GitHub, Vercel, or cloud"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						maxLength={100}
						required
					/>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={!query.trim()}
					>
						{searching && (
							<span
								className="loading loading-spinner loading-xs"
								aria-hidden="true"
							/>
						)}
						Search
					</button>
				</div>
			</form>
			{error && (
				<p role="alert" className="alert alert-error mt-6">
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
				<p className="mt-8 rounded-box border border-base-300 p-8">
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
					className="link"
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
	const [previewFailed, setPreviewFailed] = useState(false);
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
		<article className="card bg-base-100 border border-base-300">
			<div className="card-body p-5">
				<div className="h-28 rounded-box bg-base-200 flex items-center justify-center">
					{previewFailed ? (
						<span className="text-sm opacity-60">Preview unavailable</span>
					) : (
						<img
							src={iconPreviewUrl(icon.slug, variant)}
							alt={`${icon.title}, ${variant}`}
							className="max-w-full h-14 object-contain"
							loading="lazy"
							onError={() => setPreviewFailed(true)}
						/>
					)}
				</div>
				<h2 className="font-semibold mt-2 break-words">{icon.title}</h2>
				<p className="text-xs opacity-60">
					License: {icon.license || "See source"}
				</p>
				<label htmlFor={`variant-${icon.slug}`} className="text-sm mt-2">
					Variant
				</label>
				<select
					id={`variant-${icon.slug}`}
					className="select select-bordered w-full"
					value={variant}
					disabled={adding}
					onChange={(event) => {
						setVariant(event.target.value);
						setPreviewFailed(false);
						setError("");
					}}
				>
					{icon.variants.map((name) => (
						<option key={name} value={name}>
							{name.replace(/([a-z])([A-Z])/g, "$1 $2")}
						</option>
					))}
				</select>
				<button
					type="button"
					className={`btn mt-2 ${isInstalled ? "btn-outline" : "btn-primary"}`}
					onClick={handleAdd}
					disabled={adding || isInstalled}
					aria-label={`${isInstalled ? "Added" : "Add"} ${icon.title} ${variant}`}
				>
					{adding ? (
						<>
							<span
								className="loading loading-spinner loading-xs"
								aria-hidden="true"
							/>
							Adding…
						</>
					) : isInstalled ? (
						"Added"
					) : (
						"Add"
					)}
				</button>
				{isInstalled && (
					<a
						className="link text-sm text-center"
						href={`/icon-preview/thesvg/imported/${icon.slug}/${variantFilename(variant)}.svg`}
						target="_blank"
						rel="noreferrer"
					>
						Open SVG
					</a>
				)}
				{error && (
					<p role="alert" className="text-error text-sm">
						{error}
					</p>
				)}
			</div>
		</article>
	);
}
