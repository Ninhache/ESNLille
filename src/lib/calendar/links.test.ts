import { describe, expect, it } from 'vitest';
import { calendarLinks } from './links';

describe('calendarLinks', () => {
  it('should derive webcal and Google Calendar links from the site URL', () => {
    expect(calendarLinks('https://lille.test')).toEqual({
      ics: 'https://lille.test/calendar.ics',
      webcal: 'webcal://lille.test/calendar.ics',
      google: 'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Flille.test%2Fcalendar.ics',
    });
  });
});
