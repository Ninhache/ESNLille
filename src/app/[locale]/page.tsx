import { getMessages } from '@/i18n/dictionaries';
import { HELLOASSO_URL, joinMailto } from '@/lib/links';

export default async function HomePage() {
  const messages = await getMessages();
  const { home } = messages;

  return (
    <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
      <h1 className="max-w-3xl font-heading text-[clamp(3rem,7.6vw,6.25rem)] leading-[0.98]">
        {home.titleStart} <span className="mark">{home.titleMark}</span>
      </h1>
      <p className="mt-6 max-w-xl text-xl leading-relaxed">{home.lead}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={HELLOASSO_URL}
          className="rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-cyan)]"
        >
          {home.eventsCta}
        </a>
        <a
          href={joinMailto(messages.join.mailSubject)}
          className="rounded-2xl border-2 border-ink bg-paper px-6 py-4 font-black text-lg no-underline shadow-[5px_5px_0_var(--color-ink)]"
        >
          {home.volunteerCta}
        </a>
      </div>
    </main>
  );
}
