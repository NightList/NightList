import { PageContainer } from '@ant-design/pro-components';
import { getBar, platformDeposits, reviewDeposit, settleDeposit } from '@nightlist/mock';
import { App, Button, Image, Space, Statistic, Table, Tabs, Tag } from 'antd';
import { baht, dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN } from '@/configs/constants';

const SETTLEMENT: Record<string, { label: string; color: string }> = {
  HELD: { label: 'ถือไว้', color: 'blue' },
  PAYOUT_PENDING: { label: 'รอโอนให้ร้าน', color: 'gold' },
  PAID_OUT: { label: 'โอนแล้ว', color: 'green' },
  CREDIT: { label: 'เครดิตร้าน', color: 'purple' },
  REFUNDED: { label: 'คืนลูกค้า', color: 'default' },
};

/**
 * /deposits — เงินมัดจำทั้งระบบ (เงินเข้า NightList)
 * 1) ตรวจสลิปที่ลูกค้าโอนเข้า PromptPay ของเรา → ยืนยันโต๊ะ
 * 2) หลังลูกค้าเช็กอิน/ไม่มา → โอนให้ร้านตามบัญชีที่ร้านตั้งไว้ หรือเก็บเป็นเครดิตร้าน
 */
export function DepositsPage() {
  useDemo();
  const { message } = App.useApp();
  const d = platformDeposits();
  const sum = (rows: typeof d.held) => rows.reduce((a, b) => a + (b.deposit?.amount ?? 0), 0);

  const base = [
    { title: 'รหัสจอง', dataIndex: 'code', width: 110 },
    { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
    { title: 'ลูกค้า', dataIndex: 'userName' },
    { title: 'วันที่จอง', dataIndex: 'datetime', render: (v: string) => dateTime(v) },
    {
      title: 'ยอด',
      align: 'right' as const,
      render: (_: unknown, b: (typeof d.held)[number]) => baht(b.deposit!.amount),
    },
  ];

  return (
    <PageContainer
      title="เงินมัดจำ"
      subTitle="ลูกค้าโอนเข้า PromptPay ของ NightList · เราถือไว้จนเช็กอิน แล้วส่งต่อให้ร้าน"
      extra={
        <Space size="large">
          <Statistic title="รอตรวจสลิป" value={d.toVerify.length} suffix="รายการ" />
          <Statistic title="ถือไว้" value={sum(d.held)} prefix="฿" />
          <Statistic title="รอโอนให้ร้าน" value={sum(d.toPayout)} prefix="฿" />
        </Space>
      }
    >
      <Tabs
        items={[
          {
            key: 'verify',
            label: `ตรวจสลิป (${d.toVerify.length})`,
            children: (
              <Table
                rowKey="id"
                dataSource={d.toVerify}
                columns={[
                  ...base,
                  {
                    title: 'สลิป',
                    render: (_, b) =>
                      b.deposit?.slipDataUrl ? (
                        <Image src={b.deposit.slipDataUrl} alt="สลิป" height={64} />
                      ) : (
                        <span className="text-xs text-muted">(ตัวอย่าง — ไม่มีรูป)</span>
                      ),
                  },
                  { title: 'ส่งเมื่อ', render: (_, b) => dateTime(b.deposit!.submittedAt) },
                  {
                    title: '',
                    key: 'a',
                    render: (_, b) => (
                      <Space>
                        <Button
                          type="primary"

                          onClick={() => {
                            reviewDeposit(b.id, true, ADMIN);
                            message.success('ยืนยันโต๊ะให้ลูกค้าแล้ว');
                          }}
                        >
                          สลิปผ่าน
                        </Button>
                        <Button
                          danger

                          onClick={() => {
                            reviewDeposit(b.id, false, ADMIN);
                            message.info('แจ้งลูกค้าให้ส่งสลิปใหม่');
                          }}
                        >
                          ไม่ผ่าน
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: 'payout',
            label: `รอโอนให้ร้าน (${d.toPayout.length})`,
            children: (
              <Table
                rowKey="id"
                dataSource={d.toPayout}
                columns={[
                  ...base,
                  {
                    title: 'บัญชีร้าน',
                    render: (_, b) => {
                      const bar = getBar(b.barId);
                      return bar
                        ? `${bar.payout.bankName} ${bar.payout.accountNo} (${bar.payout.accountName})`
                        : '-';
                    },
                  },
                  {
                    title: 'ผล',
                    render: (_, b) =>
                      b.status === 'NO_SHOW' ? (
                        <Tag color="red">ไม่มาตามนัด</Tag>
                      ) : (
                        <Tag color="green">เช็กอินแล้ว</Tag>
                      ),
                  },
                  {
                    title: '',
                    key: 'a',
                    render: (_, b) => (
                      <Space>
                        <Button
                          type="primary"

                          onClick={() => {
                            settleDeposit(b.id, 'PAID_OUT', ADMIN);
                            message.success('บันทึกว่าโอนให้ร้านแล้ว');
                          }}
                        >
                          โอนให้ร้านแล้ว
                        </Button>
                        <Button
                          onClick={() => {
                            settleDeposit(b.id, 'CREDIT', ADMIN);
                            message.success('เก็บเป็นเครดิตร้านแล้ว');
                          }}
                        >
                          เก็บเป็นเครดิต
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: 'held',
            label: `ถือไว้ (${d.held.length})`,
            children: (
              <Table
                rowKey="id"
                dataSource={d.held}
                columns={[
                  ...base,
                  {
                    title: 'ตรวจเมื่อ',
                    render: (_, b) => dateTime(b.deposit!.verifiedAt ?? b.deposit!.submittedAt),
                  },
                ]}
              />
            ),
          },
          {
            key: 'settled',
            label: `จบแล้ว (${d.settled.length})`,
            children: (
              <Table
                rowKey="id"
                dataSource={d.settled}
                columns={[
                  ...base,
                  {
                    title: 'สถานะ',
                    render: (_, b) => (
                      <Tag color={SETTLEMENT[b.deposit!.settlement!]!.color}>
                        {SETTLEMENT[b.deposit!.settlement!]!.label}
                      </Tag>
                    ),
                  },
                  {
                    title: 'เมื่อ',
                    render: (_, b) => dateTime(b.deposit!.settledAt ?? b.deposit!.submittedAt),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </PageContainer>
  );
}
