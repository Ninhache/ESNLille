import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { locales } from '@/i18n/config';
import { getLocale, getMessages } from '@/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/metadata';
import { siteUrl } from '@/lib/site';
import { display, lato } from '../fonts';
import '../globals.css';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return {
    metadataBase: new URL(siteUrl()),
    ...pageMetadata({ locale, title: messages.meta.title, description: messages.meta.description }),
  };
}

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale} className={`${display.variable} ${lato.variable}`}>
      <body className="min-h-dvh antialiased">
        <SiteHeader locale={locale} messages={messages} />
        {children}
      </body>
    </html>
  );
}
