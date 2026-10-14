import type { Metadata } from 'next';
import { PartnerCard } from '@/components/partner-card';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { ESNCARD } from '@/lib/esncard';
import { PARTNER_GROUPS, partnersIn } from '@/lib/partners';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return pageMetadata({
    locale,
    title: `${messages.partners.title} | ${messages.meta.title}`,
    description: messages.partners.metaDescription,
    path: '/partners',
  });
}

export default async function PartnersPage() {
  const messages = await getMessages();
  const labels = messages.partners;

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{labels.title}</h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed">{labels.lead}</p>
      {PARTNER_GROUPS.map(group => (
        <section key={group} aria-labelledby={`group-${group}`} className="mt-14">
          <h2 id={`group-${group}`} className="mb-6 font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-none">
            {labels.groups[group]}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partnersIn(group).map(partner => (
              <PartnerCard key={partner.id} partner={partner} labels={labels} />
            ))}
          </ul>
        </section>
      ))}
      <section
        aria-labelledby="more-title"
        className="mt-16 rounded-2xl border-2 border-ink bg-paper px-6 py-8 shadow-hard-lg sm:px-10"
      >
        <h2 id="more-title" className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-none">
          {labels.moreTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{labels.moreLead}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <a
            href={ESNCARD.buyUrl}
            className="rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-magenta)]"
          >
            {messages.home.esncard.buy}
          </a>
          <a href={ESNCARD.partnersUrl} className="font-black">
            {labels.moreLink}
          </a>
        </div>
      </section>
    </main>
  );
}
