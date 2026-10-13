import Image from 'next/image';
import Link from 'next/link';
import { type Locale, locales } from '@/i18n/config';
import type { Messages } from '@/i18n/dictionaries';
import { joinMailto } from '@/lib/links';
import { LocaleSwitcher } from './locale-switcher';

type Props = {
  locale: Locale;
  messages: Messages;
};

export function SiteHeader({ locale, messages }: Props) {
  const other = locales.find(l => l !== locale) ?? locale;

  return (
    <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
      <Link href={`/${locale}`}>
        <Image src="/brand/esn-lille-colour-black.svg" alt="ESN Lille" width={115} height={64} priority />
      </Link>
      <nav className="flex items-center gap-3">
        <LocaleSwitcher target={other} label={messages.header.switchLocale} />
        <a
          href={joinMailto(messages.join.mailSubject)}
          className="rounded-xl border-2 border-ink bg-esn-blue px-5 py-3 font-black text-paper no-underline shadow-hard"
        >
          {messages.header.join}
        </a>
      </nav>
    </header>
  );
}
