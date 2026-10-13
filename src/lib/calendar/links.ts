export const CALENDAR_PATH = '/calendar.ics';

/** Subscription links for the events feed of `site`: raw `.ics`, `webcal://` and Google Calendar. */
export function calendarLinks(site: string): { ics: string; webcal: string; google: string } {
  const ics = `${site}${CALENDAR_PATH}`;
  const webcal = ics.replace(/^https?:/, 'webcal:');
  return { ics, webcal, google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}` };
}
