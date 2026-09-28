import {
  Bell,
  CalendarCheck,
  Crown,
  House,
  MagnifyingGlass,
  MoonStars,
  User,
} from '@phosphor-icons/react';
import { ThemeToggle } from '@nightlist/ui';
import { myNotifications } from '@nightlist/mock';
import { Badge, Button, Layout } from 'antd';
import { Link, NavLink, Outlet } from 'react-router';
import { AgeGate } from '@/features/age-gate/AgeGate';
import { useAuth } from '@/shared/auth/AuthProvider';
import { DemoBanner } from '@/shared/components/DemoBanner';
import { useDemo } from '@/shared/data/useDemo';

const NAV = [
  { to: '/', label: 'หน้าแรก', icon: House, end: true },
  { to: '/ranking', label: 'จัดอันดับ', icon: Crown },
  { to: '/search', label: 'ค้นหา', icon: MagnifyingGlass },
  { to: '/bookings', label: 'การจอง', icon: CalendarCheck },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 text-sm transition-colors ${
    isActive
      ? 'text-gold-text after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-gold'
      : 'text-muted hover:text-text'
  }`;

export function MainLayout() {
  useDemo();
  const { user } = useAuth();
  const unread = user ? myNotifications().filter((n) => !n.readAt).length : 0;
  const isShop = user?.role === 'MERCHANT' || user?.role === 'STAFF';

  return (
    <Layout className="min-h-dvh !bg-background">
      <AgeGate />
      <DemoBanner />
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 !text-text">
            <MoonStars size={28} weight="fill" className="text-gold" />
            <span className="font-display text-xl font-bold tracking-wide">
              NIGHT<span className="text-gold-text">LIST</span>
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex" aria-label="เมนูหลัก">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
                {n.label}
              </NavLink>
            ))}
            {isShop && (
              <NavLink to="/merchant" className={navClass}>
                ร้านของฉัน
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <Link to="/notifications">
                <Badge count={unread} size="small">
                  <Button
                    type="text"
                    shape="circle"
                    aria-label={`แจ้งเตือน ${unread} รายการ`}
                    icon={<Bell size={20} />}
                  />
                </Badge>
              </Link>
            )}
            {user ? (
              <Link to="/profile">
                <Button type="text" shape="circle" aria-label="โปรไฟล์" icon={<User size={20} />} />
              </Link>
            ) : (
              <Link to="/login">
                <Button type="primary" shape="round">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 md:pb-10">
        <Outlet />
      </main>

      <footer className="hidden border-t border-border py-8 text-center text-sm text-muted md:block">
        <nav className="mb-2 flex justify-center gap-6">
          <Link to="/about">เกี่ยวกับเรา</Link>
          <Link to="/terms">เงื่อนไขการใช้งาน</Link>
          <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
          <Link to="/cookies">คุกกี้</Link>
        </nav>
        <p>20+ · ดื่มไม่ขับ · © NightList</p>
      </footer>

      {/* Bottom nav (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="เมนูล่าง"
      >
        {[...NAV, { to: '/profile', label: 'โปรไฟล์', icon: User }].map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={'end' in n ? n.end : false}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-gold-text' : 'text-muted'}`
            }
          >
            {({ isActive }) => (
              <>
                <n.icon size={22} weight={isActive ? 'fill' : 'regular'} />
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </Layout>
  );
}
