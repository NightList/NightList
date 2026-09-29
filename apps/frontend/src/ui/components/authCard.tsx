import { Typography } from 'antd';
import type { ReactNode } from 'react';

/**
 * การ์ดกระจกของหน้า Auth (Figma: login 2)
 * โลโก้ลอยคร่อมขอบบนการ์ด · มุม 30px · พื้นดำโปร่ง + blur
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  /** หัวข้อ (ไม่ใส่ก็ได้ — หน้า login ใช้แค่ subtitle ตาม Figma) */
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative w-full max-w-[520px] pt-[84px]">
      <img
        src="/images/common/logo.png"
        alt="NightList"
        width={177}
        height={172}
        className="absolute left-1/2 top-0 z-10 w-[150px] -translate-x-1/2 drop-shadow-[0_12px_30px_rgba(139,79,227,0.45)] sm:w-[177px]"
      />
      <div className="rounded-[30px] border border-white/15 bg-[#0c0a12]/75 px-6 pb-9 pt-[104px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-14">
        <div className="mb-7 text-center">
          {title && (
            <Typography.Title level={3} className="!mb-1">
              {title}
            </Typography.Title>
          )}
          {subtitle && (
            <p className="text-balance text-base text-white/85 sm:text-lg">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      {footer && <div className="mt-5 text-center text-xs text-white/60">{footer}</div>}
    </div>
  );
}
