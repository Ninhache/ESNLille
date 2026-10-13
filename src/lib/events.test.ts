import { describe, expect, it } from 'vitest';
import { fetchUpcomingEvents, toEvent } from './events';
import { createHelloAssoClient } from './helloasso/client';
import { createMockFetch } from './helloasso/mock';
import type { FormPublic } from './helloasso/types';

const now = Date.parse('2026-10-13T12:00:00Z');
const client = createHelloAssoClient({
  baseUrl: 'https://api.test',
  organization: 'esn-lille',
  clientId: 'id',
  clientSecret: 'secret',
  fetch: createMockFetch(() => now),
  now: () => now,
});

const form: FormPublic = {
  formSlug: 'quiz',
  formType: 'Event',
  state: 'Public',
  title: 'Quiz night',
  startDate: '2026-11-02T19:00:00+01:00',
  url: 'https://www.helloasso.com/associations/esn-lille/evenements/quiz',
};

describe('fetchUpcomingEvents', () => {
  it('hides past events and sorts by start date', async () => {
    const events = await fetchUpcomingEvents(client, now);
    expect(events.map(event => event.id)).toEqual([
      'soiree-crepes-et-jeux',
      'halloween-party',
      'weekend-a-bruges',
      'visite-louvre-lens',
    ]);
  });

  it('keeps an event that started but has not ended', async () => {
    const during = Date.parse('2026-11-14T12:00:00Z');
    const events = await fetchUpcomingEvents(client, during);
    expect(events[0]?.id).toBe('weekend-a-bruges');
  });

  it('propagates API failures', async () => {
    const failing = createHelloAssoClient({
      baseUrl: 'https://api.test',
      organization: 'esn-lille',
      clientId: 'id',
      clientSecret: 'secret',
      fetch: async () => new Response(null, { status: 500 }),
    });
    await expect(fetchUpcomingEvents(failing, now)).rejects.toThrow('500');
  });
});

describe('toEvent', () => {
  it('summarizes prices', () => {
    const tier = (price: number | null, id = 1) => ({ id, tierType: 'Registration', price });
    expect(toEvent({ ...form, tiers: [tier(0)] })?.price).toEqual({ kind: 'free' });
    expect(toEvent({ ...form, tiers: [tier(500)] })?.price).toEqual({ kind: 'fixed', cents: 500 });
    expect(toEvent({ ...form, tiers: [tier(5500, 1), tier(4500, 2)] })?.price).toEqual({ kind: 'from', cents: 4500 });
    expect(toEvent({ ...form, tiers: [] })?.price).toBeUndefined();
  });

  it('joins place name and city without repeating them', () => {
    expect(toEvent({ ...form, place: { name: 'Louvre-Lens', city: 'Lens' } })?.place).toBe('Louvre-Lens, Lens');
    expect(toEvent({ ...form, place: { name: 'Lille', city: 'Lille' } })?.place).toBe('Lille');
    expect(toEvent({ ...form, place: null })?.place).toBeUndefined();
  });

  it('drops forms without a start date', () => {
    expect(toEvent({ ...form, startDate: null })).toBeNull();
  });
});
