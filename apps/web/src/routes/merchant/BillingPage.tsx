import { billingEvents } from '@nightlist/mock';
import { Alert, Card, Statistic, Table, Tag } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { baht, dateTime } from '@/shared/lib/format';
import { useMerchantBar } from './useMerchantBar';

export function MerchantBillingPage() {
  const bar = useMerchantBar();
  const rows = billingEvents().filter((e) => e.barId === bar.id);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  return (
    <div>
      <PageHeader title="ค่าคอมมิชชัน" />
      <Alert
        className="!mb-6"
        type="info"
        showIcon
        title="ค่าคอมเกิดเมื่อลูกค้าเช็กอินสำเร็จเท่านั้น (ตัวอย่าง 10% ของยอดประเมิน) · ไม่มาตามนัดไม่คิดค่าคอม"
      />
      <Card className="!mb-6">
        <Statistic title="ยอดค้างชำระเดือนนี้" value={total} formatter={(v) => baht(Number(v))} />
      </Card>
      <Card>
        <Table
          rowKey="id"
          dataSource={rows}
          columns={[
            { title: 'เวลา', dataIndex: 'at', render: (v: string) => dateTime(v) },
            { title: 'รหัสจอง', dataIndex: 'bookingCode' },
            {
              title: 'เหตุการณ์',
              dataIndex: 'type',
              render: (t: string) => <Tag color={t === 'CHECK_IN' ? 'green' : 'default'}>{t}</Tag>,
            },
            { title: 'ยอดฐาน', dataIndex: 'baseAmount', render: (v: number) => baht(v) },
            { title: 'ค่าคอม', dataIndex: 'amount', render: (v: number) => baht(v) },
            { title: 'สถานะ', dataIndex: 'status' },
          ]}
        />
      </Card>
    </div>
  );
}
