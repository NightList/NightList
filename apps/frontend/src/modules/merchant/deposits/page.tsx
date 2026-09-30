import { barLedger } from '@nightlist/mock';
import { Card, Col, Empty, Row, Statistic, Table, Tag } from 'antd';
import { PageHeader } from '@/ui/components/pageHeader';
import { SETTLEMENT_LABEL } from '@/ui/components/depositCard';
import { baht, dateTime } from '@/ui/utils/format';
import { useMerchantBar } from '@/hooks/useMerchantBar';

/**
 * /merchant/deposits — เงินมัดจำของร้าน
 * ลูกค้าโอนเข้า NightList · แพลตฟอร์มตรวจสลิปและถือเงินไว้ · ลูกค้าเช็กอิน/ไม่มา → เงินเป็นของร้าน
 * แล้ว NightList โอนเข้าบัญชีร้าน หรือเก็บเป็นเครดิตร้านตามที่ตกลง
 */
export function MerchantDepositsPage() {
  const bar = useMerchantBar();
  const ledger = barLedger(bar.id);
  return (
    <div>
      <PageHeader
        title="เงินมัดจำ"
        subtitle={`โอนเข้า ${bar.payout.bankName} ${bar.payout.accountNo} (${bar.payout.accountName}) · แก้ได้ที่ตั้งค่าการจอง`}
      />
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="NightList ถือไว้ (ยังไม่เช็กอิน)" value={ledger.held} prefix="฿" />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="รอโอนให้ร้าน"
              value={ledger.payoutPending}
              prefix="฿"
              styles={{ content: { color: 'var(--gold-text)' } }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="โอนแล้ว" value={ledger.paidOut} prefix="฿" />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="เครดิตในร้าน" value={ledger.credit} prefix="฿" />
          </Card>
        </Col>
      </Row>
      {ledger.rows.length === 0 ? (
        <Empty description="ยังไม่มีมัดจำ" />
      ) : (
        <Table
          rowKey="id"

          pagination={{ pageSize: 20 }}
          dataSource={ledger.rows}
          columns={[
            { title: 'รหัสจอง', dataIndex: 'code', width: 110 },
            { title: 'ลูกค้า', dataIndex: 'userName' },
            { title: 'วันที่จอง', dataIndex: 'datetime', render: (v: string) => dateTime(v) },
            {
              title: 'ยอด',
              align: 'right',
              render: (_, b) => baht(b.deposit!.amount),
            },
            {
              title: 'สถานะเงิน',
              render: (_, b) => (
                <Tag color={SETTLEMENT_LABEL[b.deposit!.settlement!].color}>
                  {SETTLEMENT_LABEL[b.deposit!.settlement!].label}
                </Tag>
              ),
            },
            {
              title: 'อัปเดต',
              render: (_, b) =>
                dateTime(b.deposit!.settledAt ?? b.deposit!.verifiedAt ?? b.deposit!.submittedAt),
            },
          ]}
        />
      )}
    </div>
  );
}
