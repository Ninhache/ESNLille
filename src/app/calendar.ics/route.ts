import { unstable_cache } from 'next/cache';
import { connection } from 'next/server';
import { eventsCalendar } from '@/lib/calendar/ics';
import { getUpcomingEvents } from '@/lib/events';
import { ORGANIZATION, siteUrl } from '@/lib/site';

const REVALIDATE_SECONDS = 900;
const HISTORY_MS = 30 * 24 * 60 * 60 * 1000;

const loadEvents = unstable_cache(
  async () => {
    const result = await getUpcomingEvents(Date.now() - HISTORY_MS);
    if (result.status !== 'ok') throw new Error('HelloAsso events unavailable');
    return result.events;
  },
  ['calendar-events'],
  { revalidate: REVALIDATE_SECONDS },
);

export async function GET() {
  await connection();
  try {
    const body = eventsCalendar(await loadEvents(), { site: siteUrl(), now: new Date(), name: ORGANIZATION.name });
    return new Response(body, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': `public, max-age=${REVALIDATE_SECONDS}`,
      },
    });
  } catch {
    return new Response('Events unavailable', { status: 503, headers: { 'Retry-After': String(REVALIDATE_SECONDS) } });
  }
}
