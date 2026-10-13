export const HELLOASSO_URL = 'https://www.helloasso.com/associations/esn-lille';

const CONTACT_EMAIL = 'lille@esn.fr';

export function joinMailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
