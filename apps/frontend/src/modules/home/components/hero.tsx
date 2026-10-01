import { CaretDown, MagnifyingGlass, MapPin } from '@phosphor-icons/react';
import { DISTRICTS } from '@nightlist/mock';
import { Dropdown } from 'antd';
import { useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const HERE = 'ตำแหน่งปัจจุบัน';

/**
 * Hero (Figma: Main → Hero) — วิดีโอเมืองกลางคืนวนลูปเต็มจอ (poster = ภาพเดียวกับ Figma)
 * หัวข้อ "คืนนี้ไป | ร้านไหน | ดี" (ตัวกลางใหญ่สีทอง) + ช่องค้นหากระจก มีเลือกย่าน/ตำแหน่ง
 * prefers-reduced-motion → ภาพนิ่ง
 */
export function Hero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [area, setArea] = useState(HERE);

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[#07070d] md:min-h-[100svh]">
      {reduce ? (
        <img
          src="/images/home/hero-poster.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <video
          className="absolute inset-0 -z-10 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/home/hero-poster.jpg"
          aria-hidden
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center md:px-8">
        <h1 className="flex items-end justify-center gap-x-2 font-bold leading-none text-white md:gap-x-5">
          <span className="shrink-0 pb-[0.35em] text-xl drop-shadow sm:text-3xl md:text-5xl">คืนนี้ไป</span>
          <span className="bg-gradient-to-b from-[#ffe39a] via-gold to-[#b9832a] -mt-[0.3em] bg-clip-text pb-[0.1em] pt-[0.3em] text-[3.9rem] leading-[1.1] text-transparent sm:text-[5.5rem] drop-shadow-[0_4px_24px_rgba(232,182,76,0.35)] md:text-[9rem]">
            ร้านไหน
          </span>
          <span className="shrink-0 pb-[0.35em] text-xl drop-shadow sm:text-3xl md:text-5xl">ดี</span>
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base text-white/80 md:text-lg">
          ดูอันดับจากคนที่ไปจริง รู้ราคาต่อหัวก่อนออกจากบ้าน แล้วจองโต๊ะได้เลย
        </p>

        <form
          role="search"
          className="mt-8 flex w-full max-w-3xl items-center text-left gap-2 rounded-lg border border-white/15 bg-white/10 p-1.5 pl-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('q')?.toString().trim() ?? '';
            const sp = new URLSearchParams();
            if (q) sp.set('q', q);
            if (area !== HERE) sp.set('district', area);
            navigate(`/search${sp.size ? `?${sp}` : ''}`);
          }}
        >
          <MagnifyingGlass size={20} className="shrink-0 text-white/70" aria-hidden />
          <input
            name="q"
            aria-label="ค้นหาร้าน"
            placeholder="ค้นหาร้านที่โดนใจสำหรับคุณ"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-white outline-none placeholder:text-white/55"
          />
          <span className="hidden h-7 w-px bg-white/20 sm:block" aria-hidden />
          <Dropdown
            trigger={['click']}
            menu={{
              selectable: true,
              selectedKeys: [area],
              onClick: ({ key }) => setArea(key),
              items: [HERE, ...DISTRICTS].map((d) => ({ key: d, label: d })),
            }}
          >
            <button
              type="button"
              className="hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/85 transition-colors select-none hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold sm:flex"
            >
              <MapPin size={18} weight="fill" className="text-gold" />
              {area}
              <CaretDown size={14} />
            </button>
          </Dropdown>
          <button
            type="submit"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-on-gold transition select-none hover:bg-gold-highlight active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:px-7"
          >
            <MagnifyingGlass size={16} weight="bold" />
            ค้นหา
          </button>
        </form>
      </div>
    </section>
  );
}
