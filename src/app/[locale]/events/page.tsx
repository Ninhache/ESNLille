import type { Metadata } from 'next';
import { EventList } from '@/components/event-list';
import { alternates } from '@/i18n/alternates';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { getUpcomingEvents } from '@/lib/events';

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return {
    title: `${messages.events.title} | ${messages.meta.title}`,
    description: messages.events.metaDescription,
    alternates: alternates(locale, '/events'),
  };
}

export default async function EventsPage() {
  const [locale, messages, result] = await Promise.all([getLocale(), getMessages(), getUpcomingEvents()]);

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="mb-8 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{messages.events.title}</h1>
      <EventList result={result} locale={locale} labels={messages.events} />
    </main>
  );
}
