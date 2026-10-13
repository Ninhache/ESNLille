import Image from 'next/image';
import { intlLocales, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import { ESNCARD } from '@/lib/esncard';

const PERK_MARKS = ['var(--color-esn-cyan)', 'var(--color-esn-magenta)', 'var(--color-esn-green)'];

type Props = { locale: Locale; labels: Messages['home']['esncard'] };

export function EsncardBlock({ locale, labels }: Props) {
  const price = new Intl.NumberFormat(intlLocales[locale], {
    style: 'currency',
    currency: ESNCARD.currency,
    maximumFractionDigits: 0,
  }).format(ESNCARD.price);

  return (
    <section
      aria-labelledby="esncard-title"
      className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <div>
        <h2 id="esncard-title" className="font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none">
          {labels.titleStart} <span className="mark">ESNcard</span>
        </h2>
        <p className="mt-5 max-w-xl text-xl leading-relaxed">{labels.lead}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {labels.perks.map((perk, index) => (
            <li key={perk} className="flex items-baseline gap-3 font-bold text-lg">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border-2 border-ink"
                style={{ background: PERK_MARKS[index % PERK_MARKS.length] }}
              />
              {perk}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-xl text-ink-soft">
          {labels.pickup}{' '}
          <a href={ESNCARD.partnersUrl} className="font-bold text-ink">
            {labels.partners}
          </a>
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href={ESNCARD.buyUrl}
            className="rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-magenta)]"
          >
            {labels.buy}
          </a>
          <p className="font-heading text-4xl leading-none">{price}</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mx-auto flex aspect-[1.586] w-full max-w-sm -rotate-3 flex-col justify-between overflow-hidden rounded-2xl border-2 border-ink bg-esn-blue text-paper shadow-hard-lg"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <Image src="/brand/esn-lille-colour-white.svg" alt="" width={86} height={48} />
          <span className="font-black text-xs uppercase tracking-wider">{labels.cardTag}</span>
        </div>
        <p className="px-6 font-heading text-5xl leading-none">ESNcard</p>
        <div className="grid h-3 grid-cols-4">
          <span className="bg-esn-cyan" />
          <span className="bg-esn-magenta" />
          <span className="bg-esn-green" />
          <span className="bg-esn-orange" />
        </div>
      </div>
    </section>
  );
}
