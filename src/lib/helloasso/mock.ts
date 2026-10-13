import forms from './fixtures/forms.json';
import publicForms from './fixtures/public-forms.json';
import type { FormLight, FormPublic, FormsPage, TokenResponse } from './types';

const FIXTURES_ANCHOR = Date.parse('2026-10-13T00:00:00Z');
const DAY_MS = 86_400_000;

const token: TokenResponse = { access_token: 'mock-token', token_type: 'bearer', expires_in: 1799 };

function shift(date: string | null | undefined, offset: number) {
  return date ? new Date(Date.parse(date) + offset).toISOString() : date;
}

function rebase<T extends FormLight>(form: T, offset: number): T {
  return { ...form, startDate: shift(form.startDate, offset), endDate: shift(form.endDate, offset) };
}

/**
 * A `fetch` that answers the HelloAsso endpoints used by the client from local fixtures.
 * Fixture dates are moved by whole days so that they stay relative to `now`.
 */
export function createMockFetch(now: () => number = Date.now): typeof fetch {
  return async input => {
    const url = new URL(input instanceof Request ? input.url : input);
    const offset = Math.floor((now() - FIXTURES_ANCHOR) / DAY_MS) * DAY_MS;
    const list = (forms as FormsPage).data ?? [];

    if (url.pathname === '/oauth2/token') return Response.json(token);

    if (/^\/v5\/organizations\/[^/]+\/forms$/.test(url.pathname)) {
      return Response.json({ ...forms, data: list.map(form => rebase(form, offset)) });
    }

    const slug = url.pathname.match(/^\/v5\/organizations\/[^/]+\/forms\/Event\/([^/]+)\/public$/)?.[1];
    const form = list.find(item => item.formSlug === slug);
    const details = slug ? (publicForms as Record<string, Omit<FormPublic, keyof FormLight>>)[slug] : undefined;
    if (form && details) return Response.json(rebase({ ...form, ...details }, offset));

    return new Response(null, { status: 404 });
  };
}
