import { getBar, myBookings } from '@nightlist/mock';
import { Card, Empty, Tabs } from 'antd';
import { Link } from 'react-router';
import { BookingStatusTag } from '@/features/booking/BookingStatusTag';
import { PageHeader } from '@/shared/components/PageHeader';
import { useDemo } from '@/shared/data/useDemo';
import { dateTime } from '@/shared/lib/format';

const UPCOMING = ['PENDING', 'AWAITING_DEPOSIT', 'DEPOSIT_SUBMITTED', 'CONFIRMED', 'CHECKED_IN'];
const CANCELLED = [
  'REJECTED',
  'CANCELLED_BY_CUSTOMER',
  'CANCELLED_BY_MERCHANT',
  'EXPIRED',
  'NO_SHOW',
];

export function BookingsPage() {
  useDemo();
  const all = myBookings();
  const groups = {
    upcoming: all.filter((b) => UPCOMING.includes(b.status)),
    past: all.filter((b) => b.status === 'COMPLETED'),
    cancelled: all.filter((b) => CANCELLED.includes(b.status)),
  };
  const list = (items: typeof all) =>
    items.length ? (
      <div className="grid gap-3">
        {items.map((b) => {
          const bar = getBar(b.barId);
          return (
            <Link key={b.id} to={`/bookings/${b.id}`} className="!text-text">
              <Card hoverable size="small">
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="h-12 w-12 shrink-0 rounded-xl"
                    style={{ background: bar?.cover }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{bar?.name}</p>
                    <p className="text-sm text-muted">
                      {dateTime(b.datetime)} · {b.pax} คน · {b.code}
                    </p>
                  </div>
                  <BookingStatusTag status={b.status} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    ) : (
      <Empty description="ไม่มีรายการ">
        <Link to="/search">หาร้านเพื่อจอง →</Link>
      </Empty>
    );
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="การจองของฉัน" />
      <Tabs
        items={[
          {
            key: 'u',
            label: `กำลังจะถึง (${groups.upcoming.length})`,
            children: list(groups.upcoming),
          },
          { key: 'p', label: 'ที่ผ่านมา', children: list(groups.past) },
          { key: 'c', label: 'ยกเลิก/ไม่สำเร็จ', children: list(groups.cancelled) },
        ]}
      />
    </div>
  );
}
