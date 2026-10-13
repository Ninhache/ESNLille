import { notFound } from 'next/navigation';
import { locale as localeParam } from 'next/root-params';
import type en from '../../messages/en.json';
import { isLocale, type Locale } from './config';

export type Messages = typeof en;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import('../../messages/en.json').then(module => module.default),
  fr: () => import('../../messages/fr.json').then(module => module.default satisfies Messages),
};

export async function getLocale(): Promise<Locale> {
  const locale = await localeParam();
  if (!isLocale(locale)) notFound();
  return locale;
}

export function getDictionary(locale: Locale): Promise<Messages> {
  return dictionaries[locale]();
}

export async function getMessages(): Promise<Messages> {
  return getDictionary(await getLocale());
}
