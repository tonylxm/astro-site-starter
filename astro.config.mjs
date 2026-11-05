// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Production domain: used for canonical URLs, Open Graph and the sitemap.
  site: "https://example.com",
  trailingSlash: "never",
  build: { format: "file" },
  adapter: vercel(),
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
      // Set by Vercel. Anything other than "production" is noindex.
      VERCEL_ENV: envField.enum({
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
