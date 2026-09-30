import { Bell, User, type Icon } from '@phosphor-icons/react';
import { myNotifications } from '@nightlist/mock';
import { ThemeToggle } from '@nightlist/ui';
import { Badge, Button } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import { Link, NavLink } from 'react-router';
import { useDemo } from '@/hooks/useDemo';
import { useScrolled } from '@/hooks/useScrolled';
import { useAuth } from '@/services/auth';

export interface NavItem {
  to: string;
  label: string;
  icon?: Icon;
  end?: boolean;
  /** แสดงเฉพาะ navbar บนจอใหญ่ (ไม่ใส่ใน BottomIsland มือถือ) */
  desktopOnly?: boolean;
}

/**
 * พื้นกระจกของ island มี 2 โหมด
 * - overVideo (หน้าแรก ยังไม่เลื่อน): กระจกใสบนวิดีโอ ตัวหนังสือขาว
 * - ปกติ: ใช้สีตามธีม (surface/text) → อ่านออกทั้ง dark และ light
 */
const ISLAND = {
  overVideo:
    'border-white/15 bg-white/15 text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md',
  page: 'border-border bg-surface/85 text-text shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl',
} as const;

const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;

/**
 * Floating island navbar (บนสุด)
 * - แคปซูลลอยกลางจอ แยกจากขอบ · เลื่อนลงแล้วหดให้กะทัดรัด
 * - แถบไฮไลต์เลื่อนตามเมนูที่เลือก (layoutId)
 * - มือถือ: แสดงแค่โลโก้ + ปุ่ม, เมนูอยู่ที่ <BottomIsland>
 */
export function Navbar({
  items,
  overVideo = false,
  minimal = false,
}: {
  items: NavItem[];
  overVideo?: boolean;
  /** หน้า Auth: ไม่มีปุ่มเปลี่ยนธีม / ปุ่มเข้าสู่ระบบ (อยู่ในหน้าอยู่แล้ว) */
  minimal?: boolean;
}) {
  useDemo();
  const { user } = useAuth();
  const scrolled = useScrolled();
  const reduce = useReducedMotion();
  const unread = user ? myNotifications().filter((n) => !n.readAt).length : 0;
  const glass = overVideo && !scrolled;
  const dim = glass ? 'text-white/75 hover:text-white' : 'text-muted hover:text-text';

  return (
    <motion.div
      layout={!reduce}
      transition={spring}
      className={`flex items-center gap-2 rounded-full border px-2 transition-colors duration-300 ${glass ? ISLAND.overVideo : ISLAND.page} ${scrolled ? 'h-12 w-full max-w-3xl' : 'h-14 w-full max-w-4xl'}`}
    >
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 rounded-full pr-2 !text-gold"
        aria-label="NightList หน้าแรก"
      >
        <img
          src="/images/common/logo.png"
          alt=""
          width={36}
          height={35}
          className={scrolled ? 'size-8' : 'size-9'}
        />
        <span
          className={`font-display text-lg font-bold ${glass ? 'text-gold' : 'text-gold-text'}`}
        >
          NightList
        </span>
      </Link>

      <nav className="ml-auto hidden items-center md:flex" aria-label="เมนูหลัก">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative isolate rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${isActive ? 'text-on-gold' : dim}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="island-active"
                    transition={reduce ? { duration: 0 } : spring}
                    className="absolute inset-0 -z-10 rounded-full bg-gold"
                  />
                )}
                <span className="relative">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`ml-auto flex items-center gap-0.5 md:ml-1 ${glass ? '[&_.ant-btn]:!text-white/85 [&_.ant-btn:hover]:!text-white' : ''}`}
      >
        {!minimal && <ThemeToggle />}
        {user && (
          <Link to="/notifications">
            <Badge count={unread} size="small" offset={[-4, 4]}>
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
        ) : minimal ? null : (
          <Link to="/login" className="ml-1">
            <Button type="primary" shape="round">
              เข้าสู่ระบบ
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/** Floating island ด้านล่าง (มือถือ) — ไอคอน + ป้ายชื่อ, ไฮไลต์เลื่อนตามหน้า */
export function BottomIsland({ items }: { items: NavItem[] }) {
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="เมนูล่าง"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-3 md:hidden"
    >
      <div
        className={`flex w-full max-w-md items-center justify-between rounded-full border p-1.5 ${ISLAND.page}`}
      >
        {items.filter((n) => !n.desktopOnly).map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative isolate flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[11px] ${isActive ? 'text-on-gold' : 'text-muted'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="bottom-island-active"
                    transition={reduce ? { duration: 0 } : spring}
                    className="absolute inset-0 -z-10 rounded-full bg-gold"
                  />
                )}
                {n.icon && <n.icon size={20} weight={isActive ? 'fill' : 'regular'} />}
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
