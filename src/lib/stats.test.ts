import { describe, expect, it } from 'vitest';
import { getStats } from './stats';

describe('getStats', () => {
  it('counts the years since the 2010 founding', () => {
    const years = getStats(new Date('2026-10-13T12:00:00Z')).find(stat => stat.key === 'years');
    expect(years).toEqual({ key: 'years', value: 16, plus: false });
  });

  it('shows events per month first', () => {
    expect(getStats(new Date())[0]).toEqual({ key: 'events', value: 70, plus: true });
  });
});
