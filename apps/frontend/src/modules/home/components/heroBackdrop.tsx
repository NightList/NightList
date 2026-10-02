import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const POSTER = '/images/home/hero-poster.webp';
/** ครอสเฟดตอนวนรอบ (วินาที) — ภาพท้ายคลิปทำให้เหมือนหัวคลิปแล้ว แค่กลบจังหวะที่ตัวถัดไปเริ่มเล่น */
const XFADE = 0.15;
const POSTER_SET = '/images/home/hero-poster-sm.webp 854w, /images/home/hero-poster.webp 1280w';

/** เน็ตช้า/โหมดประหยัดเน็ต → ไม่โหลดวิดีโอ ใช้ภาพนิ่งแทน */
function prefersLightweight() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

/**
 * พื้นหลัง Hero — ภาพนิ่งขึ้นก่อนทันที (LCP) แล้วค่อยโหลดวิดีโอหลังหน้าโหลดเสร็จ
 * - วิดีโอ 48fps ภาพหัว-ท้ายต่อกัน + เล่นสลับ 2 ตัวครอสเฟด (ไม่ใช้ loop ของเบราว์เซอร์ที่ค้างตอนวนรอบ) · มือถือใช้ไฟล์ 480p
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
      ? '/videos/hero-480.mp4'
      : '/videos/hero.mp4',
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

  // วนรอบด้วยวิดีโอ 2 ตัวสลับกัน (A เล่นอยู่ · B รอที่เฟรมแรก) แล้วครอสเฟดก่อนจบ
  // เพราะ <video loop> ของเบราว์เซอร์ต้อง seek กลับไปต้นไฟล์ → ค้างเสี้ยววินาทีทุกรอบ แม้ภาพหัว-ท้ายจะต่อกันพอดี
  useEffect(() => {
    const pair = [refA.current, refB.current];
    if (!load || !pair[0] || !pair[1]) return;
    const [a, b] = pair as [HTMLVideoElement, HTMLVideoElement];
    let front = a;
    let back = b;
    let switching = false;
    let raf = 0;
    let onScreen = true;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = front.duration;
      if (!switching && d && front.currentTime >= d - XFADE) {
        switching = true;
        // ตัวหลัง (ค้างที่เฟรมแรก) ขึ้นมาทับแล้วเฟดเข้า — ตัวหน้ายังแสดงเต็มข้างใต้ จึงไม่มีจังหวะภาพมืด
        back.style.zIndex = '2';
        front.style.zIndex = '1';
        back.style.opacity = '1';
        void back.play().catch(() => {});
        const old = front;
        window.setTimeout(() => {
          old.style.transition = 'none';
          old.style.opacity = '0';
          old.pause();
          old.currentTime = 0; // เตรียมไว้ที่เฟรมแรกสำหรับรอบหน้า
          requestAnimationFrame(() => (old.style.transition = `opacity ${XFADE}s linear`));
          switching = false;
        }, XFADE * 1000 + 80);
        [front, back] = [back, front];
      }
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
  const fade = { transition: `opacity ${XFADE}s linear` };

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
          <video ref={refA} {...videoProps} style={{ ...fade, opacity: 1 }} onPlaying={() => setPlaying(true)} />
          <video ref={refB} {...videoProps} style={{ ...fade, opacity: 0 }} />
        </div>
      )}
    </>
  );
}
