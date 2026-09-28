import {
  ArrowRight,
  Buildings,
  Martini,
  MusicNotes,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react';
import { CATEGORY_LABELS, listBars, tierList } from '@nightlist/mock';
import { TierBadge } from '@nightlist/ui';
import { Button } from 'antd';
import { Link } from 'react-router';
import { BarCard } from '@/features/bars/BarCard';
import { useDemo } from '@/shared/data/useDemo';

const CATS = [
  { key: 'PUB_BAR', icon: MusicNotes, desc: 'ดนตรี แดนซ์ ปาร์ตี้' },
  { key: 'CHILL', icon: Martini, desc: 'นั่งคุย บรรยากาศดี' },
  { key: 'RESTAURANT', icon: Buildings, desc: 'อาหารอร่อย มีเครื่องดื่ม' },
] as const;

export function HomePage() {
  useDemo();
  const promoted = listBars()
    .filter((b) => b.promoted)
    .slice(0, 3);
  const tiers = tierList();
  const top = [...tiers.S, ...tiers.A].slice(0, 6);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background via-hero-via to-card p-8 md:p-14">
        <p className="mb-2 text-sm text-muted">จัดอันดับร้านกลางคืน · คัดจากคนเช็กอินจริง</p>
        <h1 className="font-display text-4xl font-bold md:text-6xl">
          NIGHT
          <span className="bg-gradient-to-r from-(--title-from) to-(--title-to) bg-clip-text text-transparent">
            LIST
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          รู้ราคาก่อนไป เช็กความปลอดภัย ดูว่าร้านแน่นไหม แล้วจองโต๊ะได้ในไม่กี่คลิก
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/ranking">
            <Button
              type="primary"
              size="large"
              shape="round"
              icon={<ArrowRight />}
              iconPlacement="end"
            >
              ดูอันดับร้าน
            </Button>
          </Link>
          <Link to="/search">
            <Button size="large" shape="round">
              ค้นหาร้าน
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">ร้านแนะนำประจำสัปดาห์</h2>
          <span className="text-xs text-muted">พื้นที่โฆษณา</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promoted.map((b, i) => (
            <BarCard key={b.id} bar={b} index={i} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl">หมวดหมู่</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CATS.map((c) => (
            <Link
              key={c.key}
              to={`/ranking?category=${c.key}`}
              className="group rounded-2xl border border-border bg-card p-5 !text-text transition hover:border-gold hover:shadow-glow"
            >
              <c.icon size={32} weight="duotone" className="mb-3 text-gold-text" />
              <p className="text-lg font-semibold">{CATEGORY_LABELS[c.key]}</p>
              <p className="text-sm text-muted">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">
            <Sparkle weight="fill" className="mr-2 inline text-gold" />
            ท็อป Tier ตอนนี้
          </h2>
          <Link to="/ranking">ดูทั้งหมด →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((b) => (
            <Link
              key={b.id}
              to={`/bars/${b.slug}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 !text-text hover:border-gold"
            >
              {b.tier && <TierBadge tier={b.tier} />}
              <span className="flex-1 truncate font-medium">{b.name}</span>
              <span className="text-sm text-muted">{b.district}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-border bg-card p-8 md:grid-cols-3">
        {[
          {
            icon: UsersThree,
            t: 'คะแนนจากคนที่ไปจริง',
            d: 'รีวิวได้เฉพาะคนที่เช็กอินผ่าน NightList',
          },
          {
            icon: Sparkle,
            t: 'ราคาโปร่งใส',
            d: 'ประเมินค่าใช้จ่ายรวม service charge + VAT ก่อนจอง',
          },
          { icon: Buildings, t: 'ความปลอดภัยชัดเจน', d: 'บอกว่าร้านไหนมีมาตรการอะไร ยืนยันโดยทีม' },
        ].map((f) => (
          <div key={f.t}>
            <f.icon size={28} weight="duotone" className="mb-2 text-purple" />
            <p className="font-semibold">{f.t}</p>
            <p className="text-sm text-muted">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
