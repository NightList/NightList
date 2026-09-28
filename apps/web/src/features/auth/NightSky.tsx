import { useMemo } from 'react';

/** PRNG แบบ seed เดียวกันทุกครั้ง → ดาวไม่กระโดดตอน re-render / SSR */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** ประกายสี่แฉก (แทนดาวสีฟ้าใน reference → ใช้ทองของ Midnight Gold) */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 0c.6 5.4 3.1 9.3 12 12-8.9 2.7-11.4 6.6-12 12-.6-5.4-3.1-9.3-12-12C8.9 9.3 11.4 5.4 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * พื้นหลังหน้า Auth: ท้องฟ้ากลางคืน + ดาวกระพริบ + ขอบฟ้าดาวเคราะห์เรืองแสงม่วง
 * ตกแต่งล้วน (aria-hidden) · เคารพ prefers-reduced-motion ผ่าน theme.css
 */
export function NightSky() {
  const stars = useMemo(() => {
    const rand = mulberry32(20260929);
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 70,
      r: rand() * 1.2 + 0.3,
      delay: rand() * 4,
      twinkle: rand() > 0.6,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* ไล่สีท้องฟ้า */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,var(--sky-top),var(--background)_70%)]" />

      {/* ดาว */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="var(--star)"
            className={s.twinkle ? 'animate-twinkle' : undefined}
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>

      {/* ขอบฟ้าดาวเคราะห์ */}
      <div className="absolute left-1/2 top-[62%] aspect-square w-[220vw] -translate-x-1/2 rounded-full border-t-2 border-(--horizon-rim) bg-background shadow-[0_-30px_120px_20px_var(--horizon-glow),inset_0_40px_80px_-20px_var(--horizon-glow)] lg:top-[58%] lg:w-[160vw]" />
      <div className="absolute left-1/2 top-[48%] h-[30vh] w-[90vw] -translate-x-1/2 rounded-full bg-(--horizon-glow) opacity-40 blur-3xl" />

      {/* ประกายทองลอย */}
      <Sparkle className="animate-float absolute left-[6%] top-[20%] h-7 w-7 text-gold drop-shadow-[0_0_12px_var(--gold)]" />
      <Sparkle className="animate-float absolute right-[10%] top-[18%] h-5 w-5 text-gold-highlight drop-shadow-[0_0_10px_var(--gold)] [animation-delay:1.2s]" />
      <Sparkle className="animate-float absolute right-[38%] top-[8%] hidden h-3 w-3 text-purple [animation-delay:2.1s] lg:block" />
    </div>
  );
}

export { Sparkle };
