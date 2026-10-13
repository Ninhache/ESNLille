import type { EsnEvent } from '../events';
import { HELLOASSO_URL } from '../links';
import { ORGANIZATION } from '../site';

type JsonLdNode = Record<string, unknown>;

const LOGO_PATH = '/brand/esn-lille-colour-black.svg';

function organizationId(site: string): string {
  return `${site}/#organization`;
}

/** schema.org Organization for ESN Lille, rooted at the site origin `site`. */
export function organizationJsonLd(site: string): JsonLdNode {
  const { address } = ORGANIZATION;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(site),
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.legalName,
    url: site,
    logo: `${site}${LOGO_PATH}`,
    email: ORGANIZATION.email,
    foundingDate: ORGANIZATION.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.name}, ${address.street}`,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    sameAs: [ORGANIZATION.socials.instagram, ORGANIZATION.socials.tiktok, HELLOASSO_URL],
    parentOrganization: { '@type': 'Organization', name: ORGANIZATION.parent.name, url: ORGANIZATION.parent.url },
  };
}

function offer(event: EsnEvent): JsonLdNode {
  const base = { '@type': 'Offer', url: event.url };
  if (!event.price) return base;
  const price = event.price.kind === 'free' ? 0 : event.price.cents / 100;
  return { ...base, price, priceCurrency: event.currency };
}

function location(event: EsnEvent): JsonLdNode | undefined {
  const { venue } = event;
  if (!venue) return undefined;
  return {
    '@type': 'Place',
    name: venue.name ?? venue.city,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.street,
      postalCode: venue.postalCode,
      addressLocality: venue.city,
    },
  };
}

/** schema.org Event for one HelloAsso event, organized by the site's Organization. */
export function eventJsonLd(event: EsnEvent, site: string): JsonLdNode {
  return {
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.start,
    endDate: event.end,
    url: event.url,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: location(event),
    organizer: { '@type': 'Organization', '@id': organizationId(site), name: ORGANIZATION.name, url: site },
    offers: offer(event),
  };
}

/** One JSON-LD graph listing `events`. */
export function eventsJsonLd(events: EsnEvent[], site: string): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': events.map(event => eventJsonLd(event, site)) };
}

/** Serializes JSON-LD for a `<script>` tag, escaping `<` so event text cannot close the tag. */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
