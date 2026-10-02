import { User } from '@phosphor-icons/react';
import type { TeamMember } from '../utils/content';

const TINTS = [
  'linear-gradient(160deg,#f1eff7 0%,#d9d5e4 100%)',
  'linear-gradient(160deg,#d4d4d8 0%,#a9a9b2 100%)',
  'linear-gradient(160deg,#e9e4f5 0%,#c6bde0 100%)',
];

/** รูปทีมงาน — ไม่มีรูป → เงาคนบนพื้นสตูดิโอโทนเทา/ม่วงอ่อน */
export function TeamPortrait({ member, index }: { member: TeamMember; index: number }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
    );
  }
  return (
    <span aria-hidden="true" className="absolute inset-0" style={{ background: TINTS[index % TINTS.length] }}>
      <User weight="fill" className="absolute bottom-[-6%] left-1/2 size-[92%] -translate-x-1/2 text-[#8f8aa3]/70" />
    </span>
  );
}
