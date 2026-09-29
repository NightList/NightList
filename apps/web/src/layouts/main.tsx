import { CalendarCheck, Crown, House, MagnifyingGlass, User } from '@phosphor-icons/react';
import { Layout } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';
import { useDemo } from '@/hooks/useDemo';
import { useAuth } from '@/services/auth';
import { AgeGate } from '@/ui/components/ageGate';
import { DemoBanner } from '@/ui/components/demoBanner';
import { BottomIsland, Navbar, type NavItem } from '@/ui/components/navbar';

const NAV: NavItem[] = [
  { to: '/', label: 'หน้าแรก', icon: House, end: true },
  { to: '/ranking', label: 'จัดอันดับ', icon: Crown },
  { to: '/search', label: 'ค้นหา', icon: MagnifyingGlass },
  { to: '/bookings', label: 'การจอง', icon: CalendarCheck },
];

/**
 * Layout หลักฝั่งลูกค้า
 * - Navbar แคปซูลลอย: หน้าแรกลอยทับ Hero (วิดีโอ) · หน้าอื่นเว้นที่ด้านบน
 * - หน้าแรกจัด container เอง (Hero เต็มจอ) · หน้าอื่นอยู่ใน max-w-7xl
 */
export function MainLayout() {
  useDemo();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isShop = user?.role === 'MERCHANT' || user?.role === 'STAFF';
  const items: NavItem[] = [
    ...NAV,
    ...(isShop ? [{ to: '/merchant', label: 'ร้านของฉัน' }] : []),
  ];

  return (
    <Layout className="min-h-dvh !bg-background">
      <AgeGate />
      <DemoBanner />
      <header className="sticky top-0 z-40 h-0">
        <div className="flex justify-center px-3 pt-3 md:pt-4">
          <Navbar items={items} />
        </div>
      </header>

      {isHome ? (
        <main className="flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
      ) : (
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-24 md:pb-10">
          <Outlet />
        </main>
      )}

      <footer className="relative hidden overflow-hidden border-t border-border md:block">
        <img
          src="/images/home/city-strip.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/20" />
        <div className="relative py-14 text-center text-sm text-muted">
          <nav className="mb-3 flex justify-center gap-6">
            <Link to="/about">เกี่ยวกับเรา</Link>
            <Link to="/terms">เงื่อนไขการใช้งาน</Link>
            <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/cookies">คุกกี้</Link>
          </nav>
          <p>สำหรับผู้มีอายุ 20 ปีขึ้นไป · ดื่มไม่ขับ · © NightList</p>
        </div>
      </footer>

      <BottomIsland items={[...NAV, { to: '/profile', label: 'โปรไฟล์', icon: User }]} />
    </Layout>
  );
}
