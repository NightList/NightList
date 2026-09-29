import { PageContainer } from '@ant-design/pro-components';
import { getBar, getState } from '@nightlist/mock';
import { Table, Tag } from 'antd';
import { dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';


export function UsersPage() {
  useDemo();
  return (
    <PageContainer title="ผู้ใช้">
      <Table
        rowKey="id"
        dataSource={getState().users}
        columns={[
          { title: 'ชื่อ', dataIndex: 'displayName' },
          { title: 'อีเมล', dataIndex: 'email' },
          {
            title: 'Role',
            dataIndex: 'role',
            filters: ['CUSTOMER', 'MERCHANT', 'STAFF', 'ADMIN'].map((r) => ({ text: r, value: r })),
            onFilter: (v, r) => r.role === v,
            render: (r: string) => (
              <Tag color={r === 'ADMIN' ? 'red' : r === 'CUSTOMER' ? 'default' : 'gold'}>{r}</Tag>
            ),
          },
          {
            title: 'ร้าน',
            dataIndex: 'barId',
            render: (id?: string) => (id ? getBar(id)?.name : '-'),
          },
          { title: 'สมัครเมื่อ', dataIndex: 'createdAt', render: (v: string) => dateTime(v) },
        ]}
      />
    </PageContainer>
  );
}
