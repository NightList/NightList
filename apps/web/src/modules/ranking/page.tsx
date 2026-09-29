import { CATEGORY_LABELS, DISTRICTS, tierList } from '@nightlist/mock';
import type { BarCategory, Tier } from '@nightlist/types';
import { TierStars } from '@nightlist/ui';
import { Empty, Segmented, Select } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import { BarCover } from '@/ui/components/barCard';
import { BarRating } from '@/ui/components/barRating';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';

const TIERS: Tier[] = ['S', 'A', 'B', 'C'];

/** /ranking — จัดอันดับแบ่งแถวตามดาว 5 → 1 (ภายในยังเป็น Tier S/A/B/C) */
export function RankingPage() {
  useDemo();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const category = (params.get('category') as BarCategory | null) ?? 'ALL';
  const district = params.get('district') ?? undefined;
  const tiers = tierList(category, district);
  const empty = TIERS.every((t) => tiers[t].length === 0);

  const set = (k: string, v?: string) => {
    const p = new URLSearchParams(params);
    if (v && v !== 'ALL') p.set(k, v);
    else p.delete(k);
    setParams(p, { replace: true });
  };

  return (
    <div>
      <PageHeader
        title="จัดอันดับร้านกลางคืน"
        subtitle="จัดอันดับจากรีวิวคนเช็กอินจริง · ความปลอดภัย · ความครบของข้อมูลราคา (จ่ายเงินเพิ่มดาวไม่ได้)"
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <Segmented
          value={category}
          onChange={(v) => set('category', String(v))}
          options={[
            { label: 'ทั้งหมด', value: 'ALL' },
            ...(['PUB_BAR', 'CHILL', 'RESTAURANT'] as const).map((c) => ({
              label: CATEGORY_LABELS[c],
              value: c,
            })),
          ]}
        />
        <Select
          allowClear
          placeholder="ทุกย่าน"
          value={district}
          onChange={(v) => set('district', v)}
          options={DISTRICTS.map((d) => ({ label: d, value: d }))}
          className="min-w-40"
        />
      </div>

      {empty ? (
        <Empty description="ยังไม่มีร้านในหมวด/ย่านนี้" />
      ) : (
        <div className="space-y-3">
          {TIERS.map((t, row) => (
            <motion.div
              key={t}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: row * 0.06, duration: 0.25 }}
              className="flex gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <TierStars tier={t} size="lg" label={t === 'C' ? '1–2 ดาว' : undefined} />
              <div className="flex flex-1 gap-3 overflow-x-auto pb-1">
                {tiers[t].length === 0 && (
                  <p className="self-center text-sm text-muted">ยังไม่มีร้านระดับนี้</p>
                )}
                {tiers[t].map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: row * 0.06 + i * 0.04 }}
                  >
                    <Link
                      to={`/bars/${b.slug}`}
                      className="block w-44 shrink-0 overflow-hidden rounded-xl border border-border !text-text hover:border-gold hover:shadow-glow"
                    >
                      <BarCover bar={b} className="h-24" />
                      <div className="p-2">
                        <p className="truncate text-sm font-semibold">{b.name}</p>
                        <p className="text-xs">
                          <BarRating bar={b} compact />
                        </p>
                        <p className="text-xs text-muted">{b.district}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-muted">
        ดาวคำนวณจากรีวิวของคนที่เช็กอินจริง · ร้านที่มีรีวิวน้อยกว่า 5 รีวิวยังไม่ได้ดาว ·
        โฆษณาไม่มีผลต่อดาว
      </p>
    </div>
  );
}
