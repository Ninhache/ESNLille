import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import { logoSrc, PARTNER_GROUPS, PARTNERS, partnersIn } from './partners';

describe('partners', () => {
  it('should have copy in both languages for every partner', () => {
    for (const { id } of PARTNERS) {
      expect(en.partners.items[id].offer).toBeTruthy();
      expect(fr.partners.items[id].offer).toBeTruthy();
    }
  });

  it('should put every partner in exactly one listed group', () => {
    const grouped = PARTNER_GROUPS.flatMap(partnersIn);
    expect(grouped).toHaveLength(PARTNERS.length);
  });

  it('should feature four partners on the home page', () => {
    expect(PARTNERS.filter(partner => partner.featured)).toHaveLength(4);
  });

  it('should ship a logo file for every partner', () => {
    for (const partner of PARTNERS) {
      expect(existsSync(`public${logoSrc(partner)}`), partner.id).toBe(true);
    }
  });
});
