import { execFile } from "node:child_process";
import { constants } from "node:fs";
import {
	access,
	copyFile,
	mkdir,
	mkdtemp,
	readFile,
	rm,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { z } from "zod";
import {
	addIconInput,
	iconSlug,
	iconVariant,
	type SearchIcon,
	searchInput,
	variantFilename,
} from "./thesvg.ts";

const execFileAsync = promisify(execFile);
const registrySchema = z.object({
	icons: z
		.array(
			z.object({
				slug: iconSlug,
				title: z.string().max(200),
				aliases: z.array(z.string()),
				categories: z.array(z.string()),
				license: z.string().max(10_000),
				variants: z.array(iconVariant).min(1),
			}),
		)
		.max(50_000),
});

async function loadRegistry(): Promise<unknown> {
	const response = await fetch("https://thesvg.org/api/registry.json", {
		signal: AbortSignal.timeout(15_000),
	});
	if (!response.ok)
		throw new Error("theSVG search is unavailable. Please try again.");
	return response.json();
}

async function runCli(slug: string, variant: string, directory: string) {
	const require = createRequire(path.join(process.cwd(), "package.json"));
	const cli = require.resolve("@thesvg/cli/dist/index.js");
	try {
		await execFileAsync(
			process.execPath,
			[
				cli,
				"add",
				slug,
				"--variant",
				variant,
				"--format",
				"svg",
				"--dir",
				directory,
			],
			{
				timeout: 30_000,
				maxBuffer: 1024 * 1024,
				windowsHide: true,
			},
		);
	} catch {
		throw new Error(
			"Could not download this icon from theSVG. Please try again.",
		);
	}
}

async function exists(file: string) {
	try {
		await access(file);
		return true;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
		throw error;
	}
}

interface ServiceOptions {
	root?: string;
	loadRegistry?: () => Promise<unknown>;
	runCli?: (slug: string, variant: string, directory: string) => Promise<void>;
}

export function createIconSearchService(options: ServiceOptions = {}) {
	const root = options.root ?? path.resolve("assets/icons/thesvg");
	let cached:
		| { icons: z.infer<typeof registrySchema>["icons"]; expires: number }
		| undefined;
	let pending: Promise<z.infer<typeof registrySchema>["icons"]> | undefined;
	async function registry() {
		if (cached && cached.expires > Date.now()) return cached.icons;
		pending ??= (async () => {
			try {
				const { icons } = registrySchema.parse(
					await (options.loadRegistry ?? loadRegistry)(),
				);
				cached = { icons, expires: Date.now() + 5 * 60_000 };
				return icons;
			} finally {
				pending = undefined;
			}
		})();
		return pending;
	}
	function localFile(slug: string, variant: string) {
		return `imported/${slug}/${variantFilename(variant)}.svg`;
	}
	return {
		async search(
			input: string,
		): Promise<{ icons: SearchIcon[]; total: number }> {
			const query = searchInput.parse(input).toLowerCase();
			const words = query.split(/\s+/);
			const matches = (await registry())
				.filter((icon) => {
					const text = [
						icon.slug,
						icon.title,
						...icon.aliases,
						...icon.categories,
					]
						.join(" ")
						.toLowerCase();
					return words.every((word) => text.includes(word));
				})
				.sort(
					(a, b) =>
						Number(b.slug === query) - Number(a.slug === query) ||
						a.title.localeCompare(b.title),
				);
			const icons = await Promise.all(
				matches.slice(0, 48).map(async (icon) => ({
					slug: icon.slug,
					title: icon.title,
					license: icon.license,
					variants: icon.variants,
					installed: (
						await Promise.all(
							icon.variants.map(async (variant) =>
								(await exists(path.join(root, localFile(icon.slug, variant))))
									? variant
									: null,
							),
						)
					).filter((variant): variant is string => variant !== null),
				})),
			);
			return { icons, total: matches.length };
		},
		async add(input: { slug: string; variant: string }) {
			const { slug, variant } = addIconInput.parse(input);
			const icon = (await registry()).find((item) => item.slug === slug);
			if (!icon || !icon.variants.includes(variant))
				throw new Error(
					"This icon or variant is not available. Search again to refresh the results.",
				);
			const file = localFile(slug, variant);
			const destination = path.join(root, file);
			const url = `/icons/thesvg/${file}`;
			if (await exists(destination))
				return { status: "existing" as const, url };
			const temporary = await mkdtemp(
				path.join(tmpdir(), "freshfonts-thesvg-"),
			);
			try {
				await (options.runCli ?? runCli)(slug, variant, temporary);
				const suffix =
					variant === "default" ? "" : `-${variantFilename(variant)}`;
				const source = path.join(temporary, `${slug}${suffix}.svg`);
				const svg = await readFile(source, "utf8");
				if (
					!/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(svg) ||
					!/<\/svg>\s*$/i.test(svg) ||
					/<script\b|\bon\w+\s*=/i.test(svg)
				) {
					throw new Error("theSVG returned an invalid SVG image.");
				}
				await mkdir(path.dirname(destination), { recursive: true });
				try {
					await copyFile(source, destination, constants.COPYFILE_EXCL);
				} catch (error) {
					if ((error as NodeJS.ErrnoException).code === "EEXIST")
						return { status: "existing" as const, url };
					throw error;
				}
				return { status: "added" as const, url };
			} finally {
				await rm(temporary, { recursive: true, force: true });
			}
		},
	};
}

export const iconSearchService = createIconSearchService();
