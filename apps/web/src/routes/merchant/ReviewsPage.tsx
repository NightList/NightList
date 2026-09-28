import { barReviews, setReviewReported } from '@nightlist/mock';
import { StarRating } from '@nightlist/ui';
import { App, Button, Card, Listy, Tag } from 'antd';
import { ListRow } from '@/shared/components/ListRow';
import { PageHeader } from '@/shared/components/PageHeader';
import { timeAgo } from '@/shared/lib/format';
import { useMerchantBar } from './useMerchantBar';

export function MerchantReviewsPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  const reviews = barReviews(bar.id);
  return (
    <div>
      <PageHeader
        title="รีวิว"
        subtitle={<StarRating value={bar.rating} reviewCount={bar.reviewCount} />}
      />
      <Card>
        <Listy
          items={reviews}
          rowKey="id"
          itemRender={(r) => (
            <ListRow
              actions={[
                r.reported ? (
                  <Tag key="r" color="orange">
                    รายงานแล้ว
                  </Tag>
                ) : (
                  <Button
                    key="r"
                    size="small"
                    onClick={() => {
                      setReviewReported(r.id, true);
                      message.success('ส่งให้ทีมตรวจแล้ว');
                    }}
                  >
                    รายงานรีวิว
                  </Button>
                ),
              ]}
              title={
                <span>
                  {r.userName} · <StarRating value={r.rating} size={12} showValue={false} />
                </span>
              }
              description={
                <>
                  {r.comment} · <span className="text-xs">{timeAgo(r.createdAt)}</span>
                </>
              }
            />
          )}
        />
      </Card>
    </div>
  );
}
