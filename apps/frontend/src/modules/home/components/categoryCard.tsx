import { Link } from 'react-router';
import type { HomeCategory } from '../type/category';
import { CATEGORY_TEXT_COLORS } from '../utils/categories';

/** การ์ดหมวดหมู่ 1 ใบ (Figma: หมวดหมู่) — รูปเต็มการ์ด ไล่สีม่วงจากล่าง · `hidden` = ชุดที่ซ้ำไว้วนลูป (ซ่อนจากผู้อ่านหน้าจอ) */
export function CategoryCard({ category: c, hidden }: { category: HomeCategory; hidden?: boolean }) {
  return (
    <li className="shrink-0" aria-hidden={hidden || undefined}>
      <Link
        to={c.to}
        draggable={false}
        tabIndex={hidden ? -1 : undefined}
        className="group relative flex h-[172px] w-[132px] md:h-[200px] md:w-[150px] flex-col justify-end overflow-hidden rounded-[20px] bg-card select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#A738F5] via-[#FFFFFF]/0 via-35% to-transparent to-65%" />
        <div className="relative px-3 pb-3">
          <p
            className="text-[15px] font-bold leading-tight"
            style={{ color: CATEGORY_TEXT_COLORS[c.key] }}
          >
            {c.title}
          </p>
          <p className="text-xs opacity-85 text-white">{c.subtitle}</p>
        </div>
      </Link>
    </li>
  );
}
