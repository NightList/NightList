import type { RankedBar } from '@nightlist/mock';
import { useRef } from 'react';
import { Link } from 'react-router';
import { barImage } from '@/ui/utils/barImage';
import { EASE_OUT, MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../utils/gsap';
import { RatingBadge } from './ratingBadge';

/** อันดับ 4–10 — แถวเลื่อนขึ้นทีละแถวตอนเข้าจอ (ScrollTrigger.batch, stagger 60ms, ครั้งเดียว) */
export function RankList({ rows }: { rows: RankedBar[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set('[data-rank-row]', { opacity: 0, y: 24 });
        ScrollTrigger.batch('[data-rank-row]', {
          start: 'top 92%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT, stagger: 0.06 }),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [rows.map((b) => b.id).join()], revertOnUpdate: true },
  );

  return (
    <ol ref={root} className="mx-auto flex max-w-2xl flex-col gap-3">
      {rows.map((b) => (
        <li key={b.id} data-rank-row>
          <Link
            to={`/bars/${b.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-text! transition-colors duration-150 active:bg-surface [@media(hover:hover)_and_(pointer:fine)]:hover:border-gold/60"
          >
            <span className="w-6 text-center text-base font-bold tabular-nums text-muted">
              {b.rank}
            </span>
            <img
              src={barImage(b)}
              alt=""
              loading="lazy"
              className="size-10 shrink-0 rounded-lg object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{b.name}</span>
              <span className="block text-xs text-muted">{b.district}</span>
            </span>
            <span className="shrink-0 text-right text-xs text-muted">
              <span className="block text-sm font-semibold tabular-nums text-text">
                {b.votes.toLocaleString('th-TH')}
              </span>
              โหวต
            </span>
            <RatingBadge rating={b.rating} />
          </Link>
        </li>
      ))}
    </ol>
  );
}
