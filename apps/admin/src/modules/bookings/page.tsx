import { PageContainer } from '@ant-design/pro-components';
import { getBar, getState } from '@nightlist/mock';
import { Input, Table, Tag } from 'antd';
import { useState } from 'react';
import { dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';

export function BookingsPage() {
  useDemo();
  const [q, setQ] = useState('');
  const rows = getState().bookings.filter(
    (b) => !q || b.code.includes(q.toUpperCase()) || b.userName.includes(q),
  );
  return (
    <PageContainer
      title="การจอง"
      extra={<Input.Search placeholder="รหัสจอง / ชื่อลูกค้า" allowClear onSearch={setQ} />}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender: (b) => (
            <ul className="text-sm">
              {b.history.map((h) => (
                <li key={h.at + h.to}>
                  {dateTime(h.at)} · {h.from ?? '—'} → {h.to} · {h.by}
                </li>
              ))}
            </ul>
          ),
        }}
        columns={[
          { title: 'รหัส', dataIndex: 'code' },
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'ลูกค้า', dataIndex: 'userName' },
          { title: 'เวลา', dataIndex: 'datetime', render: (v: string) => dateTime(v) },
          { title: 'คน', dataIndex: 'pax' },
          { title: 'สถานะ', dataIndex: 'status', render: (s: string) => <Tag>{s}</Tag> },
        ]}
      />
    </PageContainer>
  );
}
