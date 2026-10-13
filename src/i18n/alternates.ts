import type { Metadata } from 'next';
import { defaultLocale, type Locale, locales } from './config';

export function alternates(locale: Locale, path = ''): Metadata['alternates'] {
  const languages = Object.fromEntries(locales.map(l => [l, `/${l}${path}`]));
  return {
    canonical: `/${locale}${path}`,
    languages: { ...languages, 'x-default': `/${defaultLocale}${path}` },
  };
}
