import type { RankedBar } from '@nightlist/mock';
import { useRef } from 'react';
import { Link } from 'react-router';
import { barImage } from '@/ui/utils/barImage';
import { EASE_OUT, MOTION_OK, MOTION_REDUCE, gsap, useGSAP } from '../utils/gsap';

const PLACE = [
  { label: 'ที่ 1', color: 'text-gold', ring: 'ring-gold/70' },
  { label: 'ที่ 2', color: 'text-[#d6d9e0]', ring: 'ring-[#d6d9e0]/60' },
  { label: 'ที่ 3', color: 'text-[#c98a5a]', ring: 'ring-[#c98a5a]/60' },
] as const;

/** ลำดับบนจอ: ที่ 2 · ที่ 1 · ที่ 3 · มุมเอียงและระยะตอนกางเต็ม (Figma) */
const SLOTS = [
  { idx: 1, rotate: -9, x: -78, y: 5 },
  { idx: 0, rotate: 0, x: 0, y: 0 },
  { idx: 2, rotate: 9, x: 78, y: 5 },
] as const;

function PodiumCard({ bar, place }: { bar: RankedBar; place: 0 | 1 | 2 }) {
  const p = PLACE[place];
  return (
    <Link
      to={`/bars/${bar.slug}`}
      aria-label={`${p.label} ${bar.name} ${bar.votes} โหวต`}
      className={`group relative block overflow-hidden rounded-2xl border-[5px] border-[#d9d9de]/90 bg-card shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)] ring-1 ${p.ring} ${place === 0 ? 'h-56 w-36 sm:h-80 sm:w-56 lg:h-96 lg:w-64' : 'h-48 w-32 sm:h-72 sm:w-52 lg:h-80 lg:w-60'}`}
    >
      <img
        src={barImage(bar)}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/10 to-black/75" />
      <div className="relative flex h-full flex-col items-center justify-between p-3 text-center text-white">
        <div className="leading-none">
          <span
            data-votes={bar.votes}
            className="block font-display text-4xl font-bold tabular-nums drop-shadow sm:text-6xl"
          >
            {bar.votes}
          </span>
          <span className="text-sm font-semibold text-white/85">โหวต</span>
        </div>
        <div className="w-full">
          <p className="truncate text-sm font-semibold sm:text-base">{bar.name}</p>
          <p className="truncate text-xs text-white/70">
            {bar.district} · ★ {bar.rating.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * แท่นรางวัล 3 อันดับ (Carousel dynamics)
 * เลื่อนมาถึง → การ์ดที่ซ้อนกันอยู่กางออกเป็นพัด (scrub ตามการเลื่อน) + ตัวเลขโหวตนับขึ้นครั้งเดียว
 * เปลี่ยนสัปดาห์/เดือน (key ใหม่) → เล่นใหม่
 */
export function Podium({ top3 }: { top3: RankedBar[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-podium-card]');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 30%', scrub: 0.8 },
        });
        cards.forEach((el) => {
          tl.fromTo(
            el,
            { xPercent: 0, yPercent: 12, rotation: 0, opacity: 0.6, scale: 0.92 },
            {
              xPercent: Number(el.dataset.x),
              yPercent: Number(el.dataset.y),
              rotation: Number(el.dataset.rotate),
              opacity: 1,
              scale: 1,
              ease: EASE_OUT,
            },
            0,
          );
        });
        tl.from('[data-podium-label]', { yPercent: 60, opacity: 0, stagger: 0.08, ease: EASE_OUT }, 0.2);

        // ตัวเลขโหวตนับขึ้น (ครั้งเดียว ไม่ผูกกับ scrub — ตัวเลขที่คนอ่านต้องนิ่ง)
        gsap.utils.toArray<HTMLElement>('[data-votes]').forEach((el) => {
          const target = Number(el.dataset.votes);
          const n = { v: Math.round(target * 0.6) };
          gsap.to(n, {
            v: target,
            duration: 1.1,
            ease: EASE_OUT,
            scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(n.v));
            },
          });
        });
      });
      // reduced motion: กางไว้เลย ไม่มีการเคลื่อนที่ แค่จางเข้า
      mm.add(MOTION_REDUCE, () => {
        gsap.utils.toArray<HTMLElement>('[data-podium-card]').forEach((el) =>
          gsap.set(el, {
            xPercent: Number(el.dataset.x),
            yPercent: Number(el.dataset.y),
            rotation: Number(el.dataset.rotate),
          }),
        );
        gsap.from('[data-podium-card]', { opacity: 0, duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [top3.map((b) => b.id).join()], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="relative mx-auto flex h-[19rem] max-w-4xl items-end justify-center sm:h-[28rem] lg:h-[32rem]">
      {SLOTS.map(({ idx, rotate, x, y }) => {
        const bar = top3[idx];
        if (!bar) return null;
        const place = idx as 0 | 1 | 2;
        return (
          <div
            key={bar.id}
            data-podium-card
            data-rotate={rotate}
            data-x={x}
            data-y={y}
            className={`absolute bottom-0 flex flex-col items-center ${place === 0 ? 'z-10' : 'z-0'}`}
            style={{ transformOrigin: '50% 100%' }}
          >
            <p
              data-podium-label
              className={`mb-2 text-2xl font-bold sm:text-4xl ${PLACE[place].color}`}
            >
              {PLACE[place].label}
            </p>
            <PodiumCard bar={bar} place={place} />
          </div>
        );
      })}
    </div>
  );
}
