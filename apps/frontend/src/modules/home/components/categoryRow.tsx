import {
  BeerStein,
  CaretLeft,
  CaretRight,
  City,
  Door,
  ForkKnife,
  Martini,
  MoonStars,
  MusicNotes,
  Tree,
} from '@phosphor-icons/react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { HomeCategory } from '../type/category';

const CATEGORIES: HomeCategory[] = [
  {
    key: 'pub',
    title: 'ผับ / บาร์',
    subtitle: 'แดนซ์ ปาร์ตี้',
    to: '/ranking?category=PUB_BAR',
    icon: BeerStein,
    tone: 'amber',
  },
  {
    key: 'chill',
    title: 'นั่งชิล',
    subtitle: 'คุยกันยาว ๆ',
    to: '/ranking?category=CHILL',
    icon: Martini,
    tone: 'violet',
  },
  {
    key: 'food',
    title: 'ร้านอาหาร',
    subtitle: 'กินจริงจัง',
    to: '/ranking?category=RESTAURANT',
    icon: ForkKnife,
    tone: 'amber',
  },
  {
    key: 'live',
    title: 'ดนตรีสด',
    subtitle: 'วงเล่นทุกคืน',
    to: '/search?style=Live%20Music',
    icon: MusicNotes,
    tone: 'violet',
  },
  {
    key: 'rooftop',
    title: 'Rooftop',
    subtitle: 'วิวเมือง',
    to: '/search?style=Rooftop',
    icon: City,
    tone: 'amber',
  },
  {
    key: 'quiet',
    title: 'ร้านเงียบ',
    subtitle: 'คุยงานได้',
    to: '/search?style=Quiet',
    icon: MoonStars,
    tone: 'violet',
  },
  {
    key: 'outdoor',
    title: 'Outdoor',
    subtitle: 'นั่งรับลม',
    to: '/search?style=Outdoor',
    icon: Tree,
    tone: 'amber',
  },
  {
    key: 'private',
    title: 'ห้องส่วนตัว',
    subtitle: 'มากันเป็นกลุ่ม',
    to: '/search?style=Private%20Room',
    icon: Door,
    tone: 'violet',
  },
];

/** โทนการ์ดตาม Figma: amber = สายเบียร์, violet = สายค็อกเทล */
const TONE: Record<HomeCategory['tone'], string> = {
  amber: 'from-[#ffd77a] via-[#e8963a] to-[#5b1f8a]',
  violet: 'from-[#2a0f45] via-[#6d1fb0] to-[#e04fa0]',
};

/** ความกว้างการ์ด + ช่องว่าง (w-40 + gap-4) ใช้เป็นระยะกดลูกศร 1 ครั้ง */
const STEP = 160 + 16;
/** px/s ของ auto-scroll */
const SCROLL_SPEED = 40;
/** หยุด auto-scroll นานเท่านี้หลังผู้ใช้เลื่อนเอง (ms) */
const RESUME_DELAY = 1200;
/** ความหนืดของการไล่ตามเป้า (ยิ่งมากยิ่งไว) — ทำให้ล้อเมาส์/ลูกศรลื่น ไม่กระตุก */
const EASE = 14;

function CategoryCard({ category: c, hidden }: { category: HomeCategory; hidden?: boolean }) {
  return (
    <li className="shrink-0" aria-hidden={hidden || undefined}>
      <Link
        to={c.to}
        draggable={false}
        tabIndex={hidden ? -1 : undefined}
        className="group relative flex h-52 w-40 flex-col overflow-hidden rounded-2xl border border-white/10 !text-white select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <div
          className={`relative flex flex-1 items-center justify-center bg-gradient-to-br ${TONE[c.tone]}`}
        >
          <c.icon
            size={64}
            weight="duotone"
            className="text-white/90 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="bg-black/70 px-3 py-2.5 backdrop-blur">
          <p className="font-semibold leading-tight">{c.title}</p>
          <p className="text-xs text-white/65">{c.subtitle}</p>
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
 *  - auto-scroll = ดัน target ไปทางซ้ายทีละนิด · ล้อเมาส์/ลูกศร = บวก target
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

  /** ผู้ใช้เลื่อนเอง (px, ลบ = ไปทางขวา) */
  const nudge = (delta: number) => {
    lastInput.current = performance.now();
    target.current += delta;
  };

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
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4 md:px-0">
        <h2 id="home-categories" className="text-xl font-semibold">
          หมวดหมู่
        </h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="เลื่อนไปทางซ้าย"
            onClick={() => nudge(STEP)}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-text transition hover:border-gold hover:text-gold-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="เลื่อนไปทางขวา"
            onClick={() => nudge(-STEP)}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-text transition hover:border-gold hover:text-gold-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
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
          className="flex w-max gap-4 pb-2 will-change-transform"
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
