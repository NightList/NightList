import { ArrowRight } from '@phosphor-icons/react';
import { StarRating, TierBadge } from '@nightlist/ui';
import { scoreToStars, starsToTier } from '@nightlist/utils';
import { Button, Card, Tag } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

/** ข้อมูลตัวอย่าง (ชื่อสมมติ) — แทนที่ด้วยข้อมูลจาก Supabase */
const DEMO_BARS = [
  { slug: 'moonlit-cellar', name: 'Moonlit Cellar', district: 'ทองหล่อ', score: 94, rating: 4.9, reviews: 1204 },
  { slug: 'velvet-hour', name: 'Velvet Hour', district: 'อารีย์', score: 81, rating: 4.5, reviews: 612 },
  { slug: 'amber-alley', name: 'Amber Alley', district: 'เอกมัย', score: 67, rating: 4.1, reviews: 398 },
];

export function HomePage() {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background via-hero-via to-card p-8 md:p-14">
        <p className="mb-2 text-sm text-muted">จัดอันดับร้านกลางคืน · คัดจากคนเช็กอินจริง</p>
        <h1 className="font-display text-4xl font-bold md:text-6xl">
          NIGHT<span className="bg-gradient-to-r from-(--title-from) to-(--title-to) bg-clip-text text-transparent">LIST</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          รู้ราคาก่อนไป เช็กความปลอดภัย ดูว่าร้านแน่นไหม แล้วจองโต๊ะได้ในไม่กี่คลิก
        </p>
        <Link to="/ranking">
          <Button type="primary" size="large" shape="round" className="mt-6" icon={<ArrowRight />} iconPlacement="end">
            ดูอันดับร้าน
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl">ร้านแนะนำประจำสัปดาห์</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_BARS.map((bar, i) => {
            const tier = starsToTier(scoreToStars(bar.score));
            return (
              <motion.div
                key={bar.slug}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                whileHover={reduce ? undefined : { y: -4 }}
              >
                <Card
                  hoverable
                  className="transition-shadow hover:shadow-glow"
                  cover={<div className="aspect-video bg-gradient-to-br from-purple/40 to-gold/20" />}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <TierBadge tier={tier} />
                    <Tag>{bar.district}</Tag>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{bar.name}</h3>
                  <StarRating value={bar.rating} reviewCount={bar.reviews} />
                  <Link to={`/bars/${bar.slug}`} className="mt-4 block">
                    <Button shape="round" icon={<ArrowRight />} iconPlacement="end">
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
