import type { Metadata } from 'next';
import { MemberCard } from '@/components/member-card';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { joinMailto } from '@/lib/links';
import { pageMetadata } from '@/lib/seo/metadata';
import { BOARD, leadsOf, POLE_MARKS, POLES } from '@/lib/team';

export async function generateMetadata(): Promise<Metadata> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return pageMetadata({
    locale,
    title: `${messages.team.title} | ${messages.meta.title}`,
    description: messages.team.metaDescription,
    path: '/team',
  });
}

export default async function TeamPage() {
  const messages = await getMessages();
  const labels = messages.team;

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{labels.title}</h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed">{labels.lead}</p>
      <section aria-labelledby="board-title" className="mt-14">
        <h2 id="board-title" className="mb-6 font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-none">
          {labels.boardTitle}
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {BOARD.map(member => (
            <MemberCard key={member.id} member={member} role={labels.roles[member.role]} />
          ))}
        </ul>
      </section>
      <section aria-labelledby="poles-title" className="mt-16">
        <h2 id="poles-title" className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-none">
          {labels.polesTitle}
        </h2>
        <p className="mt-3 mb-6 max-w-2xl text-lg leading-relaxed">{labels.polesLead}</p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POLES.map(pole => {
            const leads = leadsOf(pole);
            return (
              <li
                key={pole}
                className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-paper px-6 py-5 shadow-hard"
              >
                <h3 className="font-heading text-3xl leading-none">
                  <span className="mark" style={{ '--mark': POLE_MARKS[pole] } as React.CSSProperties}>
                    {labels.poles[pole].name}
                  </span>
                </h3>
                <p className="text-lg leading-relaxed">{labels.poles[pole].description}</p>
                {leads.length > 0 && (
                  <p className="mt-auto font-bold text-ink-soft">
                    {labels.ledBy} {leads.map(member => member.name).join(', ')}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href={joinMailto(messages.join.mailSubject)}
          className="mt-8 inline-block rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-magenta)]"
        >
          {labels.joinCta}
        </a>
      </section>
    </main>
  );
}
