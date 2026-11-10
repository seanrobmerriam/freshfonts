import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createIconSearchService } from "../src/lib/icons/thesvg.server.ts";

const registry = { icons: [
  { slug: "github", title: "GitHub", aliases: ["git hosting"], categories: ["DevTool"], license: "CC0", variants: ["default", "dark", "wordmarkLight"] },
  { slug: "gitlab", title: "GitLab", aliases: [], categories: ["DevTool"], license: "MIT", variants: ["default"] },
] };
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';

test("searches aliases and categories, ranks exact slugs first and exposes available variants", async () => {
  const service = createIconSearchService({ loadRegistry: async () => registry });
  const result = await service.search("GITHUB");
  assert.equal(result.icons[0].slug, "github");
  assert.deepEqual(result.icons[0].variants, ["default", "dark", "wordmarkLight"]);
  assert.equal((await service.search("git hosting")).total, 1);
  assert.equal((await service.search("devtool")).total, 2);
  assert.equal((await service.search("nothing matches")).total, 0);
  await assert.rejects(() => service.search("x".repeat(101)));
});

test("rejects malformed registry data and unsafe import inputs before downloading", async () => {
  let downloads = 0;
  const service = createIconSearchService({ loadRegistry: async () => registry, runCli: async () => { downloads++; } });
  for (const input of [{ slug: "../github", variant: "default" }, { slug: "--help", variant: "default" }, { slug: "github", variant: "../../bad" }, { slug: "github", variant: "unavailable" }, { slug: "unknown", variant: "default" }]) {
    await assert.rejects(() => service.add(input));
  }
  assert.equal(downloads, 0);
  const malformed = createIconSearchService({ loadRegistry: async () => ({ icons: [{ ...registry.icons[0], slug: "../../bad" }] }) });
  await assert.rejects(() => malformed.search("git"));
});

test("imports the selected variant, preserves existing files and cleans up failed downloads", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "freshfonts-import-"));
  const temporary: string[] = [];
  try {
    const service = createIconSearchService({ root, loadRegistry: async () => registry,
      runCli: async (slug, variant, dir) => {
        temporary.push(dir);
        assert.equal(slug, "github");
        assert.equal(variant, "wordmarkLight");
        await writeFile(path.join(dir, "github-wordmark-light.svg"), svg);
      },
    });
    const added = await service.add({ slug: "github", variant: "wordmarkLight" });
    assert.equal(added.status, "added");
    assert.equal(added.url, "/icons/thesvg/imported/github/wordmark-light.svg");
    const destination = path.join(root, "imported/github/wordmark-light.svg");
    assert.equal(await readFile(destination, "utf8"), svg);
    await writeFile(destination, "existing custom icon");
    assert.equal((await service.add({ slug: "github", variant: "wordmarkLight" })).status, "existing");
    assert.equal(await readFile(destination, "utf8"), "existing custom icon");
    for (const dir of temporary) await assert.rejects(() => readFile(path.join(dir, "github-wordmark-light.svg")));
    const invalid = createIconSearchService({ root, loadRegistry: async () => registry,
      runCli: async (_slug, _variant, dir) => { await writeFile(path.join(dir, "github.svg"), "<!DOCTYPE html><html>error</html>"); },
    });
    await assert.rejects(() => invalid.add({ slug: "github", variant: "default" }), /SVG/);
    await assert.rejects(() => readFile(path.join(root, "imported/github/default.svg")));
    const failed = createIconSearchService({ root, loadRegistry: async () => registry,
      runCli: async () => { throw new Error("Download failed"); },
    });
    await assert.rejects(() => failed.add({ slug: "github", variant: "default" }), /Download failed/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("simultaneous imports never overwrite each other", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "freshfonts-import-"));
  try {
    const service = createIconSearchService({ root, loadRegistry: async () => registry,
      runCli: async (_slug, _variant, dir) => { await writeFile(path.join(dir, "github.svg"), svg); },
    });
    const results = await Promise.all([service.add({ slug: "github", variant: "default" }), service.add({ slug: "github", variant: "default" })]);
    assert.deepEqual(results.map(r => r.status).sort(), ["added", "existing"]);
    assert.equal(await readFile(path.join(root, "imported/github/default.svg"), "utf8"), svg);
  } finally { await rm(root, { recursive: true, force: true }); }
});
