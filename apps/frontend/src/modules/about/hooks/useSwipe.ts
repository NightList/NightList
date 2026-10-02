import { useRef, type PointerEvent } from 'react';

const SWIPE_PX = 40;

/**
 * ปัดซ้าย/ขวาด้วย pointer (เมาส์ + นิ้ว) · `suppressClick` = true ถ้าเพิ่งลาก (กันคลิกการ์ดหลุด)
 */
export function useSwipe({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const handlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      drag.current = { x: e.clientX, id: e.pointerId, moved: false };
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = drag.current;
      if (d && d.id === e.pointerId && !d.moved && Math.abs(e.clientX - d.x) > 6) {
        d.moved = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      const d = drag.current;
      drag.current = null;
      suppressClick.current = !!d?.moved;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      if (dx <= -SWIPE_PX) onNext();
      else if (dx >= SWIPE_PX) onPrev();
    },
    onPointerCancel: () => {
      drag.current = null;
    },
  };
  return { handlers, suppressClick };
}
