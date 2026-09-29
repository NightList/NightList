import { PageContainer } from '@ant-design/pro-components';
import { tierList } from '@nightlist/mock';
import type { Tier } from '@nightlist/types';
import { TierStars } from '@nightlist/ui';
import { Table, Tag } from 'antd';
import { useDemo } from '@/hooks/useDemo';

export function RankingPage() {
  useDemo();
  const tiers = tierList();
  const rows = (['S', 'A', 'B', 'C'] as Tier[]).flatMap((t) =>
    tiers[t].map((b) => ({ ...b, tierKey: t })),
  );
  return (
    <PageContainer
      title="ดาว / อันดับ"
      content="คำนวณจากคะแนนรวม (รีวิวเช็กอินจริง · จำนวนเช็กอิน · Safety · ข้อมูลราคา) — การโปรโมทไม่มีผลต่อดาว"
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'ร้าน', dataIndex: 'name' },
          { title: 'คะแนนรวม', dataIndex: 'score' },
          {
            title: 'ดาว',
            dataIndex: 'stars',
            render: (n: number, r) => <TierStars stars={n} tier={r.tierKey as Tier} />,
          },
          { title: 'รีวิว', dataIndex: 'reviewCount' },
          {
            title: 'โปรโมท',
            dataIndex: 'promoted',
            render: (v: boolean) => (v ? <Tag>โฆษณา</Tag> : '-'),
          },
        ]}
      />
    </PageContainer>
  );
}
