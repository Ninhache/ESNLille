import type { Metadata } from 'next';
import { EventsView } from '@/components/events-view';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { getUpcomingEvents } from '@/lib/events';
import { pageMetadata } from '@/lib/seo/metadata';

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
  return <EventsView locale={locale} messages={messages} result={result} />;
}
