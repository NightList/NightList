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
}

/** พื้นกระจกของ island — มืดเสมอ ให้อ่านออกทั้งบนวิดีโอและบนพื้นหน้า (dark/light) */
const ISLAND =
  'border border-white/10 bg-[#0c0a12]/90 text-[#f5f1e8] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl';

const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;

/**
 * Floating island navbar (บนสุด)
 * - แคปซูลลอยกลางจอ แยกจากขอบ · เลื่อนลงแล้วหดให้กะทัดรัด
 * - แถบไฮไลต์เลื่อนตามเมนูที่เลือก (layoutId)
 * - มือถือ: แสดงแค่โลโก้ + ปุ่ม, เมนูอยู่ที่ <BottomIsland>
 */
export function Navbar({ items }: { items: NavItem[] }) {
  useDemo();
  const { user } = useAuth();
  const scrolled = useScrolled();
  const reduce = useReducedMotion();
  const unread = user ? myNotifications().filter((n) => !n.readAt).length : 0;

  return (
    <motion.div
      layout={!reduce}
      transition={spring}
      className={`flex items-center gap-2 rounded-full px-2 ${ISLAND} ${
        scrolled ? 'h-12 w-full max-w-2xl' : 'h-14 w-full max-w-3xl'
      }`}
    >
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 rounded-full pr-2 !text-[#f5f1e8]"
        aria-label="NightList หน้าแรก"
      >
        <img
          src="/images/common/logo.png"
          alt=""
          width={36}
          height={35}
          className={scrolled ? 'size-8' : 'size-9'}
        />
        <span className="font-display text-lg font-bold text-gold">NightList</span>
      </Link>

      <nav className="ml-auto hidden items-center md:flex" aria-label="เมนูหลัก">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative isolate rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                isActive ? 'text-[#07070d]' : 'text-white/70 hover:text-white'
              }`
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

      <div className="ml-auto flex items-center gap-0.5 md:ml-1 [&_.ant-btn]:!text-white/80 [&_.ant-btn:hover]:!text-white">
        <ThemeToggle />
        {user && (
          <Link to="/notifications">
            <Badge count={unread} size="small" offset={[-4, 4]}>
              <Button type="text" shape="circle" aria-label={`แจ้งเตือน ${unread} รายการ`} icon={<Bell size={20} />} />
            </Badge>
          </Link>
        )}
        {user ? (
          <Link to="/profile">
            <Button type="text" shape="circle" aria-label="โปรไฟล์" icon={<User size={20} />} />
          </Link>
        ) : (
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
      <div className={`flex w-full max-w-md items-center justify-between rounded-full p-1.5 ${ISLAND}`}>
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative isolate flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[11px] ${
                isActive ? 'text-[#07070d]' : 'text-white/65'
              }`
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
