import { CalendarCheck, Crown, House, MagnifyingGlass } from '@phosphor-icons/react';
import type { NavItem } from '@/ui/components/navbar';

/** เมนูหลักฝั่งลูกค้า — ใช้ทั้ง MainLayout และ AuthLayout (Figma: navbar บนหน้า Login) */
export const NAV: NavItem[] = [
  { to: '/', label: 'หน้าแรก', icon: House, end: true },
  { to: '/ranking', label: 'จัดอันดับ', icon: Crown },
  { to: '/search', label: 'ค้นหา', icon: MagnifyingGlass },
  { to: '/bookings', label: 'การจอง', icon: CalendarCheck },
];
