import { ArrowRight } from '@phosphor-icons/react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { HomeCategory } from '../type/category';

const CATEGORIES: HomeCategory[] = [
  {
    key: 'pub',
    image: '/images/categories/pub.webp',
    title: 'ผับ / บาร์',
    subtitle: 'แดนซ์ ปาร์ตี้',
    to: '/ranking?category=PUB_BAR',
  },
  {
    key: 'chill',
    image: '/images/categories/chill.webp',
    title: 'นั่งชิล',
    subtitle: 'คุยกันยาว ๆ',
    to: '/ranking?category=CHILL',
  },
  {
    key: 'food',
    image: '/images/categories/food.webp',
    title: 'ร้านอาหาร',
    subtitle: 'กินจริงจัง',
    to: '/ranking?category=RESTAURANT',
  },
  {
    key: 'live',
    image: '/images/categories/live.webp',
    title: 'ดนตรีสด',
    subtitle: 'วงเล่นทุกคืน',
    to: '/search?style=Live%20Music',
  },
  {
    key: 'rooftop',
    image: '/images/categories/rooftop.webp',
    title: 'Rooftop',
    subtitle: 'วิวเมือง',
    to: '/search?style=Rooftop',
  },
  {
    key: 'quiet',
    image: '/images/categories/quiet.webp',
    title: 'ร้านเงียบ',
    subtitle: 'คุยงานได้',
    to: '/search?style=Quiet',
  },
  {
    key: 'outdoor',
    image: '/images/categories/outdoor.webp',
    title: 'Outdoor',
    subtitle: 'นั่งรับลม',
    to: '/search?style=Outdoor',
  },
  {
    key: 'private',
    image: '/images/categories/private.webp',
    title: 'ห้องส่วนตัว',
    subtitle: 'มากันเป็นกลุ่ม',
    to: '/search?style=Private%20Room',
  },
];

/** px/s ของ auto-scroll */
const SCROLL_SPEED = 40;
/** หยุด auto-scroll นานเท่านี้หลังผู้ใช้เลื่อนเอง (ms) */
const RESUME_DELAY = 1200;
/** ความหนืดของการไล่ตามเป้า (ยิ่งมากยิ่งไว) — ทำให้ล้อเมาส์ลื่น ไม่กระตุก */
const EASE = 14;

function CategoryCard({ category: c, hidden }: { category: HomeCategory; hidden?: boolean }) {
  return (
    <li className="shrink-0" aria-hidden={hidden || undefined}>
      <Link
        to={c.to}
        draggable={false}
        tabIndex={hidden ? -1 : undefined}
        className="group relative flex h-[172px] w-[132px] flex-col justify-end overflow-hidden rounded-[20px] bg-card select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <img
          src={c.image}
          alt=""
          width={240}
          height={312}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* ไล่สีม่วงอ่อนจากล่าง (Figma) ให้อ่านชื่อหมวดออก */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#efe3ff] via-[#efe3ff]/70 via-35% to-transparent to-65%" />
        <div className="relative px-3 pb-3">
          <p className="text-[15px] font-bold leading-tight text-[#8a1fd6]">{c.title}</p>
          <p className="text-xs text-[#5b3d78]">{c.subtitle}</p>
        </div>
      </Link>
    </li>
  );
}

/**
 * แถวการ์ดหมวดหมู่ — วนลูปไม่มีสุด
 *
 * ทำงานด้วย loop เดียว (requestAnimationFrame):
 *  - `target` = ตำแหน่งที่อยากไป, `pos` = ตำแหน่งจริง ไล่ตาม target แบบนุ่ม
 *  - auto-scroll = ดัน target ไปทางซ้ายทีละนิด · ล้อเมาส์ = บวก target
 *  - เลยรอบ (period = ความกว้างการ์ด 1 ชุด) → เลื่อนทั้ง pos/target กลับ 1 รอบ (มองไม่เห็นรอยต่อ)
 * จำนวนชุดที่ซ้ำคำนวณจากความกว้างจอ → จอกว้างแค่ไหนก็ไม่มีช่องว่างโผล่
 * ล้อเมาส์เร็วแค่ไหนก็ไม่หลุด เพราะ wrap ทุกเฟรม + จำกัด delta ต่อครั้ง
 * prefers-reduced-motion → ไม่ auto-scroll และขยับทันทีไม่มี easing
 */
export function CategoryRow() {
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
      const second = track.children[CATEGORIES.length] as HTMLElement | undefined;
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
  }, []);

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
      if (Math.abs(lead) > period.current) target.current = pos.current + Math.sign(lead) * period.current;
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section aria-labelledby="home-categories">
      <div className="mx-auto mb-5 flex max-w-7xl items-center justify-between px-4 md:px-8">
        <h2 id="home-categories" className="text-2xl font-bold md:text-3xl">
          หมวดหมู่
        </h2>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm font-medium !text-purple hover:!text-purple/80"
        >
          ดูทั้งหมด <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden overscroll-x-contain"
        onMouseEnter={() => {
          hovering.current = true;
        }}
        onMouseLeave={() => {
          hovering.current = false;
        }}
      >
        <motion.ul
          ref={trackRef}
          className="flex w-max touch-pan-y gap-4 pb-2 will-change-transform"
          style={{ x, cursor: 'grab' }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          whileDrag={{ cursor: 'grabbing' }}
          onClickCapture={(e) => {
            // กันคลิกลิงก์ตอนกำลังลาก
            if (dragging.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDrag={() => {
            // ระหว่างลาก motion เป็นคนขยับ x → wrap เองแล้ว sync กลับเข้า loop
            const p = period.current;
            let v = x.get();
            if (p > 0) {
              while (v <= -p) v += p;
              while (v > 0) v -= p;
              if (v !== x.get()) x.set(v);
            }
            pos.current = target.current = v;
          }}
          onDragEnd={() => {
            pos.current = target.current = x.get();
            lastInput.current = performance.now();
            setTimeout(() => {
              dragging.current = false;
            }, 0);
          }}
        >
          {Array.from({ length: copies }, (_, i) =>
            CATEGORIES.map((c) => <CategoryCard key={`${i}-${c.key}`} category={c} hidden={i > 0} />),
          )}
        </motion.ul>
      </div>
    </section>
  );
}
