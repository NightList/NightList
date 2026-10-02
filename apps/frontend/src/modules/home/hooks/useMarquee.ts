import { useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

/** px/s ของ auto-scroll */
const SCROLL_SPEED = 40;
/** หยุด auto-scroll นานเท่านี้หลังผู้ใช้เลื่อนเอง (ms) */
const RESUME_DELAY = 1200;
/** ความหนืดของการไล่ตามเป้า (ยิ่งมากยิ่งไว) — ทำให้ล้อเมาส์ลื่น ไม่กระตุก */
const EASE = 14;

/**
 * แถบเลื่อนวนไม่มีสุด (marquee) + ล้อเมาส์ + ลาก — ใช้กับ <motion.ul> ที่ render ของซ้ำ `copies` ชุด
 *
 * ทำงานด้วย loop เดียว (requestAnimationFrame):
 *  - `target` = ตำแหน่งที่อยากไป, `pos` = ตำแหน่งจริง ไล่ตาม target แบบนุ่ม
 *  - auto-scroll = ดัน target ไปทางซ้ายทีละนิด · ล้อเมาส์ = บวก target
 *  - เลยรอบ (period = ความกว้างการ์ด 1 ชุด) → เลื่อนทั้ง pos/target กลับ 1 รอบ (มองไม่เห็นรอยต่อ)
 * จำนวนชุดที่ซ้ำคำนวณจากความกว้างจอ → จอกว้างแค่ไหนก็ไม่มีช่องว่างโผล่
 * ล้อเมาส์เร็วแค่ไหนก็ไม่หลุด เพราะ wrap ทุกเฟรม + จำกัด delta ต่อครั้ง
 * prefers-reduced-motion → ไม่ auto-scroll และขยับทันทีไม่มี easing
 */
export function useMarquee(itemCount: number) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const period = useRef(0);
  const pos = useRef(0);
  const target = useRef(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const lastInput = useRef(0);
  const [copies, setCopies] = useState(2);

  // วัด period (จุดเริ่มชุดที่ 2 เทียบชุดแรก — แม่นกว่า scrollWidth/2 เพราะรวม gap ถูก)
  // และจำนวนชุดที่ต้องมีให้เต็มจอ · วัดใหม่เมื่อจอ/ฟอนต์เปลี่ยนขนาด
  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const measure = () => {
      const second = track.children[itemCount] as HTMLElement | undefined;
      const first = track.children[0] as HTMLElement | undefined;
      if (!first || !second) return;
      const p = second.offsetLeft - first.offsetLeft;
      if (p <= 0) return;
      period.current = p;
      setCopies(Math.max(2, Math.ceil(vp.clientWidth / p) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    ro.observe(track);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [itemCount]);

  // loop หลัก
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? true;
    });
    if (viewportRef.current) io.observe(viewportRef.current);

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05); // กันกระโดดตอนสลับแท็บกลับมา
      prev = now;
      const p = period.current;
      if (p > 0 && visible && !dragging.current) {
        const idle = now - lastInput.current > RESUME_DELAY;
        if (!reduce && idle && !hovering.current) target.current -= SCROLL_SPEED * dt;

        pos.current = reduce
          ? target.current
          : pos.current + (target.current - pos.current) * (1 - Math.exp(-EASE * dt));

        // wrap ให้อยู่ในช่วง (-p, 0] — เลื่อน target ไปพร้อมกันเพื่อไม่ให้ easing วิ่งย้อน
        while (pos.current <= -p) {
          pos.current += p;
          target.current += p;
        }
        while (pos.current > 0) {
          pos.current -= p;
          target.current -= p;
        }
        x.set(pos.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce, x]);

  // ล้อเมาส์ต้องเป็น listener แบบ non-passive ถึงจะ preventDefault ได้ (React onWheel เป็น passive)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const raw = horizontal ? e.deltaX : e.deltaY;
      if (raw === 0 || period.current <= 0) return;
      e.preventDefault();
      // deltaMode 1 = บรรทัด (Firefox) → แปลงเป็น px · จำกัดต่อครั้งกันปัดแรงแล้วพุ่ง
      const px = e.deltaMode === 1 ? raw * 32 : raw;
      const limit = period.current / 3;
      lastInput.current = performance.now();
      target.current -= Math.max(-limit, Math.min(limit, px));
      // ไม่ให้เป้าวิ่งนำตำแหน่งจริงเกิน 1 รอบ (ไม่งั้นปล่อยล้อแล้วยังไหลต่อยาว)
      const lead = target.current - pos.current;
      if (Math.abs(lead) > period.current)
        target.current = pos.current + Math.sign(lead) * period.current;
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  const viewportProps = {
    ref: viewportRef,
    onMouseEnter: () => {
      hovering.current = true;
    },
    onMouseLeave: () => {
      hovering.current = false;
    },
  };

  const trackProps = {
    ref: trackRef,
    style: { x, cursor: 'grab' },
    drag: 'x' as const,
    dragElastic: 0,
    dragMomentum: false,
    whileDrag: { cursor: 'grabbing' },
    onClickCapture: (e: MouseEvent) => {
      // กันคลิกลิงก์ตอนกำลังลาก
      if (dragging.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onDragStart: () => {
      dragging.current = true;
    },
    onDrag: () => {
      // ระหว่างลาก motion เป็นคนขยับ x → wrap เองแล้ว sync กลับเข้า loop
      const p = period.current;
      let v = x.get();
      if (p > 0) {
        while (v <= -p) v += p;
        while (v > 0) v -= p;
        if (v !== x.get()) x.set(v);
      }
      pos.current = target.current = v;
    },
    onDragEnd: () => {
      pos.current = target.current = x.get();
      lastInput.current = performance.now();
      setTimeout(() => {
        dragging.current = false;
      }, 0);
    },
  };

  return { copies, viewportProps, trackProps };
}
