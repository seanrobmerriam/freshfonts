import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("serves fonts and nested icons for browser asset requests", async () => {
	const directory = await mkdtemp("assets/fonts/preview-test-");
	const slug = path.basename(directory);
	const iconDirectory = await mkdtemp("assets/icons/preview-test-");
	const collection = path.basename(iconDirectory);
	const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';
	await mkdir(path.join(iconDirectory, "brands/color"), { recursive: true });
	await writeFile(path.join(iconDirectory, "brands/color/example.svg"), svg);
	await writeFile(path.join(iconDirectory, "flat.svg"), svg);
	await mkdir(path.join(iconDirectory, "imported/example"), { recursive: true });
	await writeFile(path.join(iconDirectory, "imported/example/default.svg"), svg);
	const fontBytes = Buffer.from("wOF2-preview-route-fixture");
	await mkdir(directory, { recursive: true });
	await writeFile(path.join(directory, "400.woff2"), fontBytes);
	const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--port", "0"], {
		stdio: ["ignore", "pipe", "pipe"],
	});
	try {
		const origin = await new Promise<string>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error("Dev server did not start")), 30_000);
			server.once("exit", (code) => {
				clearTimeout(timer);
				reject(new Error(`Dev server exited: ${code}`));
			});
			server.stdout.on("data", (data) => {
				const match = data.toString().replace(/\u001b\[[0-9;]*m/g, "").match(/Local:\s+(http:\/\/localhost:\d+)/);
				if (match) {
					clearTimeout(timer);
					resolve(match[1]);
				}
			});
		});
		const collectionPage = await fetch(`${origin}/icons/${collection}`);
		assert.equal(collectionPage.status, 200);
		const collectionHtml = await collectionPage.text();
		assert.ok(collectionHtml.includes(`/icon-preview/${collection}/brands/color/example.svg`));
		const previewPage = await fetch(`${origin}/icon-preview/${collection}/brands/color/example.svg`);
		assert.equal(previewPage.status, 200);
		const previewHtml = await previewPage.text();
		assert.ok(previewHtml.includes(`src="/icons/${collection}/brands/color/example.svg"`));
		assert.ok(previewHtml.includes('aria-label="Icon preview"'));
		assert.ok(previewHtml.includes('width="256"'));
		assert.ok(previewHtml.includes('background-image:linear-gradient'));
		assert.ok(previewHtml.includes("Download SVG"));
		const searchPage = await fetch(`${origin}/icon-search`);
		assert.equal(searchPage.status, 200);
		assert.ok((await searchPage.text()).includes("Search for icons"));
		const home = await fetch(origin);
		assert.ok((await home.text()).includes('href="/icon-search"'));
		for (const file of ["brands/color/example.svg", "flat.svg", "imported/example/default.svg"]) {
			const icon = await fetch(`${origin}/icons/${collection}/${file}`, {
				headers: { accept: "image/avif,image/webp,*/*", "sec-fetch-dest": "image" },
			});
			assert.equal(icon.status, 200);
			assert.match(icon.headers.get("content-type") ?? "", /^image\/svg\+xml/);
			assert.equal(icon.headers.get("access-control-allow-origin"), "*");
			assert.equal(icon.headers.get("cache-control"), "public, max-age=31536000, immutable");
			if (file.startsWith("imported/")) {
				assert.equal(icon.headers.get("content-security-policy"), "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:");
			}
			assert.equal(await icon.text(), svg);
		}
		for (const file of ["brands/color/missing.svg", "brands%2F..%2Fflat.svg", "brands%5Cflat.svg", "brands/color/example.txt"]) {
			const icon = await fetch(`${origin}/icons/${collection}/${file}`, {
				headers: { "sec-fetch-dest": "image" },
			});
			assert.equal(icon.status, 404);
		}
		const stylesheet = await fetch(`${origin}/fonts/${slug}.css`, {
			headers: { accept: "text/css,*/*;q=0.1", "sec-fetch-dest": "style" },
		});
		assert.equal(stylesheet.status, 200);
		assert.match(stylesheet.headers.get("content-type") ?? "", /^text\/css/);
		assert.equal(stylesheet.headers.get("access-control-allow-origin"), "*");
		const css = await stylesheet.text();
		const fontUrl = css.match(/url\("([^"]+)"\)/)?.[1];
		assert.ok(fontUrl);
		const font = await fetch(fontUrl, {
			headers: { accept: "*/*", "sec-fetch-dest": "font" },
		});
		assert.equal(font.status, 200);
		assert.equal(font.headers.get("content-type"), "font/woff2");
		assert.equal(font.headers.get("cache-control"), "public, max-age=31536000, immutable");
		assert.deepEqual(Buffer.from(await font.arrayBuffer()), fontBytes);
	} finally {
		server.kill("SIGTERM");
		await rm(directory, { recursive: true, force: true });
		await rm(iconDirectory, { recursive: true, force: true });
	}
});
