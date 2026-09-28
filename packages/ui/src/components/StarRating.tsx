import { Star } from '@phosphor-icons/react';

export interface StarRatingProps {
  /** คะแนน 0–5 (รองรับทศนิยม) */
  value: number;
  size?: number;
  /** แสดงตัวเลขคะแนนต่อท้าย */
  showValue?: boolean;
  reviewCount?: number;
}

/** ดาวคะแนน — ใช้ Phosphor <Star /> (fill = ได้คะแนน, regular = ว่าง) */
export function StarRating({ value, size = 16, showValue = true, reviewCount }: StarRatingProps) {
  const full = Math.round(value);
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`คะแนน ${value.toFixed(1)} จาก 5`}
    >
      <span className="inline-flex text-(--gold-text)" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            weight={i <= full ? 'fill' : 'regular'}
            className={i <= full ? undefined : 'text-(--border)'}
          />
        ))}
      </span>
      {showValue && (
        <span className="font-semibold text-(--gold-text)">{value.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-(--muted)">({reviewCount.toLocaleString('th-TH')})</span>
      )}
    </span>
  );
}
