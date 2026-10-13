import { ORGANIZATION } from './site';

export const HELLOASSO_URL = 'https://www.helloasso.com/associations/esn-lille';

export function joinMailto(subject: string): string {
  return `mailto:${ORGANIZATION.email}?subject=${encodeURIComponent(subject)}`;
}
