import type { ReactNode } from 'react';

/** บล็อกข้อมูลในหน้า: ไอคอน + หัวข้อตัวหนา (+ ปุ่มด้านขวา) แล้วตามด้วยเนื้อหา */
export function InfoSection({
  icon,
  title,
  extra,
  children,
}: {
  icon?: ReactNode;
  title: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </section>
  );
}
