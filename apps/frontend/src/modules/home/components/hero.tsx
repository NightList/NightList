import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input } from 'antd';
import { useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router';

/**
 * Hero — วิดีโอเมืองกลางคืนวนลูปเต็มจอ (public/videos/hero.mp4 — H.264 720p ไฟล์เดียว ~0.8MB)
 * ข้อความวางมุมล่างซ้าย ไล่เฉดลงสีพื้นหลัง ให้ต่อกับเนื้อหาด้านล่างแบบไร้รอยต่อ
 * prefers-reduced-motion → แสดงภาพนิ่ง (poster) แทนวิดีโอ
 */
export function Hero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#07070d]">
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
      {/* เงาดำให้อ่านข้อความออก + ขอบล่างกลืนเข้าพื้นหลังหน้า (ทั้ง dark/light) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute inset-y-0 left-0 -z-10 w-2/3 bg-gradient-to-r from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 md:pb-20">
        <h1 className="max-w-xl text-4xl font-bold leading-tight text-white drop-shadow md:text-6xl">
          คืนนี้ไปร้านไหนดี
        </h1>
        <p className="mt-3 max-w-md text-balance text-base text-white/85 md:text-lg">
          ดูอันดับจากคนที่ไปจริง รู้ราคาต่อหัวก่อนออกจากบ้าน แล้วจองโต๊ะได้เลย
        </p>
        <form
          role="search"
          className="mt-7 max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('q')?.toString().trim() ?? '';
            navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
          }}
        >
          <Input
            name="q"
            size="large"
            aria-label="ค้นหาร้าน"
            placeholder="ชื่อร้าน ย่าน หรือสไตล์ เช่น ทองหล่อ, rooftop"
            prefix={<MagnifyingGlass size={20} className="text-muted" />}
            className="!h-14 !rounded-full !border-white/15 !bg-black/45 !pl-5 !text-white !backdrop-blur-md [&_input]:!text-white [&_input::placeholder]:!text-white/55"
            suffix={
              <button
                type="submit"
                className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-on-gold transition hover:bg-gold-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                ค้นหา
              </button>
            }
          />
        </form>
      </div>
    </section>
  );
}
