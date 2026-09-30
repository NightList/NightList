import { PageContainer } from '@ant-design/pro-components';
import { getState, SAFETY_LABELS, verifySafety } from '@nightlist/mock';
import { Button, Table } from 'antd';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN } from '@/configs/constants';

export function SafetyPage() {
  useDemo();
  const rows = getState().bars.flatMap((b) =>
    b.safety
      .filter((s) => s.source === 'SELF_DECLARED' && s.value === 'YES')
      .map((s) => ({ id: `${b.id}-${s.key}`, barId: b.id, bar: b.name, key: s.key })),
  );
  return (
    <PageContainer
      title="ยืนยัน Safety"
      content="รายการที่ร้านแจ้งว่า “มี” แต่ทีมยังไม่ได้ตรวจหลักฐาน"
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'ร้าน', dataIndex: 'bar' },
          {
            title: 'มาตรการ',
            dataIndex: 'key',
            render: (k: keyof typeof SAFETY_LABELS) => SAFETY_LABELS[k],
          },
          {
            title: '',
            key: 'a',
            render: (_, r) => (
              <Button
                type="primary"

                onClick={() => verifySafety(r.barId, r.key, ADMIN)}
              >
                ยืนยันแล้ว
              </Button>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}
