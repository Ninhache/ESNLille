import Image from 'next/image';

const HELLOASSO_URL = 'https://www.helloasso.com/associations/esn-lille';
const JOIN_MAILTO = 'mailto:lille@esn.fr?subject=Volunteering%20at%20ESN%20Lille';

export default function HomePage() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Image src="/brand/esn-lille-colour-black.svg" alt="ESN Lille" width={115} height={64} priority />
        <a
          href={JOIN_MAILTO}
          className="rounded-xl border-2 border-ink bg-esn-blue px-5 py-3 font-black text-paper no-underline shadow-hard"
        >
          Join us
        </a>
      </header>

      <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
        <h1 className="max-w-3xl font-heading text-[clamp(3rem,7.6vw,6.25rem)] leading-[0.98]">
          Your Erasmus diary starts <span className="mark">in Lille.</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed">
          Parties, trips, culture and sports with students from all over the world, organised by local volunteers.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={HELLOASSO_URL}
            className="rounded-2xl border-2 border-ink bg-ink px-6 py-4 font-black text-lg text-paper no-underline shadow-[5px_5px_0_var(--color-esn-cyan)]"
          >
            See upcoming events
          </a>
          <a
            href={JOIN_MAILTO}
            className="rounded-2xl border-2 border-ink bg-paper px-6 py-4 font-black text-lg no-underline shadow-[5px_5px_0_var(--color-ink)]"
          >
            Become a volunteer
          </a>
        </div>
      </main>
    </>
  );
}
