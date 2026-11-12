import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file per service in src/content/services/. The file name is the URL slug.
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** Meta description and the summary on /services. Unique per service. */
    description: z.string(),
    /** Only if the client publishes prices, e.g. "From $150". */
    price: z.string().optional(),
    /** Only when this service's area differs from business.areaServed. */
    areas: z.array(z.string()).optional(),
    /** Real questions customers ask, answered with the client's facts. */
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    /** Sort order on /services. */
    order: z.number().default(0),
  }),
});

export const collections = { services };
