import { defaultLocale, isLocale, type Locale } from './config';

export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map(part => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.find(param => param.trim().startsWith('q='));
      return { language: tag.split('-')[0]?.toLowerCase() ?? '', weight: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => b.weight - a.weight);

  return (ranked.find(({ language }) => isLocale(language))?.language as Locale | undefined) ?? defaultLocale;
}
