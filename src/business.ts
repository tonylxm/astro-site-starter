// Single source of truth for business facts: metadata, JSON-LD, header, footer and contact page all read from here.
// Leave a field undefined until the client confirms it (track it in docs/client-questions.md). Never guess.

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, e.g. "NZ". */
  addressCountry: string;
}

export interface Business {
  name: string;
  /** One or two sentences: who they help and with what. */
  description: string;
  /** Home page title: "Business, what it does". */
  defaultTitle: string;
  /** "Organization", or the most specific LocalBusiness subtype on schema.org ("Plumber", "Dentist", "HairSalon"). */
  schemaType: string;
  /** Path in public/. */
  logo: string;
  email: string;
  /** Display format; JSON-LD uses it as written, so prefer the international form, e.g. "+64 9 000 0000". */
  phone?: string;
  /** Local businesses only. Must match the Google Business Profile exactly. */
  address?: PostalAddress;
  /** Towns, regions or countries served, shown in the footer. */
  areaServed?: string[];
  /** schema.org openingHours format, e.g. "Mo-Fr 08:00-17:00". */
  openingHours?: string[];
  /** Full URLs of the business's own profiles (Google Business Profile, Facebook, LinkedIn). */
  sameAs?: string[];
}

export const business: Business = {
  name: "Example Co",
  description: "Example Co helps small businesses with a clear, fast website.",
  defaultTitle: "Example Co, websites for small businesses",
  schemaType: "Organization",
  logo: "/favicon.svg",
  email: "hello@example.com",
};
