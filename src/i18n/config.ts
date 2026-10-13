export const locales = ['fr', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const intlLocales: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' };

export const LOCALE_HEADER = 'x-locale';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
