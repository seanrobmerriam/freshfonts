import { define } from "../../../utils.ts";

const ICON_ROOT = "./assets/icons";

export const handlers = define.handlers({
  async GET(ctx) {
    const collection = ctx.params.collection;
    const file = ctx.params.file;

    if (!isSafePathSegment(collection) || !isSafeSvgFilename(file)) {
      return new Response("Not found", {
        status: 404,
      });
    }

    const path = `${ICON_ROOT}/${collection}/${file}`;

    try {
      const data = await Deno.readFile(path);

      return new Response(data, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response("Icon not found", {
          status: 404,
        });
      }

      console.error(error);

      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  },
});

function isSafePathSegment(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/i.test(value);
}

function isSafeSvgFilename(value: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*\.svg$/i.test(value);
}
