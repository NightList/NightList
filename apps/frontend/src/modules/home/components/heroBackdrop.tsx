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
 * - วิดีโอ 48fps ต่อท้าย-หัวแบบไร้รอยต่อ (ไม่กระตุกตอนวนรอบ) · มือถือใช้ไฟล์ 480p
 * - เฟรมแรกของวิดีโอ = ภาพนิ่ง → ค่อยๆ เฟดเข้า ไม่มีภาพกระโดด
 * - หยุดเล่นเมื่อเลื่อนพ้นจอ / สลับแท็บ (ประหยัดแบต)
 * - prefers-reduced-motion หรือเน็ตช้า → ภาพนิ่งอย่างเดียว
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
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

  // เล่นเฉพาะตอนเห็นบนจอ
  useEffect(() => {
    const v = ref.current;
    if (!load || !v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !document.hidden) void v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : void v.play().catch(() => {}));
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [load]);

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
        <video
          ref={ref}
          className={`absolute inset-0 -z-10 size-full object-cover transition-opacity duration-700 ease-out ${playing ? 'opacity-100' : 'opacity-0'}`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
