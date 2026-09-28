import { barBookings } from '@nightlist/mock';
import { StarRating, TierBadge } from '@nightlist/ui';
import { Button, Card, Col, Row, Statistic, Table } from 'antd';
import { Link } from 'react-router';
import { BookingStatusTag } from '@/features/booking/BookingStatusTag';
import { CrowdBadge } from '@/features/bars/CrowdBadge';
import { PageHeader } from '@/shared/components/PageHeader';
import { dateTime } from '@/shared/lib/format';
import { useMerchantBar } from './useMerchantBar';

export function MerchantDashboardPage() {
  const bar = useMerchantBar();
  const all = barBookings(bar.id);
  const today = all.filter(
    (b) => new Date(b.datetime).toDateString() === new Date().toDateString(),
  );
  const done = all.filter((b) => ['CHECKED_IN', 'COMPLETED', 'NO_SHOW'].includes(b.status));
  const showRate = done.length
    ? Math.round((done.filter((b) => b.status !== 'NO_SHOW').length / done.length) * 100)
    : 100;
  const pending = all.filter((b) => ['PENDING', 'DEPOSIT_SUBMITTED'].includes(b.status));

  return (
    <div>
      <PageHeader
        title="แดชบอร์ด"
        subtitle={<CrowdBadge crowd={bar.crowd} updatedAt={bar.crowdUpdatedAt} showTime />}
        extra={
          <Link to="/merchant/tonight">
            <Button type="primary">เปิด Scanner คืนนี้</Button>
          </Link>
        }
      />
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="จองวันนี้" value={today.length} suffix="โต๊ะ" />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="รอดำเนินการ"
              value={pending.length}
              styles={{ content: { color: 'var(--gold-text)' } }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="อัตรามาตามนัด" value={showRate} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <p className="mb-1 text-sm text-muted">ดาว / Tier</p>
            <div className="flex items-center gap-2">
              {bar.tier && <TierBadge tier={bar.tier} />}
              <StarRating value={bar.rating} size={14} />
            </div>
          </Card>
        </Col>
      </Row>
      <Card
        title="การจองวันนี้"
        className="!mt-6"
        extra={<Link to="/merchant/bookings">ทั้งหมด →</Link>}
      >
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={today}
          locale={{ emptyText: 'ยังไม่มีการจองวันนี้' }}
          columns={[
            { title: 'เวลา', dataIndex: 'datetime', render: (v: string) => dateTime(v) },
            { title: 'ลูกค้า', dataIndex: 'userName' },
            { title: 'คน', dataIndex: 'pax', width: 60 },
            { title: 'สถานะ', dataIndex: 'status', render: (s) => <BookingStatusTag status={s} /> },
          ]}
        />
      </Card>
    </div>
  );
}
