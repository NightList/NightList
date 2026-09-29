import { barReviews, getBarBySlug } from '@nightlist/mock';
import { Empty, Result } from 'antd';
import { Link, useParams } from 'react-router';
import { ReviewList } from '@/ui/components/reviewList';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';
import { BarRating } from '@/ui/components/barRating';

export function BarReviewsPage() {
  useDemo();
  const { slug = '' } = useParams();
  const bar = getBarBySlug(slug);
  if (!bar) return <Result status="404" title="ไม่พบร้าน" />;
  const reviews = barReviews(bar.id);
  return (
    <div>
      <PageHeader
        title={`รีวิว ${bar.name}`}
        subtitle={<BarRating bar={bar} />}
        extra={<Link to={`/bars/${bar.slug}`}>← กลับหน้าร้าน</Link>}
      />
      {reviews.length ? <ReviewList reviews={reviews} /> : <Empty description="ยังไม่มีรีวิว" />}
    </div>
  );
}
