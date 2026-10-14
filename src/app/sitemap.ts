import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

const PAGES: { path: string; changeFrequency: 'daily' | 'weekly'; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/events', changeFrequency: 'daily', priority: 0.8 },
  { path: '/partners', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/team', changeFrequency: 'weekly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    locales.map(locale => ({
      url: absoluteUrl(`/${locale}${path}`),
      changeFrequency,
      priority,
      alternates: { languages: Object.fromEntries(locales.map(l => [l, absoluteUrl(`/${l}${path}`)])) },
    })),
  );
}
