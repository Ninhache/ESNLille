import { type NextRequest, NextResponse } from 'next/server';
import { LOCALE_HEADER, locales } from './i18n/config';
import { negotiateLocale } from './i18n/negotiate';
import { isNoIndex } from './lib/site';

const NOINDEX = 'noindex, nofollow';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = locales.find(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (locale) {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);
    const response = NextResponse.next({ request: { headers } });
    if (isNoIndex()) response.headers.set('X-Robots-Tag', NOINDEX);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiateLocale(request.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/|.*\\.).*)'],
};
