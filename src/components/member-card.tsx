import Image from 'next/image';
import { type Member, POLE_MARKS, photoSrc } from '@/lib/team';

type Props = { member: Member; role: { name: string; mission: string } };

export function MemberCard({ member, role }: Props) {
  const mark = member.pole ? POLE_MARKS[member.pole] : 'var(--color-esn-blue)';

  return (
    <li className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-paper p-4 shadow-hard sm:flex-col sm:items-center sm:gap-3 sm:px-5 sm:py-6 sm:text-center">
      {member.photo ? (
        <Image
          src={photoSrc(member)}
          alt=""
          width={member.photo.width}
          height={member.photo.height}
          className="size-16 shrink-0 rounded-full border-2 border-ink object-cover sm:size-28"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-ink font-heading text-3xl text-paper sm:size-28 sm:text-5xl"
          style={{ background: mark }}
        >
          {member.name.charAt(0)}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-3">
        <h3 className="font-heading text-2xl leading-none sm:text-3xl">{member.name}</h3>
        <p className="font-black text-ink-soft text-sm uppercase tracking-wider">{role.name}</p>
        <p className="leading-relaxed">{role.mission}</p>
      </div>
    </li>
  );
}
