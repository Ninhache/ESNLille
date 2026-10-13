const FOUNDING_YEAR = 2010;

export type StatKey = 'events' | 'students' | 'volunteers' | 'years';

export type Stat = { key: StatKey; value: number; plus: boolean };

/** The headline figures of the home page; `years` counts from the 2010 founding to `now`. */
export function getStats(now: Date): Stat[] {
  return [
    { key: 'events', value: 70, plus: true },
    { key: 'students', value: 4000, plus: true },
    { key: 'volunteers', value: 50, plus: true },
    { key: 'years', value: now.getFullYear() - FOUNDING_YEAR, plus: false },
  ];
}
