import { Link } from "@tanstack/react-router";
import type { IconSet } from "../lib/icons/types.ts";
import { IconImage } from "./ui/IconImage";
import { ScrollPanel } from "./ui/ScrollPanel";

interface IconListProps {
	iconSets: IconSet[];
}

export function IconList({ iconSets }: IconListProps) {
	return (
		<section className="w-full">
			<header className="mb-4">
				<h2 className="text-2xl font-bold">Icon Sets</h2>

				<p className="text-sm opacity-60 mt-1">
					{iconSets.length}{" "}
					{iconSets.length === 1 ? "collection" : "collections"}
				</p>
				<Link
					to="/icon-search"
					className="ui-button ui-button-sm ui-button-outline mt-3"
				>
					Search for more icons
				</Link>
			</header>

			{iconSets.length === 0 ? (
				<div className="ui-notice">
					<span>
						No icon sets found in <code>./assets/icons</code>.
					</span>
				</div>
			) : (
				<ScrollPanel label="Icon collections">
					<ul className="ui-list bg-surface rounded-xl border border-line">
						{iconSets.map((iconSet) => {
							const preview = iconSet.icons[0];

							return (
								<li className="ui-list-row" key={iconSet.slug}>
									<div className="size-12 rounded-xl bg-subtle flex items-center justify-center">
										{preview ? (
											<IconImage
												src={`/icons/${iconSet.slug}/${preview.file}`}
												alt=""
												className="size-6"
												imageClassName="size-6"
											/>
										) : (
											<span>SVG</span>
										)}
									</div>

									<div className="min-w-0">
										<div className="font-bold">{iconSet.name}</div>

										<div className="text-xs opacity-60 mt-1">
											{iconSet.count} {iconSet.count === 1 ? "icon" : "icons"}
										</div>
									</div>

									<div>
										<a
											href={`/icons/${iconSet.slug}`}
											className="ui-button ui-button-sm"
										>
											Browse
										</a>
									</div>
								</li>
							);
						})}
					</ul>
				</ScrollPanel>
			)}
		</section>
	);
}
