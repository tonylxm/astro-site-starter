# astro-site-starter

Phase 0 walking skeleton for content sites (business sites, portfolios, blogs): Astro + Tailwind, deployed on Cloudflare Workers, with a contact form that emails through Resend. Zero client JS by default. It already passes lint, format, typecheck, a Playwright phone-width smoke test and a build.

## Create a project from it

```bash
gh repo create <app> --template tonylxm/astro-site-starter --private --clone
```

Then:

1. Rename: set `name` in `package.json`, `site` in `astro.config.mjs` (the production domain), the business details in `src/business.ts` (see [SEO and AI search](#seo-and-ai-search)), the example service in `src/content/services/`, replace `public/og.png` (1200×630 share image) and the favicons, and replace this README.
2. `pnpm install` (also installs the Husky hook; it needs `brew install gitleaks`).
3. Copy `.env.example` to `.env` and set the values. Dev and build stop with a clear error if one is missing.
4. `pnpm dev` and open http://localhost:4321.
5. Resend, in the client's account: add and verify their sending domain (SPF and DKIM records in their DNS), create an API key, and set `CONTACT_FROM_EMAIL` to an address on that domain. Until then `onboarding@resend.dev` only delivers to the Resend account's own email.
6. In the GitHub repo settings, turn on secret scanning and push protection if the plan has them (templates don't copy settings). Otherwise the `secrets` CI job and the pre-commit hook run gitleaks.
7. Set `name` in `wrangler.jsonc`, then `pnpm exec wrangler login` and `pnpm run deploy`. Add the three email values once with `pnpm exec wrangler secret put <NAME>`. The build also validates them, so keep them in `.env` locally. Only `pnpm run deploy` sets `SITE_ENV=production`, so preview builds stay `noindex`. Roll back with `pnpm exec wrangler rollback`.
8. Production deploys from CI: the `deploy` job in `.github/workflows/ci.yml` runs `pnpm run deploy` on push to `main` once the `ci` job is green, then curls the live site. In the GitHub repo settings (Secrets and variables → Actions) add:

   | Name                    | Kind     | Value                                                            |
   | ----------------------- | -------- | ---------------------------------------------------------------- |
   | `CLOUDFLARE_API_TOKEN`  | Secret   | API token with the "Edit Cloudflare Workers" template            |
   | `CLOUDFLARE_ACCOUNT_ID` | Secret   | Account ID from the Cloudflare dashboard                         |
   | `PRODUCTION_URL`        | Variable | The live URL the smoke check fetches, e.g. `https://example.com` |

   The job builds with placeholder email values (the Worker reads the real secrets at runtime). If the repo is connected to Workers Builds, turn off its production deploy on push (keep it for branch previews only), or `main` deploys twice and skips the CI gate.

9. Before launch, run the seo skill's pre-launch check.

**Team mode** (branch + PR, CI blocks merge): remove the hook with `pnpm remove husky lint-staged && rm -rf .husky`, delete the `prepare` and `lint-staged` entries from `package.json`, and protect `main` so it requires the CI check.

## Scripts

| Script                                           | Does                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `dev` / `build`                                  | Astro                                                                                      |
| `preview` / `deploy`                             | Build, then run it locally in `workerd` (`wrangler dev`) or deploy it as production        |
| `lint` / `format` / `format:check` / `typecheck` | ESLint, Prettier (astro and tailwind plugins), `astro check`                               |
| `test`                                           | Playwright smoke test on the dev server (run `pnpm exec playwright install chromium` once) |

## What's included

- **Pages:** `/` and `/contact` share `src/layouts/Layout.astro`. Everything prerenders except `/contact`, which sets `export const prerender = false` because form actions need a per-request render.
- **Contact form:** a plain HTML form posting to the `contact` action in `src/actions/index.ts` (no client JS). Zod validates the fields, a hidden `company` honeypot silently drops bots, and Resend sends the message with the visitor as `replyTo`. Success redirects to `/contact?sent=1` so a refresh doesn't resend.
- **Env validation:** `env.schema` in `astro.config.mjs` with `validateSecrets: true`. Read values from `astro:env/server`, never `import.meta.env`, so they stay typed and server-only.
- **SEO and AI search**: see [below](#seo-and-ai-search).
- **Cloudflare adapter:** prerendered pages are static assets (free, no Worker invocation), only `/contact` runs in the Worker. Sessions are off and images are optimized at build (`imageService: "compile"`), so no KV or Images binding is needed. Turn either on in `astro.config.mjs` only when the site uses it.
- **Interactive widgets:** `pnpm astro add react` for a React island (calculator, booking widget), then render it with a `client:*` directive. If islands need shared state or cover most of the page, use the Next.js starter instead.
- CI (`.github/workflows/ci.yml`) and Dependabot, copied from the project-starter skill. CI sets placeholder email env vars so the build's env check passes, and installs Chromium for the smoke test.
- A pre-commit hook that runs gitleaks, then lint-staged (auto-fix only, no tests).
- `AGENTS.md` is Astro's generated agent notes. project-starter's agents-md step fills in the rest.

## SEO and AI search

Google, Bing and AI search tools (ChatGPT search, Perplexity, AI Overviews) read the same signals: crawlable HTML, clear facts, consistent business details and structured data. So there's no separate "GEO" layer, just the seo skill's baseline done consistently.

### Included

| What                                                                                     | Where                                                                |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Title, description, canonical, Open Graph, Twitter card per page                         | `src/layouts/Layout.astro` (props `title`, `description`, `noindex`) |
| Business JSON-LD (`Organization` or a `LocalBusiness` subtype), only fields that are set | `src/lib/json-ld.ts`, rendered by `src/components/JsonLd.astro`      |
| Footer with name, address, phone, email and areas served                                 | `src/components/Footer.astro`                                        |
| Service pages with optional price, areas and FAQs                                        | `src/content/services/*.md`, `src/pages/services/`                   |
| Sitemap, `robots.txt`, `noindex` outside production, real 404                            | `@astrojs/sitemap`, `src/pages/robots.txt.ts`, `src/pages/404.astro` |
| Static HTML, zero client JS by default, build-time image optimization                    | Astro defaults                                                       |

Builds without `SITE_ENV=production` get `noindex` and `Disallow: /`. To check a local build as production, run `SITE_ENV=production pnpm build`.

### Business details

`src/business.ts` is the only place business facts live. Metadata, JSON-LD, header, footer and contact page read from it, so they can't drift apart. The production URL is `site` in `astro.config.mjs`.

- `schemaType`: `"Organization"` for businesses without a public address, otherwise the most specific [LocalBusiness subtype](https://schema.org/LocalBusiness) (`Plumber`, `Dentist`, `HairSalon`).
- Optional fields (`phone`, `address`, `areaServed`, `openingHours`, `sameAs`) stay unset until the client confirms them. Unknown facts go in `docs/client-questions.md`, never a guess.
- Name, address and phone match the Google Business Profile character for character.

### Add a service page

1. Add `src/content/services/<slug>.md` (the file name is the URL). Copy the frontmatter from `website-build.md`: `title`, a unique `description`, and optional `price`, `areas`, `faqs` and `order`.
2. Write the body in the client's words: what's included, who it suits, process, timing, price. Use `##` headings.
3. Only add FAQs customers actually ask, answered with the client's facts. Leave `faqs` out otherwise.
4. Delete `website-build.md` once real services exist. The `/services` list and the sitemap update themselves.

### Add a location page

Only when the client has something genuinely different to say about that place (a branch address, local projects, different services or prices). Make it a normal page in `src/pages/` with its own title, description and content. Otherwise list the place in `areaServed`: near-identical per-suburb pages are thin content and hurt more than they help.

### Images

Use `<Image>` from `astro:assets` with descriptive file names (`kitchen-renovation-remuera.jpg`, not `IMG_0042.jpg`). Informative images need `alt` describing what they show; decorative ones get `alt=""`.

### What the client provides

- Business name exactly as on their Google Business Profile, plus address and phone if local
- Services, with prices or ranges if they publish them, and the areas they serve
- The questions customers ask most, with their answers
- Qualifications, experience and process worth stating
- Logo, a 1200×630 share image, real photos
- Links to their own profiles (Google Business Profile, Facebook, LinkedIn)
- Access to Google Search Console and Business Profile at handover (the seo skill's handover steps)
