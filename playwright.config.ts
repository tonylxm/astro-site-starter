import { defineConfig, devices } from "@playwright/test";

// The Vercel adapter has no `astro preview`, so the smoke test runs against the dev server.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4321" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // --ignore-lock keeps the server in the foreground even when Astro detects an AI agent.
    command: "pnpm astro dev --ignore-lock",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    env: {
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "owner@example.com",
      CONTACT_FROM_EMAIL: "Website <onboarding@resend.dev>",
    },
  },
});
