import { PageContainer } from '@ant-design/pro-components';
import { getState, setBarStatus, updateBar, withTier } from '@nightlist/mock';
import { TierStars } from '@nightlist/ui';
import { Button, Input, Popconfirm, Switch, Table, Tag } from 'antd';
import { useState } from 'react';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN, BAR_STATUS_COLOR } from '@/configs/constants';

export function BarsPage() {
  useDemo();
  const [q, setQ] = useState('');
  const rows = getState()
    .bars.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()))
    .map(withTier);
  return (
    <PageContainer
      title="จัดการร้าน"
      extra={<Input.Search placeholder="ค้นหาชื่อร้าน" allowClear onSearch={setQ} />}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        scroll={{ x: 900 }}
        columns={[
          { title: 'ร้าน', dataIndex: 'name' },
          { title: 'ย่าน', dataIndex: 'district' },
          {
            title: 'ดาว',
            key: 't',
            render: (_, b) => (b.stars ? <TierStars stars={b.stars} /> : <Tag>ร้านใหม่</Tag>),
          },
          { title: 'คะแนน', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => <Tag color={BAR_STATUS_COLOR[s]}>{s}</Tag>,
          },
          {
            title: "Editor's Pick",
            dataIndex: 'editorsPick',
            render: (v: boolean, b) => (
              <Switch
                checked={v}
                onChange={(editorsPick) => updateBar(b.id, { editorsPick }, ADMIN)}
              />
            ),
          },
          {
            title: '',
            key: 'a',
            render: (_, b) =>
              b.status === 'SUSPENDED' ? (
                <Button onClick={() => setBarStatus(b.id, 'APPROVED', ADMIN)}>เปิดใช้งาน</Button>
              ) : (
                <Popconfirm
                  title={`ระงับ ${b.name}?`}
                  okText="ระงับ"
                  cancelText="ยกเลิก"
                  onConfirm={() => setBarStatus(b.id, 'SUSPENDED', ADMIN)}
                >
                  <Button danger>ระงับ</Button>
                </Popconfirm>
              ),
          },
        ]}
      />
    </PageContainer>
  );
}
