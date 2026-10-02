import { useEffect, useState, type RefObject } from 'react';

/** true เมื่อองค์ประกอบอยู่ในจอ (≥ threshold) และแท็บไม่ได้ซ่อน — ใช้หยุด autoplay */
export function useInViewAndVisible(ref: RefObject<HTMLElement | null>, threshold = 0.25) {
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [ref, threshold]);
  return inView && visible;
}
