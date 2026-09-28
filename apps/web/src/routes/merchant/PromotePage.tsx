import { Megaphone } from '@phosphor-icons/react';
import { getState, orderPromotion, PROMOTION_PACKAGES } from '@nightlist/mock';
import { App, Button, Card, Table, Tag } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { baht, dateTime } from '@/shared/lib/format';
import { useMerchantBar } from './useMerchantBar';

const PLACEMENT = {
  HOME_BANNER: 'Home Banner',
  HOME_RECOMMENDED: 'ร้านแนะนำหน้าแรก',
  SEARCH_TOP: 'อันดับต้นในผลค้นหา',
};

export function MerchantPromotePage() {
  const bar = useMerchantBar();
  const { modal, message } = App.useApp();
  const orders = getState().promotions.filter((p) => p.barId === bar.id);
  return (
    <div className="space-y-6">
      <PageHeader
        title="โปรโมทร้าน"
        subtitle="ได้ป้าย “แนะนำ · โฆษณา” และตำแหน่งพิเศษ — ไม่มีผลต่อดาวหรือคะแนนรีวิว"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PROMOTION_PACKAGES.map((p) => (
          <Card key={p.id}>
            <Megaphone size={28} className="mb-2 text-gold-text" />
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-muted">{p.days} วัน</p>
            <p className="my-2 text-2xl font-bold text-gold-text">{baht(p.price)}</p>
            <Button
              block
              type="primary"
              onClick={() =>
                modal.confirm({
                  title: `ซื้อ ${p.name} ${p.days} วัน?`,
                  content:
                    'เดโม: จำลองว่าโอน PromptPay ของ NightList และส่งสลิปแล้ว — รอแอดมินอนุมัติ',
                  okText: 'ยืนยัน',
                  cancelText: 'ยกเลิก',
                  onOk: () => {
                    orderPromotion(bar.id, p.id);
                    message.success('ส่งคำสั่งซื้อแล้ว รอแอดมินตรวจสลิป');
                  },
                })
              }
            >
              ซื้อแพ็กเกจ
            </Button>
          </Card>
        ))}
      </div>
      <Card title="ประวัติการโปรโมท">
        <Table
          rowKey="id"
          dataSource={orders}
          pagination={false}
          columns={[
            { title: 'แพ็กเกจ', dataIndex: 'packageName' },
            {
              title: 'ตำแหน่ง',
              dataIndex: 'placement',
              render: (v: keyof typeof PLACEMENT) => PLACEMENT[v],
            },
            { title: 'ราคา', dataIndex: 'price', render: (v: number) => baht(v) },
            { title: 'สั่งเมื่อ', dataIndex: 'createdAt', render: (v: string) => dateTime(v) },
            {
              title: 'สถานะ',
              dataIndex: 'status',
              render: (s: string) => (
                <Tag color={s === 'ACTIVE' ? 'green' : s === 'REJECTED' ? 'red' : 'gold'}>
                  {
                    {
                      ACTIVE: 'กำลังแสดง',
                      PAYMENT_SUBMITTED: 'รอตรวจสลิป',
                      REJECTED: 'ไม่ผ่าน',
                      EXPIRED: 'หมดอายุ',
                    }[s]
                  }
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
