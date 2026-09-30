import { PageContainer } from '@ant-design/pro-components';
import { deleteReview, getBar, getState, setReviewReported } from '@nightlist/mock';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN } from '@/configs/constants';

export function ReviewsPage() {
  useDemo();
  const rows = getState().reviews.filter((r) => r.reported);
  return (
    <PageContainer title="รีวิวที่ถูกรายงาน">
      <Table
        rowKey="id"
        dataSource={rows}
        locale={{ emptyText: 'ไม่มีรีวิวที่ถูกรายงาน' }}
        columns={[
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'ผู้รีวิว', dataIndex: 'userName' },
          { title: 'คะแนน', dataIndex: 'rating' },
          { title: 'ความเห็น', dataIndex: 'comment' },
          {
            title: '',
            key: 'a',
            render: (_, r) => (
              <Space>
                <Button onClick={() => setReviewReported(r.id, false)}>เก็บไว้</Button>
                <Popconfirm
                  title="ลบรีวิวนี้?"
                  okText="ลบ"
                  cancelText="ยกเลิก"
                  onConfirm={() => deleteReview(r.id, ADMIN)}
                >
                  <Button danger>ลบ</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}
