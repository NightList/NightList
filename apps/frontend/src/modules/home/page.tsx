import { listBars } from '@/services/data';
import { SectionHeader } from '@/ui/components/sectionHeader';
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
      <div className="relative isolate overflow-hidden py-10 md:py-14">
        <div
          className="absolute inset-0 z-0 bg-[url(/images/home/base1-blur.webp)] bg-cover bg-center after:bg-black/60
               after:absolute after:inset-0 after:bg-linear-to-b after:from-black after:via-transparent after:to-gray-950"
          aria-hidden="true"
        />

        {/* ดันเนื้อหาหลักให้อยู่เหนือน้ำด้วย z-10 */}
        <div className="relative z-10 space-y-16 md:space-y-24">
          <CategoryRow />

          <section aria-labelledby="home-weekly" className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeader id="home-weekly" title="ร้านอาหารประจำสัปดาห์" to="/ranking" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {weekly.map((b) => (
                <WeeklyBarCard key={b.id} bar={b} />
              ))}
            </div>
          </section>

          <Newsletter />
        </div>
      </div>
    </>
  );
}
