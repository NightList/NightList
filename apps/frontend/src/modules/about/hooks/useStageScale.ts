import { useLayoutEffect, useState, type RefObject } from 'react';
import { FRAME, SCALE } from '../utils/carouselPose';

/** สเกลเวทีโคราเซลตามความกว้าง/ความสูงจอ (ทุกขนาดใน Figma คูณค่านี้) */
export function useStageScale(ref: RefObject<HTMLElement | null>) {
  const [s, setS] = useState(0.8);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      // มือถือเทียบเวที 900 (เห็นการ์ดข้าง ๆ โผล่ที่ขอบจอ)
      const byWidth = w < 768 ? w / 900 : (Math.min(w, 1600) / 1600) * SCALE;
      // จอเตี้ย (โน้ตบุ๊ก) → กรอบกลางสูงไม่เกิน 58% ของความสูงจอ
      const byHeight = (window.innerHeight * 0.58) / FRAME.h;
      setS(Math.min(byWidth, byHeight));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);
  return s;
}
