import { useEffect } from "react";
import { useFontPreview } from "./fontPreviewState";

interface BrowserMockupProps {
	defaultFont?: {
		slug: string;
		family: string;
		weights: number[];
	};
}

export default function BrowserMockup({ defaultFont }: BrowserMockupProps) {
	const { selectedFont } = useFontPreview();
	const font = selectedFont ?? defaultFont ?? null;

	const slug = font?.slug;

	useEffect(() => {
		if (!slug) {
			return;
		}

		const id = `font-preview-${slug}`;

		const existing = document.getElementById(id);

		if (existing) {
			return;
		}

		const link = document.createElement("link");

		link.id = id;
		link.rel = "stylesheet";
		link.href = `/fonts/${slug}.css`;

		document.head.appendChild(link);
	}, [slug]);

	const family = font?.family ?? "FreshFont";

	const weights = font?.weights.length ? font.weights : [400, 700];

	return (
		<div className="mockup-browser border border-base-300 bg-base-200 max-w-4xl mx-auto">
			<div className="mockup-browser-toolbar">
				<div className="input border border-base-300">freshfont.local</div>
			</div>

			<div className="bg-base-100 px-8 py-10 min-h-[360px]">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-widest opacity-50">
								Font Preview
							</p>

							<h2
								className="text-5xl mt-2"
								style={
									font
										? { fontFamily: `"${family}", sans-serif`, fontWeight: 700 }
										: undefined
								}
							>
								{family}
							</h2>
						</div>

						{font && (
							<a href={`/fonts/${slug}`} className="btn btn-sm btn-ghost">
								Details
							</a>
						)}
					</div>

					<p
						className="text-3xl leading-snug mt-8"
						style={
							font
								? { fontFamily: `"${family}", sans-serif`, fontWeight: 400 }
								: undefined
						}
					>
						Sphinx of black quartz, judge my vow.
					</p>

					<p
						className="text-xl tracking-widest"
						style={
							font
								? { fontFamily: `"${family}", sans-serif`, fontWeight: 400 }
								: undefined
						}
					>
						ABCDEFGHIJKLMNOPQRSTUVWXYZ
						<br />
						abcdefghijklmnopqrstuvwxyz
						<br />
						0123456789
					</p>

					{font && (
						<div className="mt-8">
							<p className="text-sm font-semibold mb-3">Available weights</p>

							<div className="flex flex-wrap gap-2">
								{weights.map((weight) => (
									<span
										key={weight}
										className="badge badge-outline"
										style={{
											fontFamily: `"${family}", sans-serif`,
											fontWeight: weight,
										}}
									>
										{weight}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
