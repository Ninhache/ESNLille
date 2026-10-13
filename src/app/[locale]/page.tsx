import Link from 'next/link';
import { EsncardBlock } from '@/components/esncard-block';
import { EventList, NextEvent } from '@/components/event-list';
import { JsonLd } from '@/components/json-ld';
import { StatsStrip } from '@/components/stats-strip';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { getUpcomingEvents } from '@/lib/events';
import { joinMailto } from '@/lib/links';
import { organizationJsonLd } from '@/lib/seo/json-ld';
import { siteUrl } from '@/lib/site';
import { getStats } from '@/lib/stats';

export const revalidate = 900;

const HOME_EVENT_COUNT = 4;

export default async function HomePage() {
  const [locale, messages, events] = await Promise.all([getLocale(), getMessages(), getUpcomingEvents()]);
  const { home } = messages;
  const [next, ...later] = events.status === 'ok' ? events.events : [];

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <h1 className="max-w-3xl font-heading text-[clamp(3rem,7.6vw,6.25rem)] leading-[0.98]">
            {home.titleStart} <span className="mark">{home.titleMark}</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed">{home.lead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/events`}
              className="rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-cyan)]"
            >
              {home.eventsCta}
            </Link>
            <a
              href={joinMailto(messages.join.mailSubject)}
              className="rounded-2xl border-2 border-ink bg-paper px-6 py-4 font-black text-lg no-underline shadow-[5px_5px_0_var(--color-ink)]"
            >
              {home.volunteerCta}
            </a>
          </div>
        </div>
        {next && <NextEvent event={next} locale={locale} labels={messages.events} />}
      </div>
      <StatsStrip stats={getStats(new Date())} locale={locale} labels={home.stats} />
      <EsncardBlock locale={locale} labels={home.esncard} />
      {(!next || later.length > 0) && (
        <section aria-labelledby="events-title" className="mt-20">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="events-title" className="font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none">
              {messages.events.title}
            </h2>
            <Link href={`/${locale}/events`} className="font-black">
              {messages.events.seeAll}
            </Link>
          </div>
          <EventList
            result={next ? { status: 'ok', events: later } : events}
            locale={locale}
            labels={messages.events}
            limit={HOME_EVENT_COUNT}
          />
        </section>
      )}
      <JsonLd data={organizationJsonLd(siteUrl())} />
    </main>
  );
}
