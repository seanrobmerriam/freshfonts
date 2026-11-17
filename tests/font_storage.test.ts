import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";
import { getFonts } from "../src/lib/fonts/registry.ts";
import { isMissingFont, readFont } from "../src/lib/fonts/storage.server.ts";

test("Neon storage lists all pages and reads font objects", async () => {
	const requests: string[] = [];
	const server = createServer((request, response) => {
		const url = new URL(request.url!, "http://localhost");
		requests.push(url.pathname);
		if (url.searchParams.has("list-type")) {
			response.setHeader("Content-Type", "application/xml");
			response.end(url.searchParams.has("continuation-token")
				? '<ListBucketResult><IsTruncated>false</IsTruncated><Contents><Key>inter/700-italic.woff2</Key></Contents><Contents><Key>inter/nested/400.woff2</Key></Contents></ListBucketResult>'
				: '<ListBucketResult><IsTruncated>true</IsTruncated><NextContinuationToken>next</NextContinuationToken><Contents><Key>inter/400.woff2</Key></Contents><Contents><Key>inter/license.txt</Key></Contents></ListBucketResult>');
		} else if (url.pathname.endsWith("/400.woff2")) {
			response.end("font bytes");
		} else {
			response.writeHead(404, { "Content-Type": "application/xml" });
			response.end("<Error><Code>NoSuchKey</Code><Message>Missing</Message></Error>");
		}
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("No test server address");
	const previous = { ...process.env };
	Object.assign(process.env, { FONT_STORAGE: "neon", NEON_FONT_BUCKET: "fonts", AWS_ENDPOINT_URL_S3: `http://127.0.0.1:${address.port}`, AWS_REGION: "us-east-2", AWS_ACCESS_KEY_ID: "test", AWS_SECRET_ACCESS_KEY: "test" });
	try {
		assert.deepEqual(await getFonts(), [{ slug: "inter", family: "Inter", variants: [
			{ weight: 400, style: "normal", file: "400.woff2" },
			{ weight: 700, style: "italic", file: "700-italic.woff2" },
		] }]);
		assert.equal(Buffer.from(await readFont("inter", "400.woff2")).toString(), "font bytes");
		await assert.rejects(readFont("inter", "900.woff2"), isMissingFont);
		assert.ok(requests.includes("/fonts/inter/400.woff2"));
	} finally {
		process.env = previous;
		server.close();
		await once(server, "close");
	}
});
