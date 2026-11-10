import CopyButton from "../islands/CopyButton.tsx";
import FontPreviewButton from "../islands/FontPreviewButton.tsx";
import { buildFontEmbedCode } from "../lib/embed.ts";
import type { FontFamily } from "../lib/fonts/types.ts";

interface FontListProps {
	fonts: FontFamily[];
	origin: string;
}

export function FontList({ fonts, origin }: FontListProps) {
	return (
		<section className="w-full">
			<header className="mb-4">
				<h2 className="text-2xl font-bold">Fonts</h2>

				<p className="text-sm opacity-60 mt-1">
					{fonts.length} {fonts.length === 1 ? "family" : "families"}
				</p>
			</header>

			{fonts.length === 0 ? (
				<div className="alert">
					<span>
						No fonts found in <code>./assets/fonts</code>.
					</span>
				</div>
			) : (
				<ul className="list bg-base-100 rounded-box border border-base-300">
					{fonts.map((font) => {
						const weights = [
							...new Set(font.variants.map((variant) => variant.weight)),
						];

						const hasItalic = font.variants.some(
							(variant) => variant.style === "italic",
						);

						const embed = buildFontEmbedCode(origin, font.slug);

						return (
							<li className="list-row" key={font.slug}>
								<div className="size-12 rounded-box bg-base-200 flex items-center justify-center">
									<span
										className="text-xl"
										style={{
											fontFamily: `"${font.family}", sans-serif`,
											fontWeight: 700,
										}}
									>
										Aa
									</span>
								</div>

								<div className="min-w-0">
									<div className="font-bold">{font.family}</div>

									<div className="text-xs opacity-60 mt-1">
										{weights.join(" · ")}
										{hasItalic ? " · Italic" : ""}
									</div>
								</div>

								<div className="flex items-center gap-1">
									<FontPreviewButton
										slug={font.slug}
										family={font.family}
										weights={weights}
									/>

									<a
										href={`/fonts/${font.slug}`}
										className="btn btn-sm btn-ghost"
									>
										Details
									</a>

									<a
										href={`/fonts/${font.slug}.css`}
										className="btn btn-sm btn-ghost"
										target="_blank"
										rel="noopener noreferrer"
									>
										CSS
									</a>

									<CopyButton
										value={embed}
										label="Embed"
										copiedLabel="Copied"
										className="btn btn-sm"
									/>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
