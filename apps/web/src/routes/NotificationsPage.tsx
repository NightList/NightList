import { Bell } from '@phosphor-icons/react';
import { markAllRead, myNotifications } from '@nightlist/mock';
import { Badge, Button, Empty, Listy } from 'antd';
import { ListRow } from '@/shared/components/ListRow';
import { Link } from 'react-router';
import { PageHeader } from '@/shared/components/PageHeader';
import { useDemo } from '@/shared/data/useDemo';
import { timeAgo } from '@/shared/lib/format';

export function NotificationsPage() {
  useDemo();
  const items = myNotifications();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="แจ้งเตือน"
        extra={<Button onClick={markAllRead}>อ่านทั้งหมดแล้ว</Button>}
      />
      {items.length === 0 ? (
        <Empty description="ยังไม่มีแจ้งเตือน" />
      ) : (
        <Listy
          items={items}
          rowKey="id"
          itemRender={(n) => (
            <ListRow
              avatar={
                <Badge dot={!n.readAt}>
                  <Bell size={22} className="text-gold-text" />
                </Badge>
              }
              title={n.link ? <Link to={n.link}>{n.title}</Link> : n.title}
              description={
                <>
                  {n.body} · <span className="text-xs">{timeAgo(n.createdAt)}</span>
                </>
              }
            />
          )}
        />
      )}
    </div>
  );
}
