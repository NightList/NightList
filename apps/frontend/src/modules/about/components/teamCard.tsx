import { Tag } from 'antd';
import type { CSSProperties } from 'react';
import { CARD, EASE_MOVE, FRAME, type Pose } from '../utils/carouselPose';
import type { TeamMember } from '../utils/content';
import { TeamPortrait } from './teamPortrait';

/**
 * การ์ดทีมงาน 1 ใบในโคราเซล — ตำแหน่ง/มุม/การตัดขอบมาจาก `pose`
 * ป้ายชื่อขยับด้วย transform เส้นเดียวกับการ์ด (ระยะเวลา + easing เดียวกัน) ไม่กระโดดตอนสลับคน
 */
export function TeamCard({
  member,
  index,
  total,
  pose: p,
  offset,
  s,
  durationMs,
  reduce,
  onSelect,
}: {
  member: TeamMember;
  index: number;
  total: number;
  pose: Pose;
  offset: number;
  /** สเกลเวที (หน่วย Figma → px) */
  s: number;
  durationMs: number;
  reduce: boolean;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const clip = p.clipY * s;
  const move = `${durationMs}ms ${EASE_MOVE}`;
  const style: CSSProperties = {
    top: (8 + (FRAME.h - CARD.h) / 2) * s,
    width: CARD.w * s,
    height: CARD.h * s,
    marginLeft: (-CARD.w * s) / 2,
    zIndex: p.z,
    opacity: p.opacity,
    transform: `translate3d(${p.x * s}px, ${p.y * s}px, 0) rotate(${p.rot}deg) scale(${p.scale})`,
    clipPath: `inset(${clip}px 0 ${clip}px 0 round ${CARD.r * s}px)`,
    transition: `transform ${move}, clip-path ${move}, opacity ${reduce ? 250 : 450}ms ease`,
    pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none',
  };
  const tagStyle: CSSProperties = {
    fontSize: Math.max(10, 20 * s),
    lineHeight: 1.5,
    paddingInline: 10 * s,
    marginInlineEnd: 0,
  };

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} จาก ${total}: ${member.name}`}
      aria-hidden={Math.abs(offset) > 1}
      className="absolute left-1/2 will-change-transform"
      style={style}
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={onSelect}
        className={`team-card group relative block size-full overflow-hidden text-left ${isActive ? 'is-active cursor-default' : 'cursor-pointer'}`}
        style={{ borderRadius: CARD.r * s }}
        aria-label={isActive ? undefined : `ดู ${member.name}`}
      >
        <TeamPortrait member={member} index={index} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/75 to-transparent"
        />
        {/* ยึดก้นการ์ดไว้ที่เดิม แล้วเลื่อนขึ้นตามขอบที่ถูกตัดด้วย transform (ไม่ใช้ bottom ที่ transition ไม่ได้) */}
        <span
          className="absolute inset-x-0 flex flex-col items-center px-[6%] text-center will-change-transform"
          style={{
            bottom: 40 * s,
            transform: `translate3d(0, ${-clip}px, 0)`,
            transition: `transform ${move}`,
            gap: 8 * s,
          }}
        >
          <span className="team-card__name font-kanit font-semibold leading-[1.25]" style={{ fontSize: 40 * s }}>
            {member.name}
          </span>
          <span className="flex flex-col items-center" style={{ gap: 6 * s }}>
            {member.role.map((r, i) => (
              <Tag
                key={r}
                variant={i === 0 ? 'solid' : 'outlined'}
                color={i === 0 ? 'blue' : 'gold'}
                style={tagStyle}
                className={
                  i === 0
                    ? 'font-bold bg-linear-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent'
                    : 'bg-none'
                }
              >
                {r}
              </Tag>
            ))}
          </span>
        </span>
      </button>
    </div>
  );
}
