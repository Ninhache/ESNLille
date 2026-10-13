import { describe, expect, it } from 'vitest';
import type { EsnEvent } from '../events';
import { eventJsonLd, eventsJsonLd, organizationJsonLd, serializeJsonLd } from './json-ld';

const site = 'https://lille.test';

const event: EsnEvent = {
  id: 'quiz',
  title: 'Quiz night',
  start: '2026-11-02T19:00:00+01:00',
  currency: 'EUR',
  url: 'https://www.helloasso.com/associations/esn-lille/evenements/quiz',
};

describe('organizationJsonLd', () => {
  it('describes ESN Lille with an id, address and profiles', () => {
    const organization = organizationJsonLd(site);
    expect(organization).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://lille.test/#organization',
      url: site,
      email: 'lille@esn.fr',
      address: { '@type': 'PostalAddress', postalCode: '59650', addressCountry: 'FR' },
      parentOrganization: { name: 'ESN France' },
    });
    expect(organization.sameAs).toContain('https://www.instagram.com/esn_lille/');
  });
});

describe('eventJsonLd', () => {
  it('turns prices into offers', () => {
    expect(eventJsonLd({ ...event, price: { kind: 'free' } }, site).offers).toMatchObject({
      price: 0,
      priceCurrency: 'EUR',
    });
    expect(eventJsonLd({ ...event, price: { kind: 'fixed', cents: 500 } }, site).offers).toMatchObject({ price: 5 });
    expect(eventJsonLd({ ...event, price: { kind: 'from', cents: 4550 } }, site).offers).toMatchObject({ price: 45.5 });
    expect(eventJsonLd(event, site).offers).toEqual({ '@type': 'Offer', url: event.url });
  });

  it('links the organizer to the organization', () => {
    expect(eventJsonLd(event, site).organizer).toMatchObject({ '@id': 'https://lille.test/#organization' });
  });

  it('builds the location from the venue, or leaves it out', () => {
    const venue = {
      name: 'Gare Saint Sauveur',
      street: '17 boulevard Jean-Baptiste Lebas',
      postalCode: '59000',
      city: 'Lille',
    };
    expect(eventJsonLd({ ...event, venue }, site).location).toEqual({
      '@type': 'Place',
      name: 'Gare Saint Sauveur',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '17 boulevard Jean-Baptiste Lebas',
        postalCode: '59000',
        addressLocality: 'Lille',
      },
    });
    expect(eventJsonLd(event, site).location).toBeUndefined();
  });

  it('groups events in one graph', () => {
    expect(eventsJsonLd([event, event], site)['@graph']).toHaveLength(2);
  });
});

describe('serializeJsonLd', () => {
  it('cannot close the script tag', () => {
    const json = serializeJsonLd(eventJsonLd({ ...event, title: '</script><b>"hi"' }, site));
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).name).toBe('</script><b>"hi"');
  });
});
