import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import { logoSrc, PARTNER_GROUPS, PARTNERS, partnersIn, placedPartners } from './partners';
import { ESN_OFFICE, inLille } from './places';

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

  it('should place the office and every placed partner in Lille', () => {
    expect(inLille(ESN_OFFICE)).toBe(true);
    for (const partner of placedPartners()) {
      expect(inLille(partner.place), partner.id).toBe(true);
    }
  });

  it('should place the Lille partners on the map', () => {
    for (const partner of partnersIn('lille')) {
      expect(partner.place, partner.id).toBeDefined();
    }
  });
});
