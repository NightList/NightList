import { Tag } from 'antd';
import type { TagLabel } from '@/ui/utils/labels';

/** Tag สถานะจากตารางป้ายภาษาไทย — ค่าที่ไม่รู้จักแสดงรหัสเดิม */
export function StatusTag({ map, value }: { map: Record<string, TagLabel>; value: string | null | undefined }) {
  if (!value) return <>-</>;
  const l = map[value];
  return <Tag color={l?.color ?? 'default'}>{l?.text ?? value}</Tag>;
}
