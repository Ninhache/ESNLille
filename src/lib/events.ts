import { createHelloAssoClient, type HelloAssoClient } from './helloasso/client';
import type { FormLight, FormPublic } from './helloasso/types';

const DEFAULT_API_URL = 'https://api.helloasso.com';
const DEFAULT_ORGANIZATION = 'esn-lille';

export type Price = { kind: 'free' } | { kind: 'fixed' | 'from'; cents: number };

export type Venue = { name?: string; street?: string; postalCode?: string; city?: string };

export type EsnEvent = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  place?: string;
  venue?: Venue;
  price?: Price;
  currency: string;
  url: string;
};

export type EventsResult = { status: 'ok'; events: EsnEvent[] } | { status: 'unavailable' };

function isUpcoming(form: FormLight, now: number): boolean {
  const last = form.endDate ?? form.startDate;
  return last ? Date.parse(last) >= now : false;
}

function summarizePrice(form: FormPublic): Price | undefined {
  const prices = (form.tiers ?? []).flatMap(tier => (typeof tier.price === 'number' ? [tier.price] : []));
  if (prices.length === 0) return undefined;
  const lowest = Math.min(...prices);
  if (Math.max(...prices) === 0) return { kind: 'free' };
  return { kind: prices.every(price => price === lowest) ? 'fixed' : 'from', cents: lowest };
}

function formatPlace(form: FormPublic): string | undefined {
  const parts = [form.place?.name, form.place?.city].filter((part): part is string => Boolean(part));
  return [...new Set(parts)].join(', ') || undefined;
}

function toVenue(form: FormPublic): Venue | undefined {
  const place = form.place;
  if (!place) return undefined;
  const venue: Venue = {
    name: place.name || undefined,
    street: place.address || undefined,
    postalCode: place.zipCode || undefined,
    city: place.city || undefined,
  };
  return Object.values(venue).some(Boolean) ? venue : undefined;
}

/** Maps a HelloAsso public form to an event, or `null` when it lacks a slug, title, start date or URL. */
export function toEvent(form: FormPublic): EsnEvent | null {
  if (!form.formSlug || !form.title || !form.startDate || !form.url) return null;
  return {
    id: form.formSlug,
    title: form.title,
    description: form.description ?? undefined,
    start: form.startDate,
    end: form.endDate ?? undefined,
    place: formatPlace(form),
    venue: toVenue(form),
    price: summarizePrice(form),
    currency: form.currency ?? 'EUR',
    url: form.url,
  };
}

/**
 * Fetches the public HelloAsso event forms that have not ended at `now`, sorted by start date.
 *
 * @throws HelloAssoError or a network error when the API fails.
 */
export async function fetchUpcomingEvents(client: HelloAssoClient, now: number): Promise<EsnEvent[]> {
  const forms = (await client.listEventForms()).filter(form => form.formSlug && isUpcoming(form, now));
  const details = await Promise.all(forms.map(form => client.getPublicForm(form.formSlug as string)));
  return details
    .map(toEvent)
    .filter((event): event is EsnEvent => event !== null)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

async function clientFromEnv(env: NodeJS.ProcessEnv): Promise<HelloAssoClient | null> {
  const base = {
    baseUrl: env.HELLOASSO_API_URL || DEFAULT_API_URL,
    organization: env.HELLOASSO_ORGANIZATION || DEFAULT_ORGANIZATION,
  };
  if (env.HELLOASSO_CLIENT_ID && env.HELLOASSO_CLIENT_SECRET) {
    return createHelloAssoClient({
      ...base,
      clientId: env.HELLOASSO_CLIENT_ID,
      clientSecret: env.HELLOASSO_CLIENT_SECRET,
    });
  }
  if (env.NODE_ENV !== 'production' || env.HELLOASSO_MOCK === '1') {
    const { createMockFetch } = await import('./helloasso/mock');
    return createHelloAssoClient({ ...base, clientId: 'mock', clientSecret: 'mock', fetch: createMockFetch() });
  }
  return null;
}

let sharedClient: Promise<HelloAssoClient | null> | undefined;

/** Events that have not ended at `since` (now by default). Never throws: any failure becomes `unavailable`. */
export async function getUpcomingEvents(since = Date.now()): Promise<EventsResult> {
  sharedClient ??= clientFromEnv(process.env);
  try {
    const client = await sharedClient;
    if (!client) return { status: 'unavailable' };
    return { status: 'ok', events: await fetchUpcomingEvents(client, since) };
  } catch (error) {
    console.error('HelloAsso events unavailable:', error);
    return { status: 'unavailable' };
  }
}
