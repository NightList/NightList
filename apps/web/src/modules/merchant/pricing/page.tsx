import { updateBar } from '@nightlist/mock';
import { App, Button, Card, Form, InputNumber, Table } from 'antd';
import { PageHeader } from '@/ui/components/pageHeader';
import { baht } from '@/ui/utils/format';
import { useMerchantBar } from '@/hooks/useMerchantBar';

export function MerchantPricingPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  return (
    <div className="space-y-6">
      <PageHeader
        title="ค่าธรรมเนียม + แพ็กเกจ"
        subtitle="แสดงให้ลูกค้าเห็นก่อนจอง เพื่อไม่ให้มีเซอร์ไพรส์ตอนเช็กบิล"
      />
      <Card title="ค่าธรรมเนียม">
        <Form
          layout="inline"
          initialValues={bar.fees}
          onFinish={(fees) => {
            updateBar(bar.id, { fees });
            message.success('บันทึกแล้ว');
          }}
          className="gap-y-3"
        >
          <Form.Item name="serviceChargeRate" label="Service charge">
            <InputNumber min={0} max={30} suffix="%" />
          </Form.Item>
          <Form.Item name="vatRate" label="VAT">
            <InputNumber min={0} max={10} suffix="%" />
          </Form.Item>
          <Form.Item name="otherFees" label="ค่าเปิดขวด / ค่าเข้า">
            <InputNumber min={0} suffix="฿" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            บันทึก
          </Button>
        </Form>
      </Card>
      <Card title="แพ็กเกจโต๊ะ">
        <Table
          rowKey="id"
          pagination={false}
          dataSource={bar.packages}
          columns={[
            { title: 'ชื่อ', dataIndex: 'name' },
            { title: 'จำนวนคน', key: 'pax', render: (_, p) => `${p.paxMin}–${p.paxMax}` },
            {
              title: 'รายการ',
              key: 'items',
              render: (_, p) =>
                p.items
                  .map(
                    (i) =>
                      `${bar.menu.find((m) => m.id === i.menuItemId)?.name ?? '?'} ×${i.quantity}`,
                  )
                  .join(', '),
            },
            {
              title: 'ราคาแพ็กเกจ',
              dataIndex: 'totalPrice',
              render: (v: number, p) => (
                <InputNumber
                  size="small"
                  defaultValue={v}
                  min={0}
                  suffix="฿"
                  onBlur={(e) =>
                    updateBar(bar.id, {
                      packages: bar.packages.map((x) =>
                        x.id === p.id ? { ...x, totalPrice: Number(e.target.value) } : x,
                      ),
                    })
                  }
                />
              ),
            },
          ]}
        />
        <p className="mt-3 text-xs text-muted">
          ราคาแพ็กเกจยังไม่รวม SC/VAT · ตอนลูกค้าจองระบบจะเก็บ snapshot ราคา ณ เวลานั้น ·
          ห้ามทำโปรลด/แถมเครื่องดื่มแอลกอฮอล์ (ตัวอย่าง: {baht(bar.packages[0]?.totalPrice ?? 0)})
        </p>
      </Card>
    </div>
  );
}
