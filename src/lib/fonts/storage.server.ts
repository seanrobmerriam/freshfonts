import { readFile } from "node:fs/promises";
import {
	GetObjectCommand,
	ListObjectsV2Command,
	S3Client,
} from "@aws-sdk/client-s3";

function configuration() {
	const backend = process.env.FONT_STORAGE ?? "local";
	if (backend === "local") return null;
	if (backend !== "neon")
		throw new Error(`Unsupported FONT_STORAGE: ${backend}`);
	const bucket = process.env.NEON_FONT_BUCKET;
	if (!bucket || !process.env.AWS_ENDPOINT_URL_S3 || !process.env.AWS_REGION) {
		throw new Error(
			"Neon font storage requires NEON_FONT_BUCKET, AWS_ENDPOINT_URL_S3, and AWS_REGION",
		);
	}
	return { bucket, client: new S3Client({ forcePathStyle: true }) };
}

export async function listFontKeys(): Promise<string[] | null> {
	const config = configuration();
	if (!config) return null;
	const keys: string[] = [];
	let token: string | undefined;
	do {
		const page = await config.client.send(
			new ListObjectsV2Command({
				Bucket: config.bucket,
				ContinuationToken: token,
			}),
		);
		for (const object of page.Contents ?? []) {
			if (object.Key) keys.push(object.Key);
		}
		if (page.IsTruncated && !page.NextContinuationToken) {
			throw new Error(
				"Incomplete Neon font listing: missing continuation token",
			);
		}
		token = page.IsTruncated ? page.NextContinuationToken : undefined;
	} while (token);
	return keys;
}

export async function readFont(
	family: string,
	file: string,
): Promise<Uint8Array> {
	const config = configuration();
	if (!config)
		return new Uint8Array(await readFile(`./assets/fonts/${family}/${file}`));
	const result = await config.client.send(
		new GetObjectCommand({
			Bucket: config.bucket,
			Key: `${family}/${file}`,
		}),
	);
	if (!result.Body) throw new Error("Neon returned a font without a body");
	return result.Body.transformToByteArray();
}

export function isMissingFont(error: unknown): boolean {
	if (typeof error !== "object" || error === null) return false;
	return (
		("code" in error && error.code === "ENOENT") ||
		("name" in error &&
			(error.name === "NoSuchKey" || error.name === "NotFound"))
	);
}
