export const ORGANIZATION = {
  name: 'ESN Lille',
  legalName: 'Erasmus Student Network Lille',
  email: 'lille@esn.fr',
  foundingDate: '2010',
  address: {
    name: "Maison de l'Étudiant",
    street: 'Cité Scientifique',
    postalCode: '59650',
    city: "Villeneuve-d'Ascq",
    country: 'FR',
  },
  socials: {
    instagram: 'https://www.instagram.com/esn_lille/',
    tiktok: 'https://www.tiktok.com/@esnlille',
  },
  parent: { name: 'ESN France', url: 'https://esnfrance.org' },
} as const;

/** The public origin of the site, from `SITE_URL` (localhost by default). */
export function siteUrl(): string {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

/** Turns a site path such as `/fr/events` into an absolute URL. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path}`;
}

/** Whether this host must stay out of search indexes (`SITE_NOINDEX=1`, read at runtime). */
export function isNoIndex(): boolean {
  return process.env.SITE_NOINDEX === '1';
}
