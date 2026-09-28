import { CalendarCheck, MapPin, UsersThree } from '@phosphor-icons/react';
import { getBar, getBookingByShareToken } from '@nightlist/mock';
import { Button, Card, Result } from 'antd';
import { Link, useParams } from 'react-router';
import { BarCover } from '@/features/bars/BarCard';
import { useDemo } from '@/shared/data/useDemo';
import { dateTime } from '@/shared/lib/format';

/** /share/:token — บัตรจองสาธารณะ (ไม่มีข้อมูลส่วนตัว / QR เช็กอิน) */
export function SharePage() {
  useDemo();
  const { token = '' } = useParams();
  const b = getBookingByShareToken(token);
  const bar = b ? getBar(b.barId) : null;
  if (!b || !bar) return <Result status="404" title="ลิงก์นี้หมดอายุหรือไม่ถูกต้อง" />;
  const zone = bar.zones.find((z) => z.id === b.zoneId);
  return (
    <div className="mx-auto max-w-md">
      <Card cover={<BarCover bar={bar} className="h-40" />}>
        <p className="text-sm text-muted">เพื่อนชวนคุณไป</p>
        <h1 className="font-display text-3xl font-bold">{bar.name}</h1>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center gap-2">
            <CalendarCheck className="text-gold-text" /> {dateTime(b.datetime)}
          </li>
          <li className="flex items-center gap-2">
            <UsersThree className="text-gold-text" /> {b.pax} คน · {zone?.name}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="text-gold-text" /> {bar.address}
          </li>
        </ul>
        <div className="mt-6 grid gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${bar.lat},${bar.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button block type="primary" size="large">
              เปิดแผนที่
            </Button>
          </a>
          <Link to={`/bars/${bar.slug}`}>
            <Button block size="large">
              ดูหน้าร้าน
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
