import { CheckCircle, QrCode } from '@phosphor-icons/react';
import { barBookings, checkInByCode, setCrowd } from '@nightlist/mock';
import type { CrowdStatus } from '@nightlist/types';
import { getAntdTheme } from '@nightlist/ui';
import { App, Button, ConfigProvider, Empty, Input, Listy, Segmented, Tag } from 'antd';
import { ListRow } from '@/shared/components/ListRow';
import { useState } from 'react';
import { BookingStatusTag } from '@/features/booking/BookingStatusTag';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useMerchantBar } from './useMerchantBar';

/** /merchant/tonight — Staff Scanner (บังคับ Dark เสมอ) */
export function TonightPage() {
  const bar = useMerchantBar();
  const { user } = useAuth();
  const { message } = App.useApp();
  const [code, setCode] = useState('');
  const [last, setLast] = useState<string>();
  const tonight = barBookings(bar.id).filter(
    (b) =>
      new Date(b.datetime).toDateString() === new Date().toDateString() &&
      !['CANCELLED_BY_CUSTOMER', 'REJECTED', 'EXPIRED'].includes(b.status),
  );

  const doCheckIn = (value: string) => {
    try {
      const b = checkInByCode(bar.id, value, user?.displayName ?? 'staff');
      setLast(`${b.userName} · ${b.pax} คน · ${bar.zones.find((z) => z.id === b.zoneId)?.name}`);
      setCode('');
      message.success('เช็กอินสำเร็จ');
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <ConfigProvider theme={getAntdTheme('dark')}>
      <div className="dark rounded-3xl bg-background p-5 text-text md:p-8">
        <h1 className="mb-1 font-display text-2xl">คืนนี้ · {bar.name}</h1>
        <p className="mb-6 text-sm text-muted">สแกน QR ของลูกค้า (หรือพิมพ์รหัสจอง) เพื่อเช็กอิน</p>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <QrCode size={22} className="text-gold" /> สแกน / กรอกรหัส
          </p>
          <Input.Search
            size="large"
            placeholder="เช่น NL-3F8K2 หรือข้อความจาก QR"
            enterButton="เช็กอิน"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onSearch={(v) => v && doCheckIn(v)}
            autoFocus
          />
          <p className="mt-2 text-xs text-muted">
            เดโม: ใช้เครื่องอ่าน QR ที่ต่อเป็นคีย์บอร์ด หรือพิมพ์รหัสจองได้เลย
            (สแกนด้วยกล้องจะเพิ่มในเวอร์ชันถัดไป)
          </p>
          {last && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-(--crowd-available) p-3">
              <CheckCircle size={28} weight="fill" className="text-(--crowd-available)" />
              <span className="font-semibold">{last}</span>
            </div>
          )}
        </div>

        <p className="mb-2 mt-6 text-muted">สถานะร้านตอนนี้</p>
        <Segmented<CrowdStatus>
          block
          size="large"
          value={bar.crowd}
          onChange={(v) => {
            setCrowd(bar.id, v);
            message.success('อัปเดตสถานะร้านแล้ว');
          }}
          options={[
            { label: '🟢 ว่าง', value: 'AVAILABLE' },
            { label: '🟡 ใกล้เต็ม', value: 'ALMOST_FULL' },
            { label: '🔴 เต็ม', value: 'FULL' },
          ]}
        />

        <p className="mb-2 mt-6 text-muted">จองคืนนี้ ({tonight.length})</p>
        {tonight.length === 0 && <Empty description="ยังไม่มีการจองคืนนี้" />}
        <Listy
          items={tonight}
          rowKey="id"
          itemRender={(b) => (
            <ListRow
              actions={
                b.status === 'CONFIRMED'
                  ? [
                      <Button key="c" type="primary" onClick={() => doCheckIn(b.code)}>
                        เช็กอิน
                      </Button>,
                    ]
                  : [<BookingStatusTag key="s" status={b.status} />]
              }
              title={`${new Date(b.datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} · ${b.userName}`}
              description={
                <>
                  {b.pax} คน · {bar.zones.find((z) => z.id === b.zoneId)?.name} ·{' '}
                  <Tag>{b.code}</Tag>
                </>
              }
            />
          )}
        />
      </div>
    </ConfigProvider>
  );
}
