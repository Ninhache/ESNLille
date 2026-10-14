import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import { BOARD, leadsOf, POLES, photoSrc } from './team';

describe('team', () => {
  it('should have copy in both languages for every role and pole', () => {
    for (const { role } of BOARD) {
      expect(en.team.roles[role]).toBeTruthy();
      expect(fr.team.roles[role]).toBeTruthy();
    }
    for (const pole of POLES) {
      expect(en.team.poles[pole].description).toBeTruthy();
      expect(fr.team.poles[pole].description).toBeTruthy();
    }
  });

  it('should give every member a unique id', () => {
    expect(new Set(BOARD.map(member => member.id)).size).toBe(BOARD.length);
  });

  it('should give every pole at least one lead', () => {
    for (const pole of POLES) {
      expect(leadsOf(pole).length, pole).toBeGreaterThan(0);
    }
  });

  it('should ship a photo file for every member with a photo', () => {
    for (const member of BOARD.filter(member => member.photo)) {
      expect(existsSync(`public${photoSrc(member)}`), member.id).toBe(true);
    }
  });
});
