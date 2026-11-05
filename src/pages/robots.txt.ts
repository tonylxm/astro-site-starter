import type { APIRoute } from "astro";
import { VERCEL_ENV } from "astro:env/server";

// Preview deploys and local builds block crawlers; only production is indexable.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap-index.xml", site);
  const rules = VERCEL_ENV === "production" ? "Allow: /" : "Disallow: /";
  return new Response(`User-agent: *\n${rules}\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
