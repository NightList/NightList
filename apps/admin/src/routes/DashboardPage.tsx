import { PageContainer, StatisticCard } from '@ant-design/pro-components';

export function DashboardPage() {
  return (
    <PageContainer title="แดชบอร์ด">
      <StatisticCard.Group direction="row">
        <StatisticCard statistic={{ title: 'การจองวันนี้', value: 0 }} />
        <StatisticCard statistic={{ title: 'ร้านรออนุมัติ', value: 0 }} />
        <StatisticCard statistic={{ title: 'รีวิวถูกรายงาน', value: 0 }} />
        <StatisticCard statistic={{ title: 'สลิปโปรโมทรอตรวจ', value: 0 }} />
      </StatisticCard.Group>
    </PageContainer>
  );
}
