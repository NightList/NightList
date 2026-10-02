import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInViewAndVisible } from '../hooks/useInViewAndVisible';
import { useStageScale } from '../hooks/useStageScale';
import { useSwipe } from '../hooks/useSwipe';
import { circularOffset, FRAME, poseFor } from '../utils/carouselPose';
import { TEAM, type TeamMember } from '../utils/content';
import { CarouselDots } from './carouselDots';
import { TeamCard } from './teamCard';

const AUTOPLAY_MS = 3000;

/**
 * ทีมงาน — โคราเซลแบบวงล้อ (Figma: ทีมงาน)
 * คนกลางใหญ่อยู่ในกรอบกระจก · ซ้าย/ขวาเล็กลงและเอียงออก · ที่เหลือซ่อนอยู่หลังขอบจอ
 * หมุนเองทุก 3 วิ · ลาก/ปัดได้ · กดการ์ดข้าง ๆ หรือจุดด้านล่าง · ลูกศรซ้าย/ขวาบนคีย์บอร์ด
 * หยุดหมุนเมื่อชี้เมาส์/โฟกัส/เลื่อนออกนอกจอ/สลับแท็บ · ปิดการเคลื่อนไหว: ไม่หมุนเอง ไม่เลื่อนตำแหน่ง
 */
export function TeamCarousel({ team = TEAM }: { team?: TeamMember[] }) {
  const n = team.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const s = useStageScale(rootRef);
  const reduce = !!useReducedMotion();
  const onScreen = useInViewAndVisible(rootRef);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);
  const { handlers, suppressClick } = useSwipe({ onNext: next, onPrev: prev });

  const autoplay = !reduce && !hovered && !focused && onScreen;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [autoplay, next, active]);

  const current = team[active]!;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="ทีมงาน NightList"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          next();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prev();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <div className="relative mx-auto touch-pan-y select-none" style={{ height: (FRAME.h + 150) * s }} {...handlers}>
        {/* กรอบกระจกของคนกลาง — อยู่กับที่ การ์ดหมุนผ่านเข้า-ออก */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 border-[1.5px] border-white/30 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_30px_80px_-30px_rgba(40,0,90,0.6)] backdrop-blur-[2px]"
          style={{
            top: 8 * s,
            width: FRAME.w * s,
            height: FRAME.h * s,
            marginLeft: (-FRAME.w * s) / 2,
            borderRadius: FRAME.r * s,
          }}
        />
        {team.map((m, i) => {
          const offset = circularOffset(i, active, n);
          return (
            <TeamCard
              key={m.name}
              member={m}
              index={i}
              total={n}
              offset={offset}
              pose={poseFor(offset)}
              s={s}
              durationMs={reduce ? 0 : 700}
              reduce={reduce}
              onSelect={() => {
                if (!suppressClick.current && offset !== 0) go(i);
              }}
            />
          );
        })}
      </div>

      <CarouselDots labels={team.map((m) => m.name)} active={active} onSelect={go} />

      {/* ผู้อ่านหน้าจอ: บอกคนปัจจุบันเฉพาะตอนผู้ใช้เป็นคนเปลี่ยน (ไม่พูดตอนหมุนเอง) */}
      <p className="sr-only" aria-live={autoplay ? 'off' : 'polite'}>
        {current.name} — {current.role.join(', ')}
      </p>
    </div>
  );
}
