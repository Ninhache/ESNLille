import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { absoluteUrl, isNoIndex } from '@/lib/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  if (isNoIndex()) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
