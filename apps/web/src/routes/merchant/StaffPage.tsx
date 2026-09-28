import { getState } from '@nightlist/mock';
import { App, Avatar, Button, Card, Form, Input, Listy, Tag } from 'antd';
import { ListRow } from '@/shared/components/ListRow';
import { PageHeader } from '@/shared/components/PageHeader';
import { useMerchantBar } from './useMerchantBar';

export function MerchantStaffPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  const members = getState().users.filter((u) => u.barId === bar.id);
  return (
    <div className="space-y-6">
      <PageHeader title="พนักงาน" subtitle="Staff เห็นเฉพาะหน้า คืนนี้ และ การจอง" />
      <Card title="เชิญพนักงานทางอีเมล">
        <Form
          layout="inline"
          onFinish={({ email }: { email: string }) =>
            message.success(`เดโม: ส่งลิงก์เชิญไปที่ ${email} แล้ว (/accept-invite)`)
          }
        >
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="staff@example.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            ส่งคำเชิญ
          </Button>
        </Form>
      </Card>
      <Card title="สมาชิก">
        <Listy
          items={members}
          rowKey="id"
          itemRender={(u) => (
            <ListRow
              actions={
                <Tag color={u.role === 'MERCHANT' ? 'gold' : 'purple'}>
                  {u.role === 'MERCHANT' ? 'เจ้าของ' : 'Staff'}
                </Tag>
              }
              avatar={<Avatar>{u.displayName.slice(0, 2)}</Avatar>}
              title={u.displayName}
              description={u.email}
            />
          )}
        />
      </Card>
    </div>
  );
}
