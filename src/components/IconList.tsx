import { Link } from "@tanstack/react-router";
import type { IconSet } from "../lib/icons/types.ts";

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
				<Link to="/icon-search" className="btn btn-sm btn-outline mt-3">
					Search for more icons
				</Link>
			</header>

			{iconSets.length === 0 ? (
				<div className="alert">
					<span>
						No icon sets found in <code>./assets/icons</code>.
					</span>
				</div>
			) : (
				<ul className="list bg-base-100 rounded-box border border-base-300">
					{iconSets.map((iconSet) => {
						const preview = iconSet.icons[0];

						return (
							<li className="list-row" key={iconSet.slug}>
								<div className="size-12 rounded-box bg-base-200 flex items-center justify-center">
									{preview ? (
										<img
											src={`/icons/${iconSet.slug}/${preview.file}`}
											alt=""
											className="size-6"
											loading="lazy"
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
									<a href={`/icons/${iconSet.slug}`} className="btn btn-sm">
										Browse
									</a>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
