import { User } from '@phosphor-icons/react';
import { Layout } from 'antd';
import { Outlet, useLocation, useMatches } from 'react-router';
import { NAV } from '@/configs/nav';
import { useDemo } from '@/hooks/useDemo';
import { useAuth } from '@/services/auth';
import { AgeGate } from '@/ui/components/ageGate';
import { SiteFooter } from '@/ui/components/siteFooter';
import { BottomIsland, Navbar, type NavItem } from '@/ui/components/navbar';

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
  // หน้าที่วาดเต็มจอเอง (ภาพพื้นหลังเต็มจอ + navbar ใส) ตั้ง handle: { fullBleed: true } ใน router
  const handles = useMatches().map((m) => (m.handle ?? {}) as { fullBleed?: boolean; hideFooter?: boolean });
  const fullBleed = handles.some((h) => h.fullBleed);
  const hideFooter = handles.some((h) => h.hideFooter);
  const bleed = isHome || fullBleed;
  const isShop = user?.role === 'MERCHANT' || user?.role === 'STAFF';
  const items: NavItem[] = [...NAV, ...(isShop ? [{ to: '/merchant', label: 'ร้านของฉัน' }] : [])];

  return (
    <Layout className="min-h-dvh !bg-background">
      <AgeGate />
      <header className="sticky top-0 z-40 h-0">
        <div className="flex justify-center px-3 pt-3 md:pt-4">
          <Navbar items={items} overVideo={bleed} />
        </div>
      </header>

      {bleed ? (
        <main className="flex-1">
          <Outlet />
        </main>
      ) : (
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-24 md:pb-10">
          <Outlet />
        </main>
      )}

      {!hideFooter && <SiteFooter />}

      <BottomIsland items={[...NAV, { to: '/profile', label: 'โปรไฟล์', icon: User }]} />
    </Layout>
  );
}
