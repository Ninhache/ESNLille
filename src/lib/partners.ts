import type { Messages } from '@/i18n/dictionaries';
import type { Place } from './places';

export type PartnerId = keyof Messages['partners']['items'];
export type PartnerGroup = 'travel' | 'lille' | 'everyday';

export type Partner = {
  id: PartnerId;
  name: string;
  group: PartnerGroup;
  url: string;
  logo: { width: number; height: number };
  place?: Place;
  featured?: boolean;
};

export const PARTNER_GROUPS: PartnerGroup[] = ['travel', 'lille', 'everyday'];

export const PARTNERS: Partner[] = [
  {
    id: 'ryanair',
    name: 'Ryanair',
    group: 'travel',
    url: 'https://esncard.org/ryanair',
    logo: { width: 512, height: 62 },
    featured: true,
  },
  {
    id: 'flixbus',
    name: 'Flixbus',
    group: 'travel',
    url: 'https://esncard.org/flixbus',
    logo: { width: 378, height: 128 },
    featured: true,
  },
  {
    id: 'flixtrain',
    name: 'FlixTrain',
    group: 'travel',
    url: 'https://esncard.org/flixtrain',
    logo: { width: 512, height: 72 },
  },
  {
    id: 'flibco',
    name: 'Flibco',
    group: 'travel',
    url: 'https://esncard.org/discount/flibco-lille',
    logo: { width: 309, height: 128 },
    place: { lat: 50.6385837, lng: 3.0767931, address: 'Boulevard de Turin, 59777 Lille' },
  },
  {
    id: 'interrail',
    name: 'Interrail',
    group: 'travel',
    url: 'https://www.interrail.eu/fr/interrail-passes/erasmus',
    logo: { width: 448, height: 128 },
  },
  {
    id: 'ambassade',
    name: "L'Ambassade",
    group: 'lille',
    url: 'https://esncard.org/discount/lambassade-lille',
    logo: { width: 682, height: 128 },
    place: { lat: 50.630917, lng: 3.0556662, address: '111 rue Solférino, 59000 Lille' },
    featured: true,
  },
  {
    id: 'ohamo',
    name: 'Ohamo',
    group: 'lille',
    url: 'https://esncard.org/discount/ohamo-watercolor-cafe-lille',
    logo: { width: 437, height: 128 },
    place: { lat: 50.631844, lng: 3.0628037, address: '6 rue Jeanne Maillotte, 59800 Lille' },
  },
  {
    id: 'fuaj',
    name: 'HI Lille',
    group: 'lille',
    url: 'https://esncard.org/discount/auberges-de-jeunesse-fuaj-hi-france-youth-hostels',
    logo: { width: 149, height: 128 },
    place: { lat: 50.6247159, lng: 3.0805059, address: '235 boulevard Paul Painlevé, 59000 Lille' },
  },
  {
    id: 'revolut',
    name: 'Revolut',
    group: 'everyday',
    url: 'https://esncard.org/discount/revolut-0',
    logo: { width: 128, height: 128 },
    featured: true,
  },
  {
    id: 'saily',
    name: 'Saily',
    group: 'everyday',
    url: 'https://esncard.org/discount/saily',
    logo: { width: 128, height: 128 },
  },
  {
    id: 'studcorp',
    name: 'Studcorp',
    group: 'everyday',
    url: 'https://studcorp.com/en/partner-en/esn',
    logo: { width: 128, height: 128 },
  },
  {
    id: 'zalando',
    name: 'Zalando',
    group: 'everyday',
    url: 'https://esncard.org/discount/zalando-gift-cards',
    logo: { width: 512, height: 93 },
  },
];

/** Public path of a partner's logo, sized by `Partner.logo`. */
export function logoSrc(partner: Partner): string {
  return `/partners/${partner.id}.png`;
}

/** The partners with a place in Lille, for the map. */
export function placedPartners(): (Partner & { place: Place })[] {
  return PARTNERS.filter((partner): partner is Partner & { place: Place } => partner.place !== undefined);
}

/** The partners of `group`, in display order. */
export function partnersIn(group: PartnerGroup): Partner[] {
  return PARTNERS.filter(partner => partner.group === group);
}
