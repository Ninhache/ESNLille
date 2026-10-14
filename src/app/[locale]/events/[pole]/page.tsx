import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventsView } from '@/components/events-view';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { getUpcomingEvents } from '@/lib/events';
import { EVENT_POLES, eventsOfPole, isEventPole } from '@/lib/poles';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 900;
export const dynamicParams = false;

type Props = { params: Promise<{ pole: string }> };

export function generateStaticParams() {
  return EVENT_POLES.map(pole => ({ pole }));
}

async function poleParam(params: Props['params']) {
  const { pole } = await params;
  if (!isEventPole(pole)) notFound();
  return pole;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [pole, locale, messages] = await Promise.all([poleParam(params), getLocale(), getMessages()]);
  const { name, description } = messages.team.poles[pole];
  return pageMetadata({
    locale,
    title: `${messages.events.poleTitle.replace('{pole}', name)} | ${messages.meta.title}`,
    description,
    path: `/events/${pole}`,
  });
}

export default async function PoleEventsPage({ params }: Props) {
  const [pole, locale, messages, result] = await Promise.all([
    poleParam(params),
    getLocale(),
    getMessages(),
    getUpcomingEvents(),
  ]);
  return <EventsView locale={locale} messages={messages} result={eventsOfPole(result, pole)} pole={pole} />;
}
