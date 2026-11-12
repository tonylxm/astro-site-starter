import { business } from "../business";

// Only fields that are set (and so shown on the site) go into the schema.
export function businessJsonLd(site: URL) {
  const b = business;
  const isOrganization = b.schemaType === "Organization";
  const logo = new URL(b.logo, site).href;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": b.schemaType,
    "@id": new URL("/#business", site).href,
    name: b.name,
    description: b.description,
    url: site.href,
    logo,
    email: b.email,
  };
  // LocalBusiness expects an image; the logo is the one every site has.
  if (!isOrganization) data.image = logo;
  if (b.phone) data.telephone = b.phone;
  if (b.address) data.address = { "@type": "PostalAddress", ...b.address };
  if (b.areaServed?.length) data.areaServed = b.areaServed;
  if (!isOrganization && b.openingHours?.length)
    data.openingHours = b.openingHours;
  if (b.sameAs?.length) data.sameAs = b.sameAs;
  return data;
}
