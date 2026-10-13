import type { Metadata } from 'next';
import { EventList } from '@/components/event-list';
import { JsonLd } from '@/components/json-ld';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { getUpcomingEvents } from '@/lib/events';
import { eventsJsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import { siteUrl } from '@/lib/site';

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return pageMetadata({
    locale,
    title: `${messages.events.title} | ${messages.meta.title}`,
    description: messages.events.metaDescription,
    path: '/events',
  });
}

export default async function EventsPage() {
  const [locale, messages, result] = await Promise.all([getLocale(), getMessages(), getUpcomingEvents()]);

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="mb-8 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{messages.events.title}</h1>
      <EventList result={result} locale={locale} labels={messages.events} />
      {result.status === 'ok' && result.events.length > 0 && <JsonLd data={eventsJsonLd(result.events, siteUrl())} />}
    </main>
  );
}
