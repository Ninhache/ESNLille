import type { Messages } from '@/i18n/dictionaries';
import type { Partner, PartnerGroup } from '@/lib/partners';

export const GROUP_MARKS: Record<PartnerGroup, string> = {
  travel: 'var(--color-esn-cyan)',
  lille: 'var(--color-esn-magenta)',
  everyday: 'var(--color-esn-green)',
};

type Props = { partner: Partner; labels: Messages['partners'] };

export function PartnerCard({ partner, labels }: Props) {
  const copy = labels.items[partner.id];

  return (
    <li className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-paper px-6 py-5 shadow-hard">
      <p className="font-black text-ink-soft text-sm uppercase tracking-wider">{copy.kind}</p>
      <h3 className="font-heading text-3xl leading-none">{partner.name}</h3>
      <p className="font-bold text-lg">
        <span className="mark" style={{ '--mark': GROUP_MARKS[partner.group] } as React.CSSProperties}>
          {copy.offer}
        </span>
      </p>
      <a href={partner.url} className="mt-auto pt-2 font-black">
        {labels.seeOffer}
        <span className="sr-only">: {partner.name}</span>
      </a>
    </li>
  );
}
