import type { Messages } from '@/i18n/dictionaries';

export type PartnerId = keyof Messages['partners']['items'];
export type PartnerGroup = 'travel' | 'lille' | 'everyday';

export type Partner = { id: PartnerId; name: string; group: PartnerGroup; url: string; featured?: boolean };

export const PARTNER_GROUPS: PartnerGroup[] = ['travel', 'lille', 'everyday'];

export const PARTNERS: Partner[] = [
  { id: 'ryanair', name: 'Ryanair', group: 'travel', url: 'https://esncard.org/ryanair', featured: true },
  { id: 'flixbus', name: 'Flixbus', group: 'travel', url: 'https://esncard.org/flixbus', featured: true },
  { id: 'flixtrain', name: 'FlixTrain', group: 'travel', url: 'https://esncard.org/flixtrain' },
  { id: 'flibco', name: 'Flibco', group: 'travel', url: 'https://esncard.org/discount/flibco-lille' },
  {
    id: 'interrail',
    name: 'Interrail',
    group: 'travel',
    url: 'https://www.interrail.eu/fr/interrail-passes/erasmus',
  },
  {
    id: 'ambassade',
    name: "L'Ambassade",
    group: 'lille',
    url: 'https://esncard.org/discount/lambassade-lille',
    featured: true,
  },
  { id: 'ohamo', name: 'Ohamo', group: 'lille', url: 'https://esncard.org/discount/ohamo-watercolor-cafe-lille' },
  { id: 'revolut', name: 'Revolut', group: 'everyday', url: 'https://esncard.org/discount/revolut-0', featured: true },
  { id: 'saily', name: 'Saily', group: 'everyday', url: 'https://esncard.org/discount/saily' },
  { id: 'studcorp', name: 'Studcorp', group: 'everyday', url: 'https://studcorp.com/en/partner-en/esn' },
  { id: 'zalando', name: 'Zalando', group: 'everyday', url: 'https://esncard.org/discount/zalando-gift-cards' },
];

/** The partners of `group`, in display order. */
export function partnersIn(group: PartnerGroup): Partner[] {
  return PARTNERS.filter(partner => partner.group === group);
}
