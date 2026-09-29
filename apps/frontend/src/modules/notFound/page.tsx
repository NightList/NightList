import { House, MagnifyingGlass } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

/**
 * 404 (Figma "404"): ภาพขวดวิสกี้ + แก้วบนบาร์ม่วงเต็มจอ · ข้อความชิดซ้าย
 * "PAGE NOT FOUND" ม่วง ตัวห่าง · "404" ทองตัว serif ใหญ่ · หัวข้อ + คำอธิบาย · ปุ่มม่วงกลับหน้าหลัก
 * มือถือ: ภาพเต็มจอ (svh) · ข้อความอยู่กึ่งกลางระหว่าง navbar กับแถบเมนูล่าง (+ safe area) บนเงามืดวงรี ไม่เหลือพื้นว่าง
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
    <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-[#07050d] pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-24 text-[#f5f1e8] md:pb-0 md:pt-0">
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_58%,rgba(7,5,13,0.92)_0%,rgba(7,5,13,0.7)_45%,rgba(7,5,13,0.35)_100%)] md:bg-none md:bg-linear-to-r md:from-[#07050d]/90 md:from-0% md:via-[#07050d]/40 md:via-50% md:to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center md:mx-0 md:w-[44%]">
          <motion.p
            {...rise(0)}
            className="font-display text-xs uppercase tracking-[0.35em] text-[#a36cf5] md:text-lg"
          >
            Page not found
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            aria-label="404"
            className="font-sans text-[7.5rem] font-light leading-[0.9] text-gold drop-shadow-[0_8px_40px_rgba(232,182,76,0.25)] md:text-[14rem] lg:text-[18rem] lg:tracking-tight"
          >
            404
          </motion.h1>
          <motion.h2 {...rise(0.16)} className="mt-3 text-[1.625rem] font-bold leading-tight md:mt-4 md:text-4xl">
            ไม่พบหน้าที่คุณกำลังค้นหา
          </motion.h2>
          <motion.p {...rise(0.22)} className="mt-2 text-balance text-sm leading-relaxed text-white/70 md:mt-3 md:text-base">
            ขออภัย หน้าที่คุณต้องการอาจถูกย้ายหรือไม่อยู่ในระบบ
            <br className="hidden md:block" /> ลองกลับไปยังหน้าหลัก หรือค้นหาร้านที่อยากไปคืนนี้
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 md:mt-8 md:flex md:w-auto md:max-w-none md:justify-center">
            <Link
              to="/"
              className="inline-flex h-12 touch-manipulation select-none items-center justify-center gap-2 rounded-xl bg-[#a738f5] px-5 md:px-7 font-semibold !text-white shadow-[0_10px_30px_-10px_rgba(167,56,245,0.8)] transition active:scale-[0.97] hover:bg-[#b458f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <House weight="bold" /> กลับสู่หน้าหลัก
            </Link>
            <Link
              to="/search"
              className="inline-flex h-12 touch-manipulation select-none items-center justify-center gap-2 rounded-xl border border-white/25 bg-black/20 px-5 md:px-6 font-semibold !text-white/90 backdrop-blur transition active:scale-[0.97] hover:border-gold hover:!text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MagnifyingGlass weight="bold" /> ค้นหาร้าน
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
