import { PageContainer } from '@ant-design/pro-components';
import type { Db } from '@nightlist/types';
import { Button, Space, Table } from 'antd';
import { PAGE_SIZE } from '@/configs/constants';
import { useAdminAction, useAdminView } from '@/services/adminData';
import { LoadError } from '@/ui/components/LoadError';
import { RejectButton } from '@/ui/components/RejectButton';
import { SlipImage } from '@/ui/components/SlipImage';
import { StatusTag } from '@/ui/components/StatusTag';
import { baht, dateTime } from '@/ui/utils/format';
import { PLACEMENT, PROMO_STATUS } from '@/ui/utils/labels';

/** แพ็กเกจโปรโมทที่ร้านซื้อ — ตรวจสลิปแล้วเปิดแสดง */
export function PromotionsPage() {
  const { data, isLoading, error, refetch } = useAdminView('admin_promoted_listings', {
    order: { column: 'created_at', ascending: false },
  });
  const act = useAdminAction();
  const review = (p: Db.AdminPromotedListing, approve: boolean, reason?: string) =>
    act.mutate({
      method: 'POST',
      path: `promotions/${p.id}/review`,
      body: { approve, reason },
      success: approve ? `เปิดโปรโมท ${p.bar.name} แล้ว` : `แจ้ง ${p.bar.name} ว่าสลิปไม่ผ่าน`,
    });

  return (
    <PageContainer title="โปรโมท">
      <LoadError error={error} onRetry={() => void refetch()} />
      <Table<Db.AdminPromotedListing>
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: PAGE_SIZE }}
        scroll={{ x: 1100 }}
        locale={{ emptyText: 'ยังไม่มีร้านซื้อโปรโมท' }}
        columns={[
          { title: 'ร้าน', key: 'bar', render: (_, p) => p.bar.name },
          { title: 'แพ็กเกจ', key: 'pkg', render: (_, p) => `${p.package.name} · ${p.package.duration_days} วัน` },
          { title: 'ตำแหน่ง', dataIndex: 'placement', render: (v: Db.AdminPromotedListing['placement']) => PLACEMENT[v] },
          { title: 'ราคา', dataIndex: 'price_paid', align: 'right', render: (v: number) => baht(v) },
          {
            title: 'ช่วงแสดง',
            key: 'range',
            render: (_, p) => (p.starts_at && p.ends_at ? `${dateTime(p.starts_at)} – ${dateTime(p.ends_at)}` : '-'),
          },
          {
            title: 'สลิป',
            key: 'slip',
            render: (_, p) => (p.latest_payment ? <SlipImage bucket="promo-slips" path={p.latest_payment.slip_path} /> : '-'),
          },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            filters: Object.entries(PROMO_STATUS).map(([value, l]) => ({ text: l.text, value })),
            onFilter: (v, p) => p.status === v,
            render: (s: string) => <StatusTag map={PROMO_STATUS} value={s} />,
          },
          {
            title: '',
            key: 'a',
            render: (_, p) =>
              p.status === 'PAYMENT_SUBMITTED' && (
                <Space>
                  <Button type="primary" loading={act.isPending} onClick={() => review(p, true)}>
                    สลิปผ่าน
                  </Button>
                  <RejectButton
                    label="ไม่ผ่าน"
                    title="สลิปไม่ผ่าน?"
                    loading={act.isPending}
                    onReject={(reason) => review(p, false, reason)}
                  />
                </Space>
              ),
          },
        ]}
      />
    </PageContainer>
  );
}
