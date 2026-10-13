import { getUpcomingEvents } from '@/lib/events';
import { llmsText } from '@/lib/seo/llms';
import { siteUrl } from '@/lib/site';

export const revalidate = 900;

export async function GET() {
  const body = llmsText(siteUrl(), await getUpcomingEvents());
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
