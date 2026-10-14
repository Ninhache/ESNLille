import Image from 'next/image';
import { type Member, POLE_MARKS, photoSrc } from '@/lib/team';

type Props = { member: Member; role: { name: string; mission: string } };

export function MemberCard({ member, role }: Props) {
  const mark = member.pole ? POLE_MARKS[member.pole] : 'var(--color-esn-blue)';

  return (
    <li className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink bg-paper px-5 py-6 text-center shadow-hard">
      {member.photo ? (
        <Image
          src={photoSrc(member)}
          alt=""
          width={member.photo.width}
          height={member.photo.height}
          className="size-28 rounded-full border-2 border-ink object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-28 place-items-center rounded-full border-2 border-ink font-heading text-5xl text-paper"
          style={{ background: mark }}
        >
          {member.name.charAt(0)}
        </span>
      )}
      <h3 className="font-heading text-3xl leading-none">{member.name}</h3>
      <p className="font-black text-ink-soft text-sm uppercase tracking-wider">{role.name}</p>
      <p className="leading-relaxed">{role.mission}</p>
    </li>
  );
}
