import { motion } from 'motion/react';
import { SectionHeader } from '@/ui/components/sectionHeader';
import { useMarquee } from '../hooks/useMarquee';
import { CATEGORIES } from '../utils/categories';
import { CategoryCard } from './categoryCard';

/** แถวการ์ดหมวดหมู่ (Figma: หมวดหมู่) — วนลูปเอง · ล้อเมาส์/ลากได้ (logic อยู่ใน useMarquee) */
export function CategoryRow() {
  const { copies, viewportProps, trackProps } = useMarquee(CATEGORIES.length);

  return (
    <section aria-labelledby="home-categories">
      <SectionHeader id="home-categories" title="หมวดหมู่" to="/search" className="mx-auto max-w-7xl px-4 md:px-8" />
      <div {...viewportProps} className="overflow-hidden overscroll-x-contain">
        <motion.ul {...trackProps} className="flex w-max touch-pan-y gap-4 pb-2 will-change-transform">
          {Array.from({ length: copies }, (_, i) =>
            CATEGORIES.map((c) => <CategoryCard key={`${i}-${c.key}`} category={c} hidden={i > 0} />),
          )}
        </motion.ul>
      </div>
    </section>
  );
}
