# astro-site-starter

Phase 0 walking skeleton for content sites (business sites, portfolios, blogs): Astro + Tailwind, deployed on Vercel, with a contact form that emails through Resend. Zero client JS by default. It already passes lint, format, typecheck, a Playwright phone-width smoke test and a build.

## Create a project from it

```bash
gh repo create <app> --template tonylxm/astro-site-starter --private --clone
```

Then:

1. Rename: set `name` in `package.json`, `site` in `astro.config.mjs` (the production domain), the business details in `src/consts.ts`, replace `public/og.png` (1200×630 share image) and the favicons, and replace this README.
2. `pnpm install` (also installs the Husky hook; it needs `brew install gitleaks`).
3. Copy `.env.example` to `.env` and set the values. Dev and build stop with a clear error if one is missing.
4. `pnpm dev` and open http://localhost:4321.
5. Resend, in the client's account: add and verify their sending domain (SPF and DKIM records in their DNS), create an API key, and set `CONTACT_FROM_EMAIL` to an address on that domain. Until then `onboarding@resend.dev` only delivers to the Resend account's own email.
6. In the GitHub repo settings, turn on secret scanning and push protection if the plan has them (templates don't copy settings). Otherwise the `secrets` CI job and the pre-commit hook run gitleaks.
7. Import the repo in Vercel and add the same env vars. Production deploys from `main`, and PRs get previews. Vercel sets `VERCEL_ENV`, so only production is indexable.
8. Before launch, run the seo skill's pre-launch check.

**Team mode** (branch + PR, CI blocks merge): remove the hook with `pnpm remove husky lint-staged && rm -rf .husky`, delete the `prepare` and `lint-staged` entries from `package.json`, and protect `main` so it requires the CI check.

## Scripts

| Script                                           | Does                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `dev` / `build`                                  | Astro (the Vercel adapter has no `astro preview`)                                          |
| `lint` / `format` / `format:check` / `typecheck` | ESLint, Prettier (astro and tailwind plugins), `astro check`                               |
| `test`                                           | Playwright smoke test on the dev server (run `pnpm exec playwright install chromium` once) |

## What's included

- **Pages:** `/` and `/contact` share `src/layouts/Layout.astro`. Everything prerenders except `/contact`, which sets `export const prerender = false` because form actions need a per-request render.
- **Contact form:** a plain HTML form posting to the `contact` action in `src/actions/index.ts` (no client JS). Zod validates the fields, a hidden `company` honeypot silently drops bots, and Resend sends the message with the visitor as `replyTo`. Success redirects to `/contact?sent=1` so a refresh doesn't resend.
- **Env validation:** `env.schema` in `astro.config.mjs` with `validateSecrets: true`. Read values from `astro:env/server`, never `import.meta.env`, so they stay typed and server-only.
- **SEO** (the seo skill's baseline): title and description per page, canonical, Open Graph and Twitter tags with a default share image, `Organization` JSON-LD (switch to the most specific `LocalBusiness` type for local clients), sitemap via `@astrojs/sitemap`, `robots.txt` from `src/pages/robots.txt.ts`, a real 404 page. Builds outside Vercel production get `noindex` and `Disallow: /`. To check a local build as production, run `VERCEL_ENV=production pnpm build`.
- **Interactive widgets:** `pnpm astro add react` for a React island (calculator, booking widget), then render it with a `client:*` directive. If islands need shared state or cover most of the page, use the Next.js starter instead.
- CI (`.github/workflows/ci.yml`) and Dependabot, copied from the project-starter skill. CI sets placeholder email env vars so the build's env check passes, and installs Chromium for the smoke test.
- A pre-commit hook that runs gitleaks, then lint-staged (auto-fix only, no tests).
- `AGENTS.md` is Astro's generated agent notes. project-starter's agents-md step fills in the rest.
