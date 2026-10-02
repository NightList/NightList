import { ArrowRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

/**
 * หัวข้อ section (Figma: Main) — ชื่อตัวหนาซ้าย + ลิงก์ม่วง "ดูทั้งหมด →" ขวา
 * ใส่ `id` แล้วให้ <section aria-labelledby={id}> อ้างถึง
 */
export function SectionHeader({
  id,
  title,
  to,
  linkLabel = 'ดูทั้งหมด',
  extra,
  className = '',
}: {
  id?: string;
  title: ReactNode;
  to?: string;
  linkLabel?: string;
  /** ของด้านขวาแทนลิงก์ เช่น ปุ่ม */
  extra?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 flex items-center justify-between gap-4 ${className}`}>
      <h2 id={id} className="text-2xl font-bold md:text-3xl">
        {title}
      </h2>
      {extra ??
        (to && (
          <Link
            to={to}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium !text-purple hover:!text-purple/80"
          >
            {linkLabel} <ArrowRight size={16} weight="bold" />
          </Link>
        ))}
    </div>
  );
}
