import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import type { EsnEvent } from './events';
import { EVENT_POLES, eventsOfPole, isEventPole, normalize, POLE_KEYWORDS, polesOf } from './poles';

const event = (title: string): EsnEvent => ({
  id: title,
  title,
  start: '2026-11-01T20:00:00Z',
  currency: 'EUR',
  url: '',
});

describe('poles', () => {
  it('should match keywords whatever the case and accents', () => {
    expect(polesOf('SOIRÉE crêpes')).toEqual(['party']);
    expect(polesOf('Visite du Musée')).toEqual(['culture']);
  });

  it('should match whole words only', () => {
    expect(polesOf('Tournoi de volley')).toEqual(['sports']);
    expect(polesOf('Barbecue')).toEqual([]);
  });

  it('should return every pole an event matches', () => {
    expect(polesOf('Ski trip party')).toEqual(['sports', 'party', 'culture']);
  });

  it('should return no pole when no keyword matches', () => {
    expect(polesOf('Assemblée générale')).toEqual([]);
  });

  it('should keep only the events of a pole', () => {
    const result = { status: 'ok' as const, events: [event('Halloween Party'), event('Weekend à Bruges')] };
    expect(eventsOfPole(result, 'party')).toEqual({ status: 'ok', events: [event('Halloween Party')] });
    expect(eventsOfPole({ status: 'unavailable' }, 'party')).toEqual({ status: 'unavailable' });
  });

  it('should only accept poles that have events', () => {
    expect(isEventPole('party')).toBe(true);
    expect(isEventPole('hr')).toBe(false);
    expect(isEventPole('nope')).toBe(false);
  });

  it('should write keywords in normalized form', () => {
    for (const keyword of Object.values(POLE_KEYWORDS).flat()) {
      expect(normalize(keyword)).toBe(keyword);
    }
  });

  it('should have copy in both languages for every event pole', () => {
    for (const pole of EVENT_POLES) {
      expect(en.team.poles[pole].name).toBeTruthy();
      expect(fr.team.poles[pole].name).toBeTruthy();
    }
  });
});
