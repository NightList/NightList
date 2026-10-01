import { ArrowRight } from '@phosphor-icons/react';
import { listBars } from '@/services/data';
import { Link } from 'react-router';
import { useDemo } from '@/hooks/useDemo';
import { CategoryRow } from './components/categoryRow';
import { Hero } from './components/hero';
import { Newsletter } from './components/newsletter';
import { WeeklyBarCard } from './components/weeklyBarCard';

/** / — หน้าแรก (Figma: Main) Hero → หมวดหมู่ → ร้านประจำสัปดาห์ → สมัครข่าวสาร (ฟุตเตอร์อยู่ใน MainLayout) */
export function HomePage() {
  useDemo();
  // ร้านโปรโมทขึ้นก่อน (มีป้าย "แนะนำ") แล้วต่อด้วยร้านคะแนนสูงสุด
  const weekly = listBars().slice(0, 6);

  return (
    <>
      <Hero />
      <div className="space-y-16 py-10 md:space-y-24 md:py-14">
        <CategoryRow />

        <section aria-labelledby="home-weekly" className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="home-weekly" className="text-2xl font-bold md:text-3xl">
              ร้านอาหารประจำสัปดาห์
            </h2>
            <Link
              to="/ranking"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium !text-purple hover:!text-purple/80"
            >
              ดูทั้งหมด <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {weekly.map((b) => (
              <WeeklyBarCard key={b.id} bar={b} />
            ))}
          </div>
        </section>

        <Newsletter />
      </div>
    </>
  );
}
