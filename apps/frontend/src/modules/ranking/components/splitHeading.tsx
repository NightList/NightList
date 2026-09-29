import { useMemo, useRef } from 'react';
import { EASE_OUT, MOTION_OK, MOTION_REDUCE, gsap, useGSAP } from '../utils/gsap';

/**
 * แยกข้อความเป็นตัวอักษรแบบ grapheme (Intl.Segmenter) — ภาษาไทยสระ/วรรณยุกต์ติดกับพยัญชนะ
 * ไม่หลุดออกจากกันเหมือนการ split ทีละ char (SplitText แยก "ผู้" เป็น 3 ชิ้น)
 */
function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('th', { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * หัวข้อ "สัปดาห์นี้ ผู้ชนะได้แก่…" — text animation ด้วย GSAP
 * 1) คำนำ ("สัปดาห์นี้") ขึ้นมาจากใต้เส้น (mask) ทั้งคำ
 * 2) "ผู้ชนะได้แก่" ขึ้นทีละตัวอักษร (stagger 35ms, expo.out) พร้อมคลายตัวจากเอียง
 * 3) จุด "…" เด้งทีละจุดวนช้าๆ เหมือนรอประกาศผล (ช่วงลุ้น — delight tier)
 * เล่นเมื่อเลื่อนมาถึง (ครั้งเดียว) · เปลี่ยนสัปดาห์/เดือน (key ใหม่) เล่นใหม่
 */
export function SplitHeading({ lead, text }: { lead: string; text: string }) {
  const root = useRef<HTMLHeadingElement>(null);
  const chars = useMemo(() => graphemes(text), [text]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });
        tl.from('[data-lead]', { yPercent: 110, duration: 0.7, ease: EASE_OUT })
          .from(
            '[data-char]',
            {
              yPercent: 115,
              rotation: 8,
              opacity: 0,
              duration: 0.8,
              ease: EASE_OUT,
              stagger: 0.035,
            },
            '-=0.45',
          )
          .from(
            '[data-dot]',
            { yPercent: 60, opacity: 0, duration: 0.35, ease: EASE_OUT, stagger: 0.12 },
            '-=0.2',
          )
          // จุดลุ้นผล: ขึ้นลงทีละจุด วนเรื่อยๆ (แอมพลิจูดเล็ก ไม่แย่งสายตาจากการ์ด)
          .to('[data-dot]', {
            yPercent: -35,
            duration: 0.45,
            ease: 'sine.inOut',
            stagger: { each: 0.15, repeat: -1, yoyo: true },
          });
      });
      mm.add(MOTION_REDUCE, () => {
        gsap.from(root.current, {
          opacity: 0,
          duration: 0.4,
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lead, text], revertOnUpdate: true },
  );

  return (
    <h2
      ref={root}
      aria-label={`${lead} ${text}…`}
      className="flex flex-wrap items-baseline justify-center gap-x-3 text-center text-3xl font-bold leading-[1.35] sm:text-5xl"
    >
      <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span data-lead className="inline-block text-muted">
          {lead}
        </span>
      </span>
      <span aria-hidden className="inline-flex overflow-hidden pb-[0.12em]">
        {chars.map((c, i) => (
          <span key={i} data-char className="inline-block whitespace-pre" style={{ transformOrigin: '0% 100%' }}>
            {c}
          </span>
        ))}
        <span className="inline-flex text-gold">
          {[0, 1, 2].map((i) => (
            <span key={i} data-dot className="inline-block">
              .
            </span>
          ))}
        </span>
      </span>
    </h2>
  );
}
