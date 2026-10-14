import { describe, expect, it } from 'vitest';
import { llmsText } from './llms';

const site = 'https://lille.test';

describe('llmsText', () => {
  it('lists pages in both languages and the contact', () => {
    const text = llmsText(site, { status: 'ok', events: [] });
    expect(text.startsWith('# ESN Lille\n')).toBe(true);
    expect(text).toContain('(https://lille.test/fr/events)');
    expect(text).toContain('(https://lille.test/en)');
    expect(text).toContain('(https://lille.test/en/team)');
    expect(text).toContain('lille@esn.fr');
    expect(text).toContain('No events scheduled right now');
  });

  it('lists upcoming events in Paris time with place and price', () => {
    const text = llmsText(site, {
      status: 'ok',
      events: [
        {
          id: 'quiz',
          title: 'Quiz night',
          start: '2026-11-02T18:00:00Z',
          place: 'Lille',
          price: { kind: 'from', cents: 450 },
          currency: 'EUR',
          url: 'https://tickets.test/quiz',
        },
      ],
    });
    expect(text).toContain('- Mon, 2 Nov 2026, 19:00: [Quiz night](https://tickets.test/quiz) (Lille, from €4.50)');
  });

  it('points to HelloAsso when events are unavailable', () => {
    expect(llmsText(site, { status: 'unavailable' })).toContain("Events can't be listed right now");
  });
});
