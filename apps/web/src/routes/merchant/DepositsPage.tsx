import { barBookings, reviewDeposit } from '@nightlist/mock';
import { App, Button, Card, Empty, Image } from 'antd';
import { useAuth } from '@/shared/auth/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';
import { baht, dateTime, timeAgo } from '@/shared/lib/format';
import { useMerchantBar } from './useMerchantBar';

export function MerchantDepositsPage() {
  const bar = useMerchantBar();
  const { user } = useAuth();
  const { message } = App.useApp();
  const rows = barBookings(bar.id).filter((b) => b.status === 'DEPOSIT_SUBMITTED');
  return (
    <div>
      <PageHeader title="ตรวจสลิปมัดจำ" subtitle="เทียบยอดและเวลาในสลิปกับบัญชีของร้านก่อนยืนยัน" />
      {rows.length === 0 ? (
        <Empty description="ไม่มีสลิปรอตรวจ" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((b) => (
            <Card
              key={b.id}
              title={`${b.userName} · ${b.code}`}
              extra={
                <span className="text-xs text-muted">
                  {b.deposit && timeAgo(b.deposit.submittedAt)}
                </span>
              }
            >
              <p className="text-sm text-muted">
                {dateTime(b.datetime)} · {b.pax} คน
              </p>
              <p className="my-2 text-2xl font-bold text-gold-text">
                {baht(b.deposit?.amount ?? bar.deposit.amount)}
              </p>
              {b.deposit?.slipDataUrl ? (
                <Image src={b.deposit.slipDataUrl} alt="สลิป" height={220} />
              ) : (
                <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border text-muted">
                  (ข้อมูลตัวอย่าง — ไม่มีรูปสลิป)
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  block
                  danger
                  onClick={() => {
                    reviewDeposit(b.id, false, user?.displayName ?? 'ร้าน');
                    message.info('แจ้งลูกค้าให้ส่งสลิปใหม่แล้ว');
                  }}
                >
                  สลิปไม่ผ่าน
                </Button>
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    reviewDeposit(b.id, true, user?.displayName ?? 'ร้าน');
                    message.success('ยืนยันการจองแล้ว');
                  }}
                >
                  ยืนยันมัดจำ
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
