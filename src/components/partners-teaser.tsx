import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import { PARTNERS } from '@/lib/partners';
import { PartnerCard } from './partner-card';

type Props = { locale: Locale; labels: Messages['partners'] };

export function PartnersTeaser({ locale, labels }: Props) {
  return (
    <section aria-labelledby="partners-title" className="mt-20">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="partners-title" className="font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none">
          {labels.homeTitle}
        </h2>
        <Link href={`/${locale}/partners`} className="font-black">
          {labels.seeAll}
        </Link>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PARTNERS.filter(partner => partner.featured).map(partner => (
          <PartnerCard key={partner.id} partner={partner} labels={labels} />
        ))}
      </ul>
    </section>
  );
}
