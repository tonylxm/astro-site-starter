// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Production domain: used for canonical URLs, Open Graph and the sitemap.
  site: "https://example.com",
  trailingSlash: "never",
  build: { format: "file" },
  // Optimize images at build time instead of paying for a Cloudflare Images binding at runtime.
  adapter: cloudflare({ imageService: "compile" }),
  // The adapter would otherwise provision a KV namespace for sessions this site never uses.
  session: false,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      CONTACT_TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      // Read at build time. Only the production deploy script sets "production"; anything else is noindex.
      SITE_ENV: envField.enum({
        context: "server",
        access: "public",
        values: ["production", "preview", "development"],
        optional: true,
      }),
    },
    // Fail at build and server start, not on the first form submission.
    validateSecrets: true,
  },
});
