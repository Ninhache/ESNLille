import { intlLocales, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import type { EsnEvent, EventsResult, Price } from '@/lib/events';
import { HELLOASSO_URL } from '@/lib/links';

const TIME_ZONE = 'Europe/Paris';

type Labels = Messages['events'];

type Props = {
  result: EventsResult;
  locale: Locale;
  labels: Labels;
  limit?: number;
};

function formatPrice(price: Price, currency: string, locale: string, labels: Labels) {
  if (price.kind === 'free') return labels.free;
  const amount = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: price.cents % 100 === 0 ? 0 : 2,
  }).format(price.cents / 100);
  return price.kind === 'from' ? labels.from.replace('{price}', amount) : amount;
}

function formatDate(iso: string, locale: string) {
  const start = new Date(iso);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone: TIME_ZONE }).format(start);
  return {
    day: format({ day: 'numeric' }),
    month: format({ month: 'short' }),
    when: format({ weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
  };
}

function EventCard({ event, locale, labels }: { event: EsnEvent; locale: string; labels: Labels }) {
  const { day, month, when } = formatDate(event.start, locale);

  return (
    <li className="flex gap-5 rounded-2xl border-2 border-ink bg-paper p-5 shadow-hard">
      <time
        dateTime={event.start}
        className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-esn-blue text-paper"
      >
        <span className="font-heading text-3xl leading-none">{day}</span>
        <span className="font-black text-sm uppercase">{month}</span>
      </time>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-heading text-2xl leading-tight">{event.title}</h3>
        <p className="font-bold first-letter:uppercase">{when}</p>
        {event.place && <p className="text-ink-soft">{event.place}</p>}
        {event.description && <p className="mt-1">{event.description}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-3">
          {event.price && (
            <span className="font-black">{formatPrice(event.price, event.currency, locale, labels)}</span>
          )}
          <a
            href={event.url}
            className="rounded-xl border-2 border-ink bg-esn-cyan px-4 py-2 font-black no-underline shadow-hard"
          >
            {labels.tickets}
            <span className="sr-only">: {event.title}</span>
          </a>
        </div>
      </div>
    </li>
  );
}

export function EventList({ result, locale, labels, limit }: Props) {
  const events = result.status === 'ok' ? result.events.slice(0, limit) : [];

  if (events.length === 0) {
    return (
      <p className="max-w-xl text-lg">
        {result.status === 'ok' ? labels.empty : labels.unavailable}{' '}
        <a href={HELLOASSO_URL} className="font-black">
          {labels.openHelloasso}
        </a>
      </p>
    );
  }

  return (
    <ol className="grid gap-5 md:grid-cols-2">
      {events.map(event => (
        <EventCard key={event.id} event={event} locale={intlLocales[locale]} labels={labels} />
      ))}
    </ol>
  );
}

/** Ticket-style card for the next event, shown in the home page hero. */
export function NextEvent({ event, locale, labels }: { event: EsnEvent; locale: Locale; labels: Labels }) {
  const intlLocale = intlLocales[locale];
  const { day, month, when } = formatDate(event.start, intlLocale);

  return (
    <article
      aria-labelledby="next-event-title"
      className="rounded-2xl border-2 border-ink bg-paper shadow-hard-lg lg:rotate-[1.5deg]"
    >
      <header className="flex items-center justify-between gap-4 rounded-t-[0.875rem] bg-esn-blue px-6 py-4 text-paper">
        <p className="font-black text-sm uppercase tracking-wider">{labels.next}</p>
        <time dateTime={event.start} className="text-right font-heading leading-none">
          <span className="block text-5xl">{day}</span>
          <span className="block text-xl">{month}</span>
        </time>
      </header>
      <div className="flex flex-col gap-1 border-ink border-t-2 border-dashed px-6 pt-5 pb-6">
        <h2 id="next-event-title" className="font-heading text-3xl leading-tight">
          {event.title}
        </h2>
        <p className="font-bold first-letter:uppercase">{when}</p>
        {event.place && <p className="text-ink-soft">{event.place}</p>}
        <div className="mt-4 flex items-center justify-between gap-4">
          <a
            href={event.url}
            className="rounded-xl border-2 border-ink bg-esn-cyan px-5 py-3 font-black text-lg no-underline shadow-hard"
          >
            {labels.tickets}
            <span className="sr-only">: {event.title}</span>
          </a>
          {event.price && (
            <span className="font-black text-lg">{formatPrice(event.price, event.currency, intlLocale, labels)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
