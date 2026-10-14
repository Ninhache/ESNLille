import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import type { EventsResult } from '@/lib/events';
import { EVENT_POLES } from '@/lib/poles';
import { eventsJsonLd } from '@/lib/seo/json-ld';
import { siteUrl } from '@/lib/site';
import type { PoleId } from '@/lib/team';
import { CalendarSubscribe } from './calendar-subscribe';
import { EventList } from './event-list';
import { JsonLd } from './json-ld';

type Props = { locale: Locale; messages: Messages; result: EventsResult; pole?: PoleId };

function PoleFilter({ locale, messages, pole }: Omit<Props, 'result'>) {
  const chips = [
    { href: `/${locale}/events`, label: messages.events.allPoles, active: !pole },
    ...EVENT_POLES.map(id => ({
      href: `/${locale}/events/${id}`,
      label: messages.team.poles[id].name,
      active: id === pole,
    })),
  ];

  return (
    <nav aria-label={messages.events.poleFilter} className="mb-8">
      <ul className="flex flex-wrap gap-3">
        {chips.map(chip => (
          <li key={chip.href}>
            <Link
              href={chip.href}
              aria-current={chip.active ? 'page' : undefined}
              className={`inline-block rounded-full border-2 border-ink px-4 py-1.5 font-black no-underline ${
                chip.active ? 'bg-ink text-paper' : 'bg-paper shadow-hard'
              }`}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The events page body, for all events or for the events of one pole. */
export function EventsView({ locale, messages, result, pole }: Props) {
  const title = pole
    ? messages.events.poleTitle.replace('{pole}', messages.team.poles[pole].name)
    : messages.events.title;

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="mb-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{title}</h1>
      <PoleFilter locale={locale} messages={messages} pole={pole} />
      <EventList result={result} locale={locale} labels={messages.events} />
      <CalendarSubscribe site={siteUrl()} labels={messages.events.subscribe} />
      {result.status === 'ok' && result.events.length > 0 && <JsonLd data={eventsJsonLd(result.events, siteUrl())} />}
    </main>
  );
}
