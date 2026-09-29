import { Typography } from 'antd';
import type { ReactNode } from 'react';

/**
 * การ์ดกระจกของหน้า Auth (Figma: "Login")
 * กว้าง ~460px กลางจอ · โลโก้อยู่ในการ์ดด้านบน · มุม 16px · พื้นดำโปร่ง + blur · ขอบขาวจาง
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  /** หัวข้อ (ไม่ใส่ก็ได้ — หน้า login มีแค่โลโก้ตาม Figma) */
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-[460px]">
      <div className="rounded-2xl border border-white/15 bg-[#0b0910]/60 px-6 pb-8 pt-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-14">
        <img
          src="/images/common/logo.png"
          alt="NightList"
          width={177}
          height={172}
          className="mx-auto mb-5 w-[120px] drop-shadow-[0_10px_28px_rgba(139,79,227,0.45)]"
        />
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && (
              <Typography.Title level={4} className="!mb-1 !text-white">
                {title}
              </Typography.Title>
            )}
            {subtitle && <p className="text-balance text-sm text-white/75">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
      {footer && <div className="mt-4 text-center text-xs text-white/60">{footer}</div>}
    </div>
  );
}
