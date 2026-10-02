import { Button, Result } from 'antd';
import { Link } from 'react-router';

const ACTIONS = {
  bar: { to: '/search', label: 'ค้นหาร้านอื่น' },
  booking: { to: '/bookings', label: 'ดูการจองของฉัน' },
  home: { to: '/', label: 'กลับหน้าหลัก' },
} as const;

/** "ไม่พบ…" ภายในหน้า (ร้าน/การจอง/ลิงก์) พร้อมปุ่มพาไปต่อ — ใช้แทน <Result status="404"> ที่ซ้ำกันหลายหน้า */
export function NotFoundResult({
  title,
  kind = 'home',
}: {
  title: string;
  kind?: keyof typeof ACTIONS;
}) {
  const a = ACTIONS[kind];
  return (
    <Result
      status="404"
      title={title}
      extra={
        <Link to={a.to}>
          <Button type="primary">{a.label}</Button>
        </Link>
      }
    />
  );
}
