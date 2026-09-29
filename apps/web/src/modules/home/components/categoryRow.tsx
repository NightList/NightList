import { BeerStein, City, Door, ForkKnife, Martini, MoonStars, MusicNotes, Tree } from '@phosphor-icons/react';
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
];

const TONE: Record<HomeCategory['tone'], string> = {
  amber: 'from-[#ffd77a] via-[#e8963a] to-[#5b1f8a]',
  violet: 'from-[#2a0f45] via-[#6d1fb0] to-[#e04fa0]',
};

/** แถวการ์ดหมวดหมู่ (Figma: Card เบียร์ / Card Cocktail) — เลื่อนแนวนอน */
export function CategoryRow() {
  return (
    <section aria-labelledby="home-categories">
      <h2 id="home-categories" className="mb-4 px-4 text-xl font-semibold md:px-0">
        หมวดหมู่
      </h2>
      <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0">
        {CATEGORIES.map((c) => (
          <li key={c.key} className="snap-start">
            <Link
              to={c.to}
              className="group relative flex h-52 w-40 flex-col overflow-hidden rounded-2xl border border-white/10 !text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <div className={`relative flex flex-1 items-center justify-center bg-gradient-to-br ${TONE[c.tone]}`}>
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
        ))}
      </ul>
    </section>
  );
}
