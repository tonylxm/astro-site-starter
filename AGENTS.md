## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## SEO and content

- Business facts come only from `src/business.ts`. Never hard-code the name, email, phone or address in a page, and never invent a fact; add unknowns to `docs/client-questions.md`.
- Every indexable page passes a unique `title` and `description` to `Layout`, and has one `h1`.
- Informative images need meaningful `alt`; decorative ones get `alt=""`.
- No fake FAQs or reviews, near-duplicate location pages, or hidden text. See the README's "SEO and AI search" section.
