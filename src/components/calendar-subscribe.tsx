import type { Messages } from '@/i18n/dictionaries';
import { calendarLinks } from '@/lib/calendar/links';

type Props = { site: string; labels: Messages['events']['subscribe'] };

export function CalendarSubscribe({ site, labels }: Props) {
  const links = calendarLinks(site);
  const button = 'rounded-xl border-2 border-ink px-5 py-3 font-black no-underline shadow-hard';

  return (
    <section
      aria-labelledby="subscribe-title"
      className="mt-16 rounded-2xl border-2 border-ink bg-paper px-6 py-8 shadow-hard-lg sm:px-10"
    >
      <h2 id="subscribe-title" className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-none">
        {labels.title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">{labels.lead}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a href={links.google} className={`${button} bg-esn-cyan`}>
          {labels.google}
        </a>
        <a href={links.webcal} className={`${button} bg-paper`}>
          {labels.apple}
        </a>
        <a href={links.ics} className="font-bold">
          {labels.raw}
        </a>
      </div>
    </section>
  );
}
