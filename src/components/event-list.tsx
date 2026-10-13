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

function EventCard({ event, locale, labels }: { event: EsnEvent; locale: string; labels: Labels }) {
  const start = new Date(event.start);
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone: TIME_ZONE }).format(start);
  const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: TIME_ZONE }).format(start);
  const when = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(start);

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
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <a
            href={event.url}
            className="rounded-xl border-2 border-ink bg-esn-cyan px-4 py-2 font-black no-underline shadow-hard"
          >
            {labels.tickets}
            <span className="sr-only">: {event.title}</span>
          </a>
          {event.price && (
            <span className="font-black">{formatPrice(event.price, event.currency, locale, labels)}</span>
          )}
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
