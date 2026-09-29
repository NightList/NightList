import { listBars } from '@nightlist/mock';
import { Button } from 'antd';
import { Link } from 'react-router';
import { useDemo } from '@/hooks/useDemo';
import { BarCard } from '@/ui/components/barCard';
import { CategoryRow } from './components/categoryRow';
import { Hero } from './components/hero';

/** / — หน้าแรก (Figma: Main) */
export function HomePage() {
  useDemo();
  // ร้านโปรโมทขึ้นก่อน (มีป้าย "แนะนำ · โฆษณา" บนการ์ด) แล้วต่อด้วยร้านคะแนนสูงสุด
  const weekly = listBars().slice(0, 6);

  return (
    <>
      <Hero />
      <div className="space-y-14 px-4 py-10 md:py-14">
        <CategoryRow />

        <section aria-labelledby="home-weekly" className='max-w-7xl mx-auto'>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="home-weekly" className="text-xl font-semibold">
              ร้านแนะนำประจำสัปดาห์
            </h2>
            <Link to="/ranking" className="text-sm">
              ดูอันดับทั้งหมด
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weekly.map((b) => (
              <BarCard key={b.id} bar={b} />
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center">
          <div>
            <p className="font-semibold">เป็นเจ้าของร้าน?</p>
            <p className="text-sm text-muted">ลงร้านฟรี รับจองโต๊ะ และดูว่าลูกค้ามาจากไหน</p>
          </div>
          <Link to="/merchant/join">
            <Button shape="round">ลงทะเบียนร้าน</Button>
          </Link>
        </section>
      </div>
    </>
  );
}
