import { barReviews, getBarBySlug } from '@nightlist/mock';
import { StarRating } from '@nightlist/ui';
import { Empty, Result } from 'antd';
import { Link, useParams } from 'react-router';
import { ReviewList } from '@/ui/components/reviewList';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';

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
        subtitle={<StarRating value={bar.rating} reviewCount={bar.reviewCount} />}
        extra={<Link to={`/bars/${bar.slug}`}>← กลับหน้าร้าน</Link>}
      />
      {reviews.length ? <ReviewList reviews={reviews} /> : <Empty description="ยังไม่มีรีวิว" />}
    </div>
  );
}
