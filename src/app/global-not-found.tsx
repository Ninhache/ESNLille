import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { isLocale, LOCALE_HEADER } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { negotiateLocale } from '@/i18n/negotiate';
import { display, lato } from './fonts';
import './globals.css';

async function resolveLocale() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get(LOCALE_HEADER) ?? '';
  return isLocale(locale) ? locale : negotiateLocale(requestHeaders.get('accept-language'));
}

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getDictionary(await resolveLocale());
  return { title: messages.notFound.title };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const messages = await getDictionary(locale);

  return (
    <html lang={locale} className={`${display.variable} ${lato.variable}`}>
      <body className="min-h-dvh antialiased">
        <SiteHeader locale={locale} messages={messages} />
        <main id="content" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
          <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)]">{messages.notFound.title}</h1>
          <Link href={`/${locale}`} className="mt-6 inline-block font-black">
            {messages.notFound.back}
          </Link>
        </main>
      </body>
    </html>
  );
}
