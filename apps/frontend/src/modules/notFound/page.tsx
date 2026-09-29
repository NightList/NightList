import { House, MagnifyingGlass } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

/**
 * 404 (Figma "404"): ภาพขวดวิสกี้ + แก้วบนบาร์ม่วงเต็มจอ · ข้อความชิดซ้าย
 * "PAGE NOT FOUND" ม่วง ตัวห่าง · "404" ทองตัว serif ใหญ่ · หัวข้อ + คำอธิบาย · ปุ่มม่วงกลับหน้าหลัก
 * มือถือ: ภาพเลื่อนไปทางขวา + ไล่เงาจากด้านล่าง ให้ข้อความอ่านออก
 */
export function NotFoundPage() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden bg-[#07050d] text-[#f5f1e8]">
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/notFound/bg-sm.webp" />
        <img
          src="/images/notFound/bg.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-10 size-full object-cover object-[72%_center] md:object-center"
        />
      </picture>
      {/* เงาซ้าย (desktop) / เงาล่าง (มือถือ) ให้ข้อความลอยบนพื้นมืด */}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#07050d] via-[#07050d]/70 to-[#07050d]/10 md:bg-linear-to-r md:from-[#07050d]/90 md:via-[#07050d]/40 md:to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-28 md:px-10 md:pb-0 md:pt-0">
        <div className="mt-auto flex max-w-xl flex-col items-center text-center max-md:pt-[34vh] md:w-[44%]">
          <motion.p
            {...rise(0)}
            className="font-display text-sm uppercase tracking-[0.35em] text-[#a36cf5] md:text-lg"
          >
            Page not found
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            aria-label="404"
            className="font-display text-[9rem] font-semibold leading-none text-gold drop-shadow-[0_8px_40px_rgba(232,182,76,0.25)] md:text-[14rem] lg:text-[18rem] lg:tracking-tight"
          >
            404
          </motion.h1>
          <motion.h2 {...rise(0.16)} className="mt-4 text-2xl font-bold md:text-4xl">
            ไม่พบหน้าที่คุณกำลังค้นหา
          </motion.h2>
          <motion.p {...rise(0.22)} className="mt-3 text-balance text-sm text-white/70 md:text-base">
            ขออภัย หน้าที่คุณต้องการอาจถูกย้ายหรือไม่อยู่ในระบบ
            <br className="hidden md:block" /> ลองกลับไปยังหน้าหลัก หรือค้นหาร้านที่อยากไปคืนนี้
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#a738f5] px-7 font-semibold !text-white shadow-[0_10px_30px_-10px_rgba(167,56,245,0.8)] transition hover:bg-[#b458f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <House weight="bold" /> กลับสู่หน้าหลัก
            </Link>
            <Link
              to="/search"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-6 font-semibold !text-white/90 backdrop-blur transition hover:border-gold hover:!text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MagnifyingGlass weight="bold" /> ค้นหาร้าน
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
