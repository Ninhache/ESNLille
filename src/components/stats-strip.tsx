import { intlLocales, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import type { Stat, StatKey } from '@/lib/stats';

const MARKS: Record<StatKey, string> = {
  events: 'var(--color-esn-cyan)',
  students: 'var(--color-esn-magenta)',
  volunteers: 'var(--color-esn-green)',
  years: 'var(--color-esn-orange)',
};

type Props = { stats: Stat[]; locale: Locale; labels: Messages['home']['stats'] };

export function StatsStrip({ stats, locale, labels }: Props) {
  const format = new Intl.NumberFormat(intlLocales[locale]);

  return (
    <section aria-labelledby="stats-title" className="mt-20">
      <h2 id="stats-title" className="sr-only">
        {labels.title}
      </h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 rounded-2xl border-2 border-ink bg-paper px-6 py-10 shadow-hard-lg sm:px-10 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.key} className="flex flex-col-reverse justify-end gap-2">
            <dt className="font-bold text-lg leading-snug">{labels[stat.key]}</dt>
            <dd className="whitespace-nowrap font-heading text-[clamp(2.25rem,10vw,3.5rem)] leading-none lg:text-[clamp(3rem,5vw,4.25rem)]">
              <span className="mark" style={{ '--mark': MARKS[stat.key] } as React.CSSProperties}>
                {format.format(stat.value)}
                {stat.plus && '+'}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
