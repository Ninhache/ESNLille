import type { EventsResult } from './events';
import { POLES, type PoleId } from './team';

export const POLE_KEYWORDS: Partial<Record<PoleId, string[]>> = {
  sports: [
    'sport',
    'foot',
    'football',
    'volley',
    'running',
    'hike',
    'rando',
    'randonnee',
    'ski',
    'bowling',
    'tournoi',
    'match',
  ],
  party: ['soiree', 'party', 'gala', 'bar', 'clubbing', 'pub crawl', 'afterwork'],
  culture: ['visite', 'musee', 'trip', 'voyage', 'weekend', 'week-end', 'tour', 'cinema', 'culture'],
};

export const EVENT_POLES: PoleId[] = POLES.filter(pole => POLE_KEYWORDS[pole]?.length);

/** Lowercases `text` and strips its accents, the form keywords are written in. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function containsWords(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u').test(text);
}

/** The poles whose keywords appear as whole words in `title`, in `POLES` order. */
export function polesOf(title: string): PoleId[] {
  const text = normalize(title);
  return EVENT_POLES.filter(pole => POLE_KEYWORDS[pole]?.some(keyword => containsWords(text, keyword)));
}

/** Whether `value` is a pole that has an events page. */
export function isEventPole(value: string): value is PoleId {
  return (EVENT_POLES as string[]).includes(value);
}

/** `result` restricted to the events of `pole`; failures pass through unchanged. */
export function eventsOfPole(result: EventsResult, pole: PoleId): EventsResult {
  if (result.status !== 'ok') return result;
  return { status: 'ok', events: result.events.filter(event => polesOf(event.title).includes(pole)) };
}
