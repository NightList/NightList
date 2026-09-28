import { PageContainer, StatisticCard } from '@ant-design/pro-components';
import { getState } from '@nightlist/mock';
import { useDemo } from '@/shared/useDemo';

export function DashboardPage() {
  useDemo();
  const s = getState();
  const today = s.bookings.filter(
    (b) => new Date(b.datetime).toDateString() === new Date().toDateString(),
  ).length;
  return (
    <PageContainer title="แดชบอร์ด">
      <StatisticCard.Group direction="row">
        <StatisticCard statistic={{ title: 'การจองวันนี้', value: today }} />
        <StatisticCard
          statistic={{
            title: 'ร้านรออนุมัติ',
            value: s.bars.filter((b) => b.status === 'PENDING_REVIEW').length,
          }}
        />
        <StatisticCard
          statistic={{ title: 'รีวิวถูกรายงาน', value: s.reviews.filter((r) => r.reported).length }}
        />
        <StatisticCard
          statistic={{
            title: 'สลิปโปรโมทรอตรวจ',
            value: s.promotions.filter((p) => p.status === 'PAYMENT_SUBMITTED').length,
          }}
        />
      </StatisticCard.Group>
    </PageContainer>
  );
}
