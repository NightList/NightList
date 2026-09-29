import type { Icon } from '@phosphor-icons/react';

/** การ์ดหมวดหมู่ในหน้าแรก — ลิงก์ไป /ranking?category= หรือ /search?style= */
export interface HomeCategory {
  key: string;
  title: string;
  subtitle: string;
  to: string;
  icon: Icon;
  /** โทนการ์ดตาม Figma: amber = สายเบียร์, violet = สายค็อกเทล */
  tone: 'amber' | 'violet';
}
