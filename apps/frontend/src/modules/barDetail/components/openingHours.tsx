import { Clock } from '@phosphor-icons/react';
import type { BarWithTier } from '@/services/data';
import { InfoSection } from '@/ui/components/infoSection';

const DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** เวลาเปิด-ปิดรายวัน */
export function OpeningHours({ hours }: { hours: BarWithTier['hours'] }) {
  return (
    <InfoSection icon={<Clock />} title="เวลาเปิด-ปิด">
      <div className="grid grid-cols-4 gap-2 text-sm sm:grid-cols-7">
        {hours.map((h) => (
          <div key={h.day} className="rounded-lg border border-border p-2 text-center">
            <p className="text-muted">{DAYS[h.day]}</p>
            <p>{h.closed ? 'ปิด' : `${h.open}–${h.close}`}</p>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
