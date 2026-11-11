import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DownloadSvg } from "../components/ui/DownloadSvg";
import { buildIconUrl } from "../lib/embed";

export const Route = createFileRoute("/icon-preview/$collection/$")({
	head: () => ({ meta: [{ title: "SVG preview | Freshfonts" }] }),
	component: IconPreviewPage,
});

function IconPreviewPage() {
	const { collection, _splat: file = "" } = Route.useParams();
	const url = buildIconUrl("", collection, file);
	const [failed, setFailed] = useState(false);

	return (
		<main className="max-w-3xl mx-auto px-4 py-12">
			<Link
				to="/icons/$collection"
				params={{ collection }}
				className="ui-link ui-link-hover text-sm opacity-70"
			>
				← Back to collection
			</Link>
			<h1 className="text-3xl font-bold mt-6">SVG preview</h1>
			<p className="mt-2 text-sm opacity-70 break-all">{file}</p>
			<section
				aria-label="Icon preview"
				className="mt-6 rounded-xl border border-line min-h-96 flex items-center justify-center p-8"
				style={{
					backgroundColor: "#64748b",
					backgroundImage:
						"linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)",
					backgroundSize: "32px 32px",
					backgroundPosition: "0 0, 0 16px, 16px -16px, -16px 0px",
				}}
			>
				{failed ? (
					<p role="alert" className="bg-surface text-ink p-4 rounded-xl">
						This SVG could not be loaded. It may have been moved or removed.
					</p>
				) : (
					<img
						src={url}
						alt={file}
						width={256}
						height={256}
						className="object-contain max-w-full"
						style={{ width: 256, height: 256 }}
						onError={() => setFailed(true)}
					/>
				)}
			</section>
			<p className="mt-3 text-sm opacity-70">
				The checkerboard shows transparent areas. The original SVG is unchanged.
			</p>
			<div className="flex flex-wrap gap-3 mt-6">
				<DownloadSvg
					url={url}
					fileName={file.split("/").at(-1) || "icon.svg"}
				/>
				<a
					href={url}
					target="_blank"
					rel="noreferrer"
					className="ui-button ui-button-outline"
				>
					Original SVG
				</a>
			</div>
		</main>
	);
}
