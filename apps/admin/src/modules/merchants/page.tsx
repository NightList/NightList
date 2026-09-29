import { PageContainer } from '@ant-design/pro-components';
import { CATEGORY_LABELS, getState, setBarStatus } from '@nightlist/mock';
import { App, Button, Space, Table, Tag } from 'antd';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN, BAR_STATUS_COLOR } from '@/configs/constants';

export function MerchantsPage() {
  useDemo();
  const { message } = App.useApp();
  const rows = getState().bars.filter((b) => b.status === 'PENDING_REVIEW' || b.status === 'DRAFT');
  return (
    <PageContainer title="ร้านรออนุมัติ">
      <Table
        rowKey="id"
        dataSource={rows}
        locale={{ emptyText: 'ไม่มีร้านรอตรวจ' }}
        columns={[
          { title: 'ร้าน', dataIndex: 'name' },
          {
            title: 'ประเภท',
            dataIndex: 'category',
            render: (c: keyof typeof CATEGORY_LABELS) => CATEGORY_LABELS[c],
          },
          { title: 'ย่าน', dataIndex: 'district' },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => <Tag color={BAR_STATUS_COLOR[s]}>{s}</Tag>,
          },
          {
            title: '',
            key: 'a',
            render: (_, b) => (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setBarStatus(b.id, 'APPROVED', ADMIN);
                    message.success(`อนุมัติ ${b.name}`);
                  }}
                >
                  อนุมัติ
                </Button>
                <Button danger onClick={() => setBarStatus(b.id, 'REJECTED', ADMIN)}>
                  ไม่อนุมัติ
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}
