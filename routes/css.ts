import { define } from "../utils.ts";

import { generateFontCss } from "../lib/fonts/css.ts";
import {
  familyNameToSlug,
  parseFontQuery,
  selectFontVariants,
} from "../lib/fonts/query.ts";
import { getFonts } from "../lib/fonts/registry.ts";

export const handlers = define.handlers({
  async GET(ctx) {
    try {
      const requestedFonts = parseFontQuery(ctx.url);

      if (requestedFonts.length === 0) {
        return new Response(
          "At least one family parameter is required",
          {
            status: 400,
          },
        );
      }

      const availableFonts = await getFonts();

      const cssBlocks: string[] = [];

      for (const request of requestedFonts) {
        const slug = familyNameToSlug(request.family);

        const font = availableFonts.find(
          (font) => font.slug === slug,
        );

        if (!font) {
          return new Response(
            `Font family not found: ${request.family}`,
            {
              status: 404,
            },
          );
        }

        const variants = selectFontVariants(
          font,
          request.weights,
        );

        if (
          request.weights.length > 0 &&
          variants.length === 0
        ) {
          return new Response(
            `No requested weights found for ${font.family}`,
            {
              status: 404,
            },
          );
        }

        cssBlocks.push(
          generateFontCss(
            font,
            ctx.url.origin,
            variants,
          ),
        );
      }

      return new Response(
        cssBlocks.join("\n\n"),
        {
          headers: {
            "Content-Type": "text/css; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    } catch (error) {
      console.error("CSS route failed:", error);

      return new Response(
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error),
        {
          status: 500,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        },
      );
    }
  },
});