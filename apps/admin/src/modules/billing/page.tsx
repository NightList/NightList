import { PageContainer } from '@ant-design/pro-components';
import { billingEvents } from '@nightlist/mock';
import { Table, Tag } from 'antd';
import { baht, dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';

export function BillingPage() {
  useDemo();
  const rows = billingEvents();
  return (
    <PageContainer
      title="ค่าคอม"
      content={`Commission rule เดโม: 10% ของยอดประเมิน · NO_SHOW = WAIVED · รวม ${baht(rows.reduce((s, r) => s + r.amount, 0))}`}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'ร้าน', dataIndex: 'barName' },
          { title: 'รหัสจอง', dataIndex: 'bookingCode' },
          {
            title: 'Event',
            dataIndex: 'type',
            render: (t: string) => <Tag color={t === 'CHECK_IN' ? 'green' : 'default'}>{t}</Tag>,
          },
          { title: 'ยอดฐาน', dataIndex: 'baseAmount', render: (v: number) => baht(v) },
          { title: 'ค่าคอม', dataIndex: 'amount', render: (v: number) => baht(v) },
          { title: 'สถานะ', dataIndex: 'status' },
          { title: 'เวลา', dataIndex: 'at', render: (v: string) => dateTime(v) },
        ]}
      />
    </PageContainer>
  );
}
