import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const POSTER = '/images/home/hero-poster.webp';
const POSTER_SET = '/images/home/hero-poster-sm.webp 854w, /images/home/hero-poster.webp 1280w';

/** เน็ตช้า/โหมดประหยัดเน็ต → ไม่โหลดวิดีโอ ใช้ภาพนิ่งแทน */
function prefersLightweight() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

/**
 * พื้นหลัง Hero — ภาพนิ่งขึ้นก่อนทันที (LCP) แล้วค่อยโหลดวิดีโอหลังหน้าโหลดเสร็จ
 * - วิดีโอ 48fps ภาพหัว-ท้ายต่อกัน + เล่นสลับ 2 ตัวครอสเฟด (ไม่ใช้ loop ของเบราว์เซอร์ที่ค้างตอนวนรอบ) · ชื่อไฟล์ใหม่ กัน cache ไฟล์เก่า · มือถือใช้ไฟล์ 480p
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
  // เลือกไฟล์ครั้งเดียวตอนเริ่มโหลด: จอแคบ → 480p (~1MB) · จอใหญ่ → 720p (~2MB)
  const [src] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? '/videos/hero-loop-480.mp4'
      : '/videos/hero-loop-720.mp4',
  );

  // เริ่มโหลดวิดีโอหลังหน้าโหลดเสร็จ + เบราว์เซอร์ว่าง (ไม่แย่งแบนด์วิดท์กับ JS/ฟอนต์/ข้อมูลร้าน)
  useEffect(() => {
    if (reduce || prefersLightweight()) return;
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

  // วนรอบด้วยวิดีโอ 2 ตัวสลับกัน: <video loop> ต้อง seek กลับต้นไฟล์ → ภาพค้าง ~100 ms ทุกรอบ
  // - ตัวหลังรออยู่ที่เฟรมแรก (ซ่อนไว้) · ก่อนตัวหน้าจบ "เท่ากับเวลาที่ตัวหลังใช้เริ่มเล่น" สั่ง play ล่วงหน้า
  // - พอตัวหลังวาดเฟรมจริงเฟรมแรก (requestVideoFrameCallback) ค่อยสลับขึ้นมาแทนทันที → ตัวหน้าอยู่ที่ท้ายคลิปพอดี
  //   ภาพท้าย = ภาพหัว (ทำไว้ในไฟล์แล้ว) จึงต่อกันเนียน · วัดเวลาเริ่มเล่นจริงทุกรอบแล้วปรับรอบถัดไป
  useEffect(() => {
    const pair = [refA.current, refB.current];
    if (!load || !pair[0] || !pair[1]) return;
    const [a, b] = pair as [HTMLVideoElement, HTMLVideoElement];
    let front = a;
    let back = b;
    let switching = false;
    let raf = 0;
    let onScreen = true;
    /** เวลาที่ตัวหลังใช้ตั้งแต่สั่ง play จนวาดเฟรมแรก (วินาที) — ปรับตามที่วัดได้จริง */
    let startLag = 0.05;

    const onFirstFrame = (v: HTMLVideoElement, cb: () => void) => {
      if ('requestVideoFrameCallback' in v) v.requestVideoFrameCallback(() => cb());
      else (v as HTMLVideoElement).addEventListener('playing', () => cb(), { once: true });
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = front.duration;
      if (switching || !d || front.currentTime < d - startLag - 1 / 60) return;
      switching = true;
      const next = back;
      const prev = front;
      onFirstFrame(next, () => {
        // ตัวหน้ายังเหลือเวลาเท่าไหร่ตอนตัวหลังพร้อม = สั่งเร็วไปเท่านั้น → รอบหน้าสั่งช้าลงเท่านั้น (และกลับกัน)
        const remaining = (prev.duration || d) - prev.currentTime;
        startLag = Math.min(0.4, Math.max(0.01, startLag - 0.6 * remaining));
        next.style.zIndex = '2';
        prev.style.zIndex = '1';
        next.style.opacity = '1';
        // ปล่อยตัวเดิมแสดงข้างใต้อีกนิด (กันจอว่างเสี้ยวเฟรม) แล้วค่อยรีเซ็ตเตรียมรอบหน้า
        window.setTimeout(() => {
          prev.style.opacity = '0';
          prev.pause();
          prev.currentTime = 0;
          switching = false;
        }, 120);
        front = next;
        back = prev;
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
