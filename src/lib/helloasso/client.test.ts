import { describe, expect, it, vi } from 'vitest';
import { createHelloAssoClient, HelloAssoError } from './client';
import { createMockFetch } from './mock';

const config = { baseUrl: 'https://api.test', organization: 'esn-lille', clientId: 'id', clientSecret: 'secret' };

describe('createHelloAssoClient', () => {
  it('reuses the access token until it expires', async () => {
    let now = Date.parse('2026-10-13T12:00:00Z');
    const fetch = vi.fn(createMockFetch(() => now));
    const client = createHelloAssoClient({ ...config, fetch, now: () => now });

    await client.listEventForms();
    await client.getPublicForm('halloween-party');
    const tokenCalls = () => fetch.mock.calls.filter(([url]) => String(url).endsWith('/oauth2/token')).length;
    expect(tokenCalls()).toBe(1);

    now += 30 * 60_000;
    await client.listEventForms();
    expect(tokenCalls()).toBe(2);
  });

  it('sends client credentials and the bearer token', async () => {
    const fetch = vi.fn(createMockFetch());
    await createHelloAssoClient({ ...config, fetch }).listEventForms();

    const [tokenUrl, tokenInit] = fetch.mock.calls[0] ?? [];
    expect(tokenUrl).toBe('https://api.test/oauth2/token');
    expect(String(tokenInit?.body)).toBe('grant_type=client_credentials&client_id=id&client_secret=secret');

    const [listUrl, listInit] = fetch.mock.calls[1] ?? [];
    expect(listUrl).toBe('https://api.test/v5/organizations/esn-lille/forms?formTypes=Event&states=Public&pageSize=50');
    expect(listInit?.headers).toMatchObject({ authorization: 'Bearer mock-token' });
  });

  it('throws a HelloAssoError on a non-2xx response', async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 401 }));
    await expect(createHelloAssoClient({ ...config, fetch }).listEventForms()).rejects.toBeInstanceOf(HelloAssoError);
  });
});
