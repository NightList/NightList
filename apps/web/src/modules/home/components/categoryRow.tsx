import { BeerStein, City, Door, ForkKnife, Gift, Martini, MoonStars, MusicNotes, Tree } from '@phosphor-icons/react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { HomeCategory } from '../type/category';

const CATEGORIES: HomeCategory[] = [
  { key: 'pub', title: 'ผับ / บาร์', subtitle: 'แดนซ์ ปาร์ตี้', to: '/ranking?category=PUB_BAR', icon: BeerStein, tone: 'amber' },
  { key: 'chill', title: 'นั่งชิล', subtitle: 'คุยกันยาว ๆ', to: '/ranking?category=CHILL', icon: Martini, tone: 'violet' },
  { key: 'food', title: 'ร้านอาหาร', subtitle: 'กินจริงจัง', to: '/ranking?category=RESTAURANT', icon: ForkKnife, tone: 'amber' },
  { key: 'live', title: 'ดนตรีสด', subtitle: 'วงเล่นทุกคืน', to: '/search?style=Live%20Music', icon: MusicNotes, tone: 'violet' },
  { key: 'rooftop', title: 'Rooftop', subtitle: 'วิวเมือง', to: '/search?style=Rooftop', icon: City, tone: 'amber' },
  { key: 'quiet', title: 'ร้านเงียบ', subtitle: 'คุยงานได้', to: '/search?style=Quiet', icon: MoonStars, tone: 'violet' },
  { key: 'outdoor', title: 'Outdoor', subtitle: 'นั่งรับลม', to: '/search?style=Outdoor', icon: Tree, tone: 'amber' },
  { key: 'private', title: 'ห้องส่วนตัว', subtitle: 'มากันเป็นกลุ่ม', to: '/search?style=Private%20Room', icon: Door, tone: 'violet' },
  { key: 'promotion', title: 'ร้านมีโปร', subtitle: 'โปรโมชั่นเด็ด', to: '/search?style=Promotion', icon: Gift, tone: 'violet' },
  { key: 'promotion', title: 'ร้านมีโปร', subtitle: 'โปรโมชั่นเด็ด', to: '/search?style=Promotion', icon: Gift, tone: 'violet' },
];

function CategoryCard({ category: c }: { category: HomeCategory }) {
  return (
    <li className="shrink-0">
      <Link
        to={c.to}
        draggable={false}
        className="group relative flex h-52 w-40 flex-col overflow-hidden rounded-2xl border border-white/10 !text-white select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <div className={`relative flex flex-1 items-center justify-center bg-pink-400`}>
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

/** px/s — ยิ่งสูงยิ่งเร็ว */
const SCROLL_SPEED = 40;

/** แถวการ์ดหมวดหมู่ — auto-scroll + drag slide, หยุดตอน hover */
export function CategoryRow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const [halfWidth, setHalfWidth] = useState(0);

  // วัดความกว้างครึ่งหนึ่ง (= ชุดการ์ดแรก) สำหรับ seamless loop
  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      setHalfWidth(el.scrollWidth / 2);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const stopScroll = useCallback(() => {
    animRef.current?.stop();
    animRef.current = null;
  }, []);

  const startScroll = useCallback(() => {
    if (reduce || halfWidth <= 0) return;
    stopScroll();

    // Clamp x เข้า range ที่ถูกต้อง
    const current = Math.max(-halfWidth, Math.min(0, x.get()));
    x.set(current);

    // ระยะทางที่เหลือจนถึงจุด loop
    const remaining = halfWidth + current; // current เป็นลบ
    if (remaining < 1) {
      x.set(0);
      startScroll();
      return;
    }

    animRef.current = animate(x, -halfWidth, {
      duration: remaining / SCROLL_SPEED,
      ease: 'linear',
      onComplete: () => {
        // snap กลับจุดเริ่มต้น (seamless เพราะลิสต์ซ้ำ)
        x.set(0);
        if (!isDragging.current && !isHovering.current) {
          startScroll();
        }
      },
    });
  }, [reduce, halfWidth, x, stopScroll]);

  // เริ่ม auto-scroll ตอน mount
  useEffect(() => {
    startScroll();
    return () => stopScroll();
  }, [startScroll, stopScroll]);

  return (
    <section aria-labelledby="home-categories">
      <h2 id="home-categories" className="mx-auto max-w-7xl mb-4 px-4 text-xl font-semibold md:px-0">
        หมวดหมู่
      </h2>

      <div
        className="overflow-hidden"
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
          style={{ x, cursor: reduce ? 'default' : 'grab' }}
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: -halfWidth, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          whileDrag={{ cursor: 'grabbing' }}
          /* ป้องกัน link click ระหว่าง drag */
          onClickCapture={(e) => {
            if (isDragging.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDragStart={() => {
            isDragging.current = true;
            stopScroll();
          }}
          onDragEnd={() => {
            // ปล่อย flag หลัง click event fire
            requestAnimationFrame(() => {
              isDragging.current = false;
            });
            // รอ bounce settle ก่อน resume auto-scroll
            setTimeout(() => {
              if (!isHovering.current) startScroll();
            }, 400);
          }}
        >
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={`a-${i}`} category={c} />
          ))}
          {/* ชุดซ้ำเพื่อ seamless loop */}
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={`b-${i}`} category={c} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
