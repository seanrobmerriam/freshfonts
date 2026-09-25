import { define } from "../../utils.ts";
import { generateFontCss } from "../../lib/fonts/css.ts";
import { getFonts } from "../../lib/fonts/registry.ts";

export const handlers = define.handlers({
  async GET(ctx) {
    const familySlug = ctx.params.family;

    const fonts = await getFonts();
    const font = fonts.find((font) => font.slug === familySlug);

    if (!font) {
      return new Response("Font family not found", {
        status: 404,
      });
    }

    const css = generateFontCss(
      font,
      ctx.url.origin,
    );

    return new Response(css, {
      headers: {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});
