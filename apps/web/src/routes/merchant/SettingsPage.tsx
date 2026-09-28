import { updateBar } from '@nightlist/mock';
import { App, Button, Card, Form, Input, InputNumber, Select, Switch } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { useMerchantBar } from './useMerchantBar';

export function MerchantSettingsPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  return (
    <div>
      <PageHeader title="ตั้งค่าการจอง" />
      <Form
        layout="vertical"
        initialValues={{ ...bar.deposit, gracePeriodMinutes: bar.gracePeriodMinutes }}
        onFinish={(v) => {
          updateBar(bar.id, {
            deposit: {
              enabled: v.enabled,
              amount: v.amount,
              unit: v.unit,
              promptpayId: v.promptpayId,
              policy: v.policy,
            },
            gracePeriodMinutes: v.gracePeriodMinutes,
          });
          message.success('บันทึกแล้ว');
        }}
      >
        <Card title="มัดจำ" className="!mb-6">
          <Form.Item name="enabled" label="เปิดรับมัดจำ" valuePropName="checked">
            <Switch />
          </Form.Item>
          <div className="grid gap-4 md:grid-cols-3">
            <Form.Item name="amount" label="ยอดมัดจำ">
              <InputNumber className="!w-full" min={0} step={100} suffix="฿" />
            </Form.Item>
            <Form.Item name="unit" label="คิดต่อ">
              <Select
                options={[
                  { label: 'ต่อโต๊ะ', value: 'PER_TABLE' },
                  { label: 'ต่อคน', value: 'PER_PERSON' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="promptpayId"
              label="PromptPay ของร้าน"
              rules={[{ pattern: /^\d{10}(\d{3})?$/, message: 'เบอร์ 10 หลัก หรือเลข 13 หลัก' }]}
            >
              <Input inputMode="numeric" />
            </Form.Item>
          </div>
          <Form.Item
            name="policy"
            label="นโยบายมัดจำ (ลูกค้าเห็นก่อนโอน)"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <p className="text-xs text-muted">
            เงินมัดจำโอนเข้าบัญชีร้านโดยตรง แพลตฟอร์มไม่ได้ถือเงินลูกค้า
          </p>
        </Card>
        <Card title="การเก็บโต๊ะ" className="!mb-6">
          <Form.Item
            name="gracePeriodMinutes"
            label="เก็บโต๊ะหลังเวลาจอง (Grace period)"
            extra="เลยเวลานี้ไม่มาเช็กอิน → ระบบเปลี่ยนเป็นไม่มาตามนัดอัตโนมัติ"
          >
            <Select options={[15, 30, 45, 60].map((m) => ({ label: `${m} นาที`, value: m }))} />
          </Form.Item>
        </Card>
        <Button type="primary" htmlType="submit" size="large">
          บันทึก
        </Button>
      </Form>
    </div>
  );
}
