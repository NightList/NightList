import { useMemo, useRef } from 'react';
import { EASE_IN_OUT, EASE_OUT, MOTION_OK, MOTION_REDUCE, gsap, useGSAP } from '../utils/gsap';

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
 * ผูกกับการเลื่อนด้วย pin + scrub เพื่อให้ข้อความเป็นจังหวะคั่นก่อนเข้า podium
 */
export function SplitHeading({ lead, text }: { lead: string; text: string }) {
  const root = useRef<HTMLElement>(null);
  const chars = useMemo(() => graphemes(text), [text]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
        tl.from('[data-lead]', {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: EASE_OUT,
        }).from(
          '[data-char]',
          {
            yPercent: 115,
            opacity: 0,
            duration: 1,
            ease: EASE_IN_OUT,
            stagger: 0.04,
          },
          '+=0.12',
        );
      });
      mm.add(MOTION_REDUCE, () => {
        gsap.set('[data-lead], [data-char]', { clearProps: 'all' });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lead, text], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      className="flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <h2
        aria-label={`${lead} ${text}…`}
        className="max-w-full text-center text-5xl font-bold leading-[1.2] sm:text-7xl lg:text-8xl"
      >
        <span
          aria-hidden
          className="-mt-[0.3em] inline-block overflow-hidden align-bottom pb-[0.16em] pt-[0.3em]"
        >
          <span data-lead className="inline-block text-muted">
            {lead}{' '}
          </span>
        </span>
        <span
          aria-hidden
          className="-mt-[0.3em] inline-block overflow-hidden align-bottom pb-[0.16em] pt-[0.3em]"
        >
          <span className="inline-flex text-gold">
            {chars.map((c, i) => (
              <span
                key={i}
                data-char
                className="inline-block whitespace-pre"
                style={{ transformOrigin: '50% 100%' }}
              >
                {c}
              </span>
            ))}
            <span data-char className="inline-block">
              …
            </span>
          </span>
        </span>
      </h2>
    </section>
  );
}
