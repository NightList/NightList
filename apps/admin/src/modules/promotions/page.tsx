import { PageContainer } from '@ant-design/pro-components';
import { getBar, getState, reviewPromotion } from '@nightlist/mock';
import { App, Button, Space, Table, Tag } from 'antd';
import { baht, dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN } from '@/configs/constants';

export function PromotionsPage() {
  useDemo();
  const { message } = App.useApp();
  return (
    <PageContainer title="โปรโมท">
      <Table
        rowKey="id"
        dataSource={getState().promotions}
        columns={[
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'แพ็กเกจ', dataIndex: 'packageName' },
          { title: 'ราคา', dataIndex: 'price', render: (v: number) => baht(v) },
          { title: 'สั่งเมื่อ', dataIndex: 'createdAt', render: (v: string) => dateTime(v) },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'ACTIVE' ? 'green' : s === 'REJECTED' ? 'red' : 'gold'}>{s}</Tag>
            ),
          },
          {
            title: '',
            key: 'a',
            render: (_, p) =>
              p.status === 'PAYMENT_SUBMITTED' && (
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      reviewPromotion(p.id, true, ADMIN);
                      message.success('เปิดโปรโมทแล้ว');
                    }}
                  >
                    สลิปผ่าน
                  </Button>
                  <Button danger size="small" onClick={() => reviewPromotion(p.id, false, ADMIN)}>
                    ไม่ผ่าน
                  </Button>
                </Space>
              ),
          },
        ]}
      />
    </PageContainer>
  );
}
