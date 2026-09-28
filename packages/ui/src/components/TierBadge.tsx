import type { Tier } from '@nightlist/types';
import { tierColors } from '../tokens';

export interface TierBadgeProps {
  tier: Tier;
  size?: 'sm' | 'lg';
}

/** ป้าย Tier S/A/B/C */
export function TierBadge({ tier, size = 'sm' }: TierBadgeProps) {
  const c = tierColors[tier];
  const lg = size === 'lg';
  return (
    <span
      className={
        lg
          ? 'inline-flex h-24 w-20 flex-col items-center justify-center rounded-xl'
          : 'inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-sm font-bold'
      }
      style={{ background: c.bg, color: c.fg }}
      aria-label={`Tier ${tier} — ${c.label}`}
    >
      <span className={lg ? 'font-serif text-4xl font-bold leading-none' : undefined}>{tier}</span>
      {lg && <span className="mt-1 text-xs">{c.label}</span>}
    </span>
  );
}
