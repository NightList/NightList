import { CalendarCheck, CurrencyCircleDollar, MoonStars, ShieldCheck } from '@phosphor-icons/react';
import { ThemeToggle } from '@nightlist/ui';
import { Button, Flex, Typography } from 'antd';
import { Link, NavLink, Outlet } from 'react-router';
import { AgeGate } from '@/features/age-gate/AgeGate';
import { NightSky } from '@/features/auth/NightSky';

const FEATURES = [
  { icon: CurrencyCircleDollar, title: 'รู้ราคาก่อนไป', desc: 'ประเมินค่าใช้จ่ายต่อหัวก่อนจอง' },
  { icon: ShieldCheck, title: 'เช็กความปลอดภัย', desc: 'รปภ. · CCTV · ทางหนีไฟ ยืนยันโดยทีม' },
  { icon: CalendarCheck, title: 'จองโต๊ะในไม่กี่คลิก', desc: 'เช็กอินด้วย QR · แชร์ให้แก๊งได้ทันที' },
];

/**
 * Layout ของหน้า Auth (login / register / forgot / reset)
 * Desktop: แบ่งซ้าย (ภาพแบรนด์) ขวา (การ์ดฟอร์ม) · Mobile: การ์ดกลางจอ
 */
export function AuthLayout() {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-background text-text">
      <AgeGate />
      <NightSky />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 !text-text">
          <MoonStars size={26} weight="fill" className="text-gold" />
          <span className="font-display text-lg font-bold tracking-wide">
            NIGHT<span className="text-gold-text">LIST</span>
          </span>
        </Link>
        <nav className="hidden gap-5 text-sm md:flex" aria-label="เมนู">
          <NavLink to="/" className="!text-muted hover:!text-text">
            หน้าแรก
          </NavLink>
          <NavLink to="/ranking" className="!text-muted hover:!text-text">
            จัดอันดับ
          </NavLink>
          <NavLink to="/search" className="!text-muted hover:!text-text">
            ค้นหาร้าน
          </NavLink>
        </nav>
        <Flex align="center" gap={8} className="ml-auto">
          <ThemeToggle />
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'hidden' : '')}>
            <Button type="text">เข้าสู่ระบบ</Button>
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'hidden' : '')}>
            <Button shape="round" className="!border-gold !text-gold-text">
              สมัครสมาชิก
            </Button>
          </NavLink>
        </Flex>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-10 px-4 pb-12 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        {/* ซ้าย: แบรนด์ (desktop เท่านั้น) */}
        <section className="hidden lg:block" aria-label="เกี่ยวกับ NightList">
          <Typography.Text className="!text-sm !text-muted">
            จัดอันดับร้านกลางคืน · กรุงเทพฯ
          </Typography.Text>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[1.1] xl:text-7xl">
            คืนนี้ไป
            <br />
            <span className="bg-gradient-to-r from-(--title-from) to-(--title-to) bg-clip-text text-transparent">
              ที่ไหนดี?
            </span>
          </h1>
          <Typography.Paragraph className="mt-6 max-w-md !text-base !text-muted">
            คัดจากคนเช็กอินจริง ดูราคา ความปลอดภัย และความแน่นของร้าน ก่อนออกจากบ้าน
          </Typography.Paragraph>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card/60 text-gold-text backdrop-blur">
                  <f.icon size={22} weight="duotone" />
                </span>
                <span>
                  <span className="block font-semibold">{f.title}</span>
                  <span className="text-sm text-muted">{f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ขวา: ฟอร์ม */}
        <section className="flex justify-center lg:justify-end">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
