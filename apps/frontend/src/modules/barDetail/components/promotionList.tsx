import { Tag as PromoIcon } from '@phosphor-icons/react';
import type { BarPromotion } from '@/services/data';
import { InfoSection } from '@/ui/components/infoSection';
import { promoNote } from '@/ui/utils/promotion';

/** โปรโมชันที่เปิดอยู่ (เลือกได้ตอนจอง) — ไม่มีโปร = ไม่แสดง */
export function PromotionList({ promotions }: { promotions: BarPromotion[] }) {
  const active = promotions.filter((p) => p.active);
  if (!active.length) return null;
  return (
    <InfoSection icon={<PromoIcon />} title="โปรโมชัน (เลือกได้ตอนจอง)">
      <div className="grid gap-2 sm:grid-cols-2">
        {active.map((p) => (
          <div key={p.id} className="rounded-xl border border-gold/40 bg-gold/5 p-3">
            <p className="font-semibold">{p.title}</p>
            <p className="text-xs text-muted">{promoNote(p)}</p>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
