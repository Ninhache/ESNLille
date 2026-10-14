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
  events: 'var(--color-esn-magenta)',
  culture: 'var(--color-esn-orange)',
  communication: 'var(--color-esn-cyan)',
  sports: 'var(--color-esn-green)',
};

export const POLES: PoleId[] = ['events', 'culture', 'communication', 'sports'];

export const BOARD: Member[] = [
  { id: 'killian', name: 'Killian', role: 'president' },
  { id: 'leonard', name: 'Léonard', role: 'vicePresident' },
  { id: 'zoe', name: 'Zoé', role: 'secretary' },
  { id: 'kierian', name: 'Kierian', role: 'treasurer' },
  { id: 'emma', name: 'Emma', role: 'eventsCoordinator', pole: 'events' },
  { id: 'simon', name: 'Simon', role: 'eventsManager', pole: 'events' },
  { id: 'romane', name: 'Romane', role: 'cultureManager', pole: 'culture' },
  { id: 'faustine', name: 'Faustine', role: 'communicationManager', pole: 'communication' },
  { id: 'thomas', name: 'Thomas', role: 'sportsManager', pole: 'sports' },
];

/** Public path of a member's photo, sized by `Member.photo`. */
export function photoSrc(member: Member): string {
  return `/team/${member.id}.jpg`;
}

/** The board members who lead `pole`, in board order. */
export function leadsOf(pole: PoleId): Member[] {
  return BOARD.filter(member => member.pole === pole);
}
