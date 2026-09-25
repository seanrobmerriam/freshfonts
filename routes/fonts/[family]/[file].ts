import { define } from "../../../utils.ts";

const FONT_ROOT = "./assets/fonts";

export const handlers = define.handlers({
  async GET(ctx) {
    const family = ctx.params.family;
    const file = ctx.params.file;

    if (!isSafePathSegment(family) || !isSafeFontFilename(file)) {
      return new Response("Not found", {
        status: 404,
      });
    }

    const path = `${FONT_ROOT}/${family}/${file}`;

    try {
      const data = await Deno.readFile(path);

      return new Response(data, {
        headers: {
          "Content-Type": "font/woff2",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response("Font not found", {
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

function isSafeFontFilename(value: string): boolean {
  return /^[1-9]00(?:-italic)?\.woff2$/.test(value);
}
