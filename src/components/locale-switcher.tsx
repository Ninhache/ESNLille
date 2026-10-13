'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';

type Props = {
  target: Locale;
  label: string;
};

export function LocaleSwitcher({ target, label }: Props) {
  const pathname = usePathname();
  const rest = pathname.split('/').slice(2).join('/');
  const href = `/${target}${rest ? `/${rest}` : ''}`;

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={label}
      className="rounded-xl border-2 border-ink bg-paper px-4 py-3 font-black uppercase no-underline shadow-hard"
    >
      {target}
    </Link>
  );
}
