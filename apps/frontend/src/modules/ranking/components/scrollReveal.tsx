import { useRef, type ReactNode } from 'react';
import { EASE_OUT, MOTION_OK, gsap, useGSAP } from '../utils/gsap';

/**
 * ห่อบล็อกให้ "ค่อยโผล่มา" ตามการเลื่อน (scrub): จาง + ลอยขึ้น 40px
 * ผูกกับตำแหน่งสกอลล์ เลื่อนกลับขึ้นจะจางกลับ · reduced-motion = แสดงทันที
 */
export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: EASE_OUT,
            scrollTrigger: { trigger: root.current, start: 'top 96%', end: 'top 70%', scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
