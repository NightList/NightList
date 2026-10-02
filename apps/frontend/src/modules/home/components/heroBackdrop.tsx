import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const POSTER = '/images/home/hero-poster.webp';
/**
 * วิดีโอพื้นหลัง · null = ใช้ภาพนิ่งอย่างเดียว
 * hero-loop-hf-*.mp4 = คลิป Higgsfield (MiniMax H3 Max, เฟรมแรก=เฟรมท้าย, 480p 5 วิ) ขยายเป็น 1080p ด้วย Real-ESRGAN
 *   (+ เติมดาวเล็กๆ กลับจากภาพเดิม) แล้วเพิ่มเฟรมเป็น 48fps · ครอสเฟด 1 วิตอนวนรอบ
 * (สคริปต์ scripts/render-hero-loop.py ใช้เรนเดอร์คลิปวนรอบจากภาพนิ่งได้ ถ้าจะกลับไปใช้แบบนั้น)
 */
const HERO_VIDEO: { sm: string; lg: string } | null = {
  sm: '/videos/hero-loop-hf-480.mp4',
  lg: '/videos/hero-loop-hf-1080.mp4',
};
/** ครอสเฟดตอนต่อรอบ (ms) — ตัวใหม่จางเข้าทับตัวเก่าที่ยังทึบอยู่ */
const SEAM_FADE = 1000;
const POSTER_SET = '/images/home/hero-poster-sm.webp 854w, /images/home/hero-poster.webp 1600w';

/** เน็ตช้า/โหมดประหยัดเน็ต → ไม่โหลดวิดีโอ ใช้ภาพนิ่งแทน */
function prefersLightweight() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

/**
 * พื้นหลัง Hero — ภาพนิ่งขึ้นก่อนทันที (LCP) แล้วค่อยโหลดวิดีโอหลังหน้าโหลดเสร็จ
 * - วิดีโอ (ถ้าตั้ง HERO_VIDEO) เล่นสลับ 2 ตัว ไม่ใช้ <video loop> ที่ค้างตอนวนรอบ · มือถือใช้ไฟล์เล็ก
 * - เฟรมแรกของวิดีโอ = ภาพนิ่ง → ค่อยๆ เฟดเข้า ไม่มีภาพกระโดด
 * - หยุดเล่นเมื่อเลื่อนพ้นจอ / สลับแท็บ (ประหยัดแบต)
 * - prefers-reduced-motion หรือเน็ตช้า → ภาพนิ่งอย่างเดียว
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  // เลือกไฟล์ครั้งเดียวตอนเริ่มโหลด: จอแคบ → 480p (~0.6MB) · จอใหญ่ → 1080p (~3MB)
  const [src] = useState(() =>
    !HERO_VIDEO
      ? ''
      : typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
        ? HERO_VIDEO.sm
        : HERO_VIDEO.lg,
  );

  // เริ่มโหลดวิดีโอหลังหน้าโหลดเสร็จ + เบราว์เซอร์ว่าง (ไม่แย่งแบนด์วิดท์กับ JS/ฟอนต์/ข้อมูลร้าน)
  useEffect(() => {
    if (!HERO_VIDEO || reduce || prefersLightweight()) return;
    let idle = 0;
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setLoad(true), { timeout: 1500 })
        : window.setTimeout(() => setLoad(true), 300);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [reduce]);

  // วนรอบด้วยวิดีโอ 2 ตัวสลับกัน + ครอสเฟด (ไม่ใช้ <video loop> ที่ต้อง seek กลับต้นไฟล์ → ภาพค้างทุกรอบ)
  // - ก่อนตัวหน้าจบ SEAM_FADE (+ เวลาที่ตัวหลังใช้เริ่มเล่น) สั่งตัวหลังเล่นจากต้นไฟล์
  // - พอตัวหลังวาดเฟรมแรกจริง (requestVideoFrameCallback) ยกขึ้นด้านบนแล้วค่อยๆ ทึบขึ้นใน SEAM_FADE
  // - ตัวหน้า "ทึบเต็มที่อยู่ข้างใต้" ตลอดการเฟด (ไม่จางพร้อมกัน → ภาพไม่โปร่ง/ไม่หายกลางทาง)
  //   แล้วค่อยหยุด + กลับไปต้นไฟล์ หลังตัวใหม่ทับสนิทแล้ว
  useEffect(() => {
    const pair = [refA.current, refB.current];
    if (!load || !pair[0] || !pair[1]) return;
    const [a, b] = pair as [HTMLVideoElement, HTMLVideoElement];
    let front = a;
    let back = b;
    let switching = false;
    let raf = 0;
    let onScreen = true;
    /** เวลาที่ตัวหลังใช้ตั้งแต่สั่ง play จนวาดเฟรมแรก (วินาที) — ปรับตามที่วัดได้จริงทุกรอบ */
    let startLag = 0.05;
    const fade = SEAM_FADE / 1000;

    const onFirstFrame = (v: HTMLVideoElement, cb: () => void) => {
      if ('requestVideoFrameCallback' in v) v.requestVideoFrameCallback(() => cb());
      else (v as HTMLVideoElement).addEventListener('playing', () => cb(), { once: true });
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = front.duration;
      if (switching || !d || front.currentTime < d - fade - startLag) return;
      switching = true;
      const next = back;
      const prev = front;
      const askedAt = performance.now();
      onFirstFrame(next, () => {
        startLag = Math.min(0.4, Math.max(0.01, 0.5 * startLag + 0.5 * ((performance.now() - askedAt) / 1000)));
        prev.style.zIndex = '1';
        next.style.zIndex = '2';
        next.style.transition = `opacity ${SEAM_FADE}ms linear`;
        next.style.opacity = '1';
        front = next;
        back = prev;
        window.setTimeout(() => {
          // ตัวใหม่ทับสนิทแล้ว → ซ่อน/หยุดตัวเก่า แล้วรอที่เฟรมแรกสำหรับรอบหน้า
          prev.style.transition = 'none';
          prev.style.opacity = '0';
          prev.pause();
          prev.currentTime = 0;
          switching = false;
        }, SEAM_FADE + 80);
      });
      if (next.currentTime !== 0) next.currentTime = 0;
      void next.play().catch(() => {
        switching = false;
      });
    };
    const resume = () => {
      if (onScreen && !document.hidden) {
        void front.play().catch(() => {});
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      a.pause();
      b.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = !!e?.isIntersecting;
      if (onScreen) resume();
      else stop();
    });
    io.observe(a);
    const onVis = () => (document.hidden ? stop() : resume());
    document.addEventListener('visibilitychange', onVis);
    resume();
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [load]);

  const videoProps = {
    src,
    muted: true,
    playsInline: true,
    preload: 'auto',
    className: 'absolute inset-0 size-full object-cover',
  } as const;

  return (
    <>
      <img
        src={POSTER}
        srcSet={POSTER_SET}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      {load && (
        // ตัวนอก = เฟดเข้าครั้งแรก (จากภาพนิ่ง) · ตัวใน 2 ตัว = สลับครอสเฟดตอนวนรอบ
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 transition-opacity duration-700 ease-out ${playing ? 'opacity-100' : 'opacity-0'}`}
        >
          <video ref={refA} {...videoProps} style={{ opacity: 1 }} onPlaying={() => setPlaying(true)} />
          <video ref={refB} {...videoProps} style={{ opacity: 0 }} />
        </div>
      )}
    </>
  );
}
