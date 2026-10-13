import type { Metadata } from 'next';
import { alternates } from '@/i18n/alternates';
import { type Locale, locales } from '@/i18n/config';
import { ORGANIZATION } from '../site';

const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_GB' };

const SHARE_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'ESN Lille, Erasmus Student Network Lille' };

type PageMetadata = { locale: Locale; title: string; description: string; path?: string };

/** Title, description, canonical, hreflang, Open Graph and Twitter metadata for one localized page. */
export function pageMetadata({ locale, title, description, path = '' }: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: ORGANIZATION.name,
      url: `/${locale}${path}`,
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: locales.filter(l => l !== locale).map(l => OG_LOCALES[l]),
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE] },
  };
}
