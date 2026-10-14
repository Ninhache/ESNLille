import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import { PARTNER_GROUPS, PARTNERS, partnersIn } from './partners';

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
});
