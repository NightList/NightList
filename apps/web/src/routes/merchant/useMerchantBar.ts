import type { BarWithTier } from '@nightlist/mock';
import { getBar } from '@nightlist/mock';
import { useOutletContext } from 'react-router';
import { useDemo } from '@/shared/data/useDemo';

/** ร้านของผู้ใช้ปัจจุบัน (อัปเดตสดเมื่อข้อมูลเปลี่ยน) */
export function useMerchantBar(): BarWithTier {
  useDemo();
  const bar = useOutletContext<BarWithTier>();
  return getBar(bar.id) ?? bar;
}
