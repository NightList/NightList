import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { AboutHero } from './components/aboutHero';
import { ContactSection } from './components/contactSection';
import { TeamCarousel } from './components/teamCarousel';
import './about.css';

/**
 * /about (+ /contact เลื่อนลงไปส่วนติดต่อเรา) — Figma: เกี่ยวกับเรา
 * ภาพปะติดมือถือ + เกี่ยวกับเรา → ทีมงาน (โคราเซลหมุน) → ติดต่อเรา + NIGHTLIST ยักษ์ปิดท้าย (แทนฟุตเตอร์)
 * แก้ข้อความ/ทีมงาน/ช่องทางติดต่อ: ./utils/content.ts
 */
export function AboutPage() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/contact' && hash !== '#contact') return;
    // รอฟอนต์โหลดก่อน — ไม่งั้นตำแหน่งเลื่อนหลังข้อความเปลี่ยนฟอนต์
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return (
    <div className="relative isolate overflow-hidden bg-black pb-24 text-white md:pb-0">
      <div
        aria-hidden="true"
        className="about-bg absolute inset-x-0 top-0 -z-20 h-[min(1400px,110vw)] min-h-[720px]"
      />

      <AboutHero />

      <section aria-labelledby="team-title" className="relative mt-[clamp(48px,5vw,80px)]">
        <div
          aria-hidden="true"
          className="about-glow pointer-events-none absolute inset-x-0 -z-10 top-[-160px] h-[calc(100%+460px)] md:top-[-25.6vw] md:h-[max(100vw,1500px)]"
        />
        <h2
          id="team-title"
          className="font-kanit mb-[clamp(20px,2.6vw,44px)] text-center text-[clamp(44px,5.6vw,92px)] font-semibold leading-none"
        >
          ทีมงาน
        </h2>
        <TeamCarousel />
      </section>

      <ContactSection />
    </div>
  );
}
