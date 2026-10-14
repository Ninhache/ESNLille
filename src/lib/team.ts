import type { Messages } from '@/i18n/dictionaries';

export type RoleId = keyof Messages['team']['roles'];
export type PoleId = keyof Messages['team']['poles'];

export type Member = {
  id: string;
  name: string;
  role: RoleId;
  pole?: PoleId;
  photo?: { width: number; height: number };
};

export const POLE_MARKS: Record<PoleId, string> = {
  sports: 'var(--color-esn-green)',
  communication: 'var(--color-esn-cyan)',
  party: 'var(--color-esn-magenta)',
  culture: 'var(--color-esn-orange)',
  hr: 'color-mix(in srgb, var(--color-esn-blue) 45%, var(--color-paper))',
};

export const POLES: PoleId[] = ['sports', 'communication', 'party', 'culture', 'hr'];

export const BOARD: Member[] = [
  { id: 'leonard', name: 'Léonard', role: 'coPresident' },
  { id: 'romane', name: 'Romane', role: 'coPresident' },
  { id: 'melina', name: 'Mélina', role: 'vicePresident' },
  { id: 'zoe', name: 'Zoé', role: 'secretary' },
  { id: 'rimes', name: 'Rimes', role: 'treasurer' },
  { id: 'yves', name: 'Yves', role: 'operationsManager' },
];

/** Public path of a member's photo, sized by `Member.photo`. */
export function photoSrc(member: Member): string {
  return `/team/${member.id}.jpg`;
}

/** The board members who lead `pole`, in board order. */
export function leadsOf(pole: PoleId): Member[] {
  return BOARD.filter(member => member.pole === pole);
}
