import { ArrowRight, MapPin } from '@phosphor-icons/react';
import { CATEGORY_LABELS, safetyScore, type BarWithTier } from '@nightlist/mock';
import { StarRating, TierBadge } from '@nightlist/ui';
import { Button, Card, Tag } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import { baht } from '@/shared/lib/format';
import { CrowdBadge } from './CrowdBadge';
import { FavoriteButton } from './FavoriteButton';

export function BarCover({
  bar,
  className = 'aspect-video',
}: {
  bar: BarWithTier;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bar.cover }}>
      <span className="absolute bottom-3 left-4 font-display text-2xl font-bold text-white/90 drop-shadow">
        {bar.name}
      </span>
    </div>
  );
}

export function BarCard({ bar, index = 0 }: { bar: BarWithTier; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.25 }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="h-full"
    >
      <Link to={`/bars/${bar.slug}`} className="block h-full !text-text">
        <Card
          hoverable
          className="h-full overflow-hidden transition-shadow hover:shadow-glow"
          classNames={{ body: '!p-4' }}
          cover={
            <div className="relative">
              <BarCover bar={bar} />
              <FavoriteButton barId={bar.id} className="!absolute right-3 top-3" />
              {bar.promoted && (
                <span className="absolute left-3 top-3 rounded-full border border-gold bg-background/70 px-2 py-0.5 text-xs text-gold-text backdrop-blur">
                  แนะนำ · โฆษณา
                </span>
              )}
            </div>
          }
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {bar.tier ? <TierBadge tier={bar.tier} /> : <Tag color="purple">ร้านใหม่</Tag>}
            <Tag className="!m-0">{CATEGORY_LABELS[bar.category]}</Tag>
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <MapPin size={14} /> {bar.district}
            </span>
          </div>
          <h3 className="mb-1 text-lg font-semibold">{bar.name}</h3>
          {bar.isNew ? (
            <p className="text-sm text-muted">ยังมีรีวิวไม่พอให้ดาว</p>
          ) : (
            <StarRating value={bar.rating} reviewCount={bar.reviewCount} />
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted">
              ~{baht(bar.avgPerPerson)}/คน · ปลอดภัย {safetyScore(bar)}
            </span>
            <CrowdBadge crowd={bar.crowd} updatedAt={bar.crowdUpdatedAt} />
          </div>
          <Button shape="round" className="mt-4" icon={<ArrowRight />} iconPlacement="end">
            ดูรายละเอียด
          </Button>
        </Card>
      </Link>
    </motion.div>
  );
}
