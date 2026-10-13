import type { FormLight, FormPublic, FormsPage, TokenResponse } from './types';

const TOKEN_EXPIRY_MARGIN_MS = 60_000;
const PAGE_SIZE = 50;

export type HelloAssoConfig = {
  baseUrl: string;
  organization: string;
  clientId: string;
  clientSecret: string;
  fetch?: typeof fetch;
  now?: () => number;
};

export type HelloAssoClient = {
  listEventForms(): Promise<FormLight[]>;
  getPublicForm(formSlug: string): Promise<FormPublic>;
};

export class HelloAssoError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
  ) {
    super(`HelloAsso responded ${status} on ${path}`);
    this.name = 'HelloAssoError';
  }
}

/**
 * Creates a HelloAsso API v5 client authenticated with OAuth2 client credentials.
 * The access token is cached until shortly before it expires.
 *
 * @throws HelloAssoError when the API answers with a non-2xx status.
 */
export function createHelloAssoClient(config: HelloAssoConfig): HelloAssoClient {
  const http = config.fetch ?? fetch;
  const now = config.now ?? Date.now;
  const organization = encodeURIComponent(config.organization);
  let token: { value: string; expiresAt: number } | undefined;

  async function accessToken(): Promise<string> {
    if (token && token.expiresAt > now()) return token.value;

    const path = '/oauth2/token';
    const response = await http(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    });
    if (!response.ok) throw new HelloAssoError(response.status, path);

    const body = (await response.json()) as TokenResponse;
    token = { value: body.access_token, expiresAt: now() + body.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS };
    return token.value;
  }

  async function get<T>(path: string): Promise<T> {
    const response = await http(`${config.baseUrl}/v5${path}`, {
      headers: { authorization: `Bearer ${await accessToken()}`, accept: 'application/json' },
    });
    if (!response.ok) throw new HelloAssoError(response.status, path);
    return (await response.json()) as T;
  }

  return {
    async listEventForms() {
      const forms: FormLight[] = [];
      let continuationToken: string | null | undefined;

      do {
        const query = new URLSearchParams({ formTypes: 'Event', states: 'Public', pageSize: String(PAGE_SIZE) });
        if (continuationToken) query.set('continuationToken', continuationToken);
        const page = await get<FormsPage>(`/organizations/${organization}/forms?${query}`);
        const items = page.data ?? [];
        forms.push(...items);
        continuationToken = items.length === PAGE_SIZE ? page.pagination.continuationToken : null;
      } while (continuationToken);

      return forms;
    },

    getPublicForm(formSlug) {
      return get<FormPublic>(`/organizations/${organization}/forms/Event/${encodeURIComponent(formSlug)}/public`);
    },
  };
}
