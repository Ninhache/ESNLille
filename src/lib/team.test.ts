import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import { BOARD, POLES, photoSrc } from './team';

describe('team', () => {
  it('should have copy in both languages for every role and pole', () => {
    for (const { role } of BOARD) {
      for (const copy of [en.team.roles[role], fr.team.roles[role]]) {
        expect(copy.name).toBeTruthy();
        expect(copy.mission).toBeTruthy();
      }
    }
    for (const pole of POLES) {
      expect(en.team.poles[pole].description).toBeTruthy();
      expect(fr.team.poles[pole].description).toBeTruthy();
    }
  });

  it('should give every member a unique id', () => {
    expect(new Set(BOARD.map(member => member.id)).size).toBe(BOARD.length);
  });

  it('should ship a photo file for every member with a photo', () => {
    for (const member of BOARD.filter(member => member.photo)) {
      expect(existsSync(`public${photoSrc(member)}`), member.id).toBe(true);
    }
  });
});
