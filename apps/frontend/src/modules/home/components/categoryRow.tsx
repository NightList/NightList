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
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type WheelEvent } from 'react';
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
const RESUME_DELAY = 1500;

function CategoryCard({ category: c }: { category: HomeCategory }) {
  return (
    <li className="shrink-0">
      <Link
        to={c.to}
        draggable={false}
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
 * แถวการ์ดหมวดหมู่ — วนลูปไม่มีสุด (ลิสต์ซ้ำ 2 ชุด)
 * เลื่อนได้ 4 ทาง: auto-scroll · ลากด้วยเมาส์/นิ้ว · ล้อเมาส์/แทร็กแพด · ปุ่มลูกศร
 * ผู้ใช้เลื่อนเองเมื่อไหร่ auto-scroll หยุด แล้วกลับมาเล่นต่อหลังนิ่ง 1.5 วิ
 * prefers-reduced-motion → ไม่ auto-scroll (ยังลาก/กดลูกศรได้)
 */
export function CategoryRow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** ให้ animation ที่จบแล้วเรียกตัวเองรอบใหม่ได้ โดยไม่ต้องอ้างถึง startScroll ก่อนประกาศ */
  const restart = useRef<() => void>(() => {});
  const [halfWidth, setHalfWidth] = useState(0);

  // ความกว้างของชุดการ์ดแรก = จุดที่ต้องวนกลับ
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) setHalfWidth(el.scrollWidth / 2);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const stopScroll = useCallback(() => {
    animRef.current?.stop();
    animRef.current = null;
  }, []);

  /** เก็บ x ให้อยู่ใน (-halfWidth, 0] เสมอ — เลยขอบก็วนกลับอีกฝั่ง (ชุดซ้ำทำให้มองไม่เห็นรอยต่อ) */
  const wrap = useCallback(
    (v: number) => {
      if (halfWidth <= 0) return v;
      let n = v % halfWidth;
      if (n > 0) n -= halfWidth;
      return n;
    },
    [halfWidth],
  );

  const startScroll = useCallback(() => {
    if (reduce || halfWidth <= 0) return;
    stopScroll();
    const current = wrap(x.get());
    x.set(current);
    const remaining = halfWidth + current; // current เป็นลบ
    animRef.current = animate(x, -halfWidth, {
      duration: Math.max(remaining, 1) / SCROLL_SPEED,
      ease: 'linear',
      onComplete: () => {
        x.set(0);
        if (!isDragging.current && !isHovering.current) restart.current();
      },
    });
  }, [reduce, halfWidth, x, stopScroll, wrap]);

  useEffect(() => {
    restart.current = startScroll;
  }, [startScroll]);

  /** ผู้ใช้เลื่อนเอง: หยุด auto แล้วนัดกลับมาเล่นต่อ */
  const pauseThenResume = useCallback(() => {
    stopScroll();
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (!isDragging.current && !isHovering.current) startScroll();
    }, RESUME_DELAY);
  }, [stopScroll, startScroll]);

  /** เลื่อนไปทีละ delta px (ลบ = ไปทางขวา) พร้อม wrap */
  const nudge = useCallback(
    (delta: number, smooth: boolean) => {
      pauseThenResume();
      const target = wrap(x.get() + delta);
      // ถ้า wrap แล้วกระโดดข้ามขอบ ให้ set ทันทีแทน animate (กันวิ่งย้อนทั้งแถว)
      if (!smooth || Math.abs(target - x.get()) > halfWidth / 2) x.set(target);
      else animate(x, target, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
    },
    [pauseThenResume, wrap, x, halfWidth],
  );

  /** ล้อเมาส์แนวตั้ง → เลื่อนแนวนอน · แทร็กแพดปัดซ้ายขวาก็ใช้ได้ */
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    e.preventDefault();
    nudge(-delta, false);
  };

  useEffect(() => {
    startScroll();
    return () => {
      stopScroll();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [startScroll, stopScroll]);

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
            onClick={() => nudge(STEP, true)}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-text transition hover:border-gold hover:text-gold-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="เลื่อนไปทางขวา"
            onClick={() => nudge(-STEP, true)}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-text transition hover:border-gold hover:text-gold-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden overscroll-x-contain"
        onWheel={onWheel}
        onMouseEnter={() => {
          isHovering.current = true;
          stopScroll();
        }}
        onMouseLeave={() => {
          isHovering.current = false;
          if (!isDragging.current) startScroll();
        }}
      >
        <motion.ul
          ref={trackRef}
          className="flex w-max gap-4 pb-2"
          style={{ x, cursor: 'grab' }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          whileDrag={{ cursor: 'grabbing' }}
          onClickCapture={(e) => {
            // กันคลิกลิงก์ตอนกำลังลาก
            if (isDragging.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDragStart={() => {
            isDragging.current = true;
            stopScroll();
          }}
          onDrag={() => x.set(wrap(x.get()))}
          onDragEnd={() => {
            setTimeout(() => {
              isDragging.current = false;
            }, 0);
            x.set(wrap(x.get()));
            pauseThenResume();
          }}
        >
          {CATEGORIES.map((c) => (
            <CategoryCard key={`a-${c.key}`} category={c} />
          ))}
          {/* ชุดซ้ำเพื่อวนลูปไม่มีรอยต่อ */}
          {CATEGORIES.map((c) => (
            <CategoryCard key={`b-${c.key}`} category={c} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
