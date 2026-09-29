import { updateBar } from '@nightlist/mock';
import { App, Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { PageHeader } from '@/ui/components/pageHeader';
import { useMerchantBar } from '@/hooks/useMerchantBar';

const BANKS = ['กสิกรไทย', 'ไทยพาณิชย์', 'กรุงเทพ', 'กรุงไทย', 'กรุงศรี', 'ทหารไทยธนชาต', 'ออมสิน', 'อื่นๆ'];

/** /merchant/settings — มัดจำ (เก็บทุกการจอง) · บัญชีรับเงิน · PR ประจำร้าน · เก็บโต๊ะ */
export function MerchantSettingsPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  return (
    <div>
      <PageHeader title="ตั้งค่าการจอง" />
      <Form
        layout="vertical"
        initialValues={{
          ...bar.deposit,
          ...bar.payout,
          prMale: bar.pr.male,
          prFemale: bar.pr.female,
          gracePeriodMinutes: bar.gracePeriodMinutes,
        }}
        onFinish={(v) => {
          updateBar(bar.id, {
            deposit: { amount: v.amount, unit: v.unit, policy: v.policy },
            payout: { bankName: v.bankName, accountNo: v.accountNo, accountName: v.accountName },
            pr: { male: v.prMale ?? 0, female: v.prFemale ?? 0 },
            gracePeriodMinutes: v.gracePeriodMinutes,
          });
          message.success('บันทึกแล้ว');
        }}
      >
        <Card title="มัดจำ (เก็บทุกการจอง)" className="!mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="amount" label="ยอดมัดจำ" rules={[{ required: true }]}>
              <InputNumber className="!w-full" min={100} step={100} suffix="฿" />
            </Form.Item>
            <Form.Item name="unit" label="คิดต่อ">
              <Select
                options={[
                  { label: 'ต่อโต๊ะ', value: 'PER_TABLE' },
                  { label: 'ต่อคน', value: 'PER_PERSON' },
                ]}
              />
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
            ลูกค้าโอนมัดจำเข้า NightList · เราตรวจสลิปและถือเงินไว้ · เมื่อลูกค้าเช็กอิน (หรือไม่มาตามนัด)
            เงินเป็นของร้าน แล้วเราโอนเข้าบัญชีด้านล่าง หรือเก็บเป็นเครดิตร้านตามที่ตกลง
          </p>
        </Card>

        <Card title="บัญชีรับเงินมัดจำ" className="!mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Form.Item name="bankName" label="ธนาคาร" rules={[{ required: true }]}>
              <Select options={BANKS.map((b) => ({ label: b, value: b }))} />
            </Form.Item>
            <Form.Item
              name="accountNo"
              label="เลขบัญชี"
              rules={[{ required: true, pattern: /^\d{10,15}$/, message: 'ตัวเลข 10–15 หลัก' }]}
            >
              <Input inputMode="numeric" />
            </Form.Item>
            <Form.Item name="accountName" label="ชื่อบัญชี" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="PR ประจำร้าน" className="!mb-6">
          <p className="mb-4 text-sm text-muted">
            ลูกค้าเห็นในหน้าร้านว่ามี PR ไหม และเป็นชาย/หญิงกี่คน · ใส่ 0 ทั้งคู่ถ้าไม่มี
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="prMale" label="PR ชาย (คน)">
              <InputNumber className="!w-full" min={0} max={99} />
            </Form.Item>
            <Form.Item name="prFemale" label="PR หญิง (คน)">
              <InputNumber className="!w-full" min={0} max={99} />
            </Form.Item>
          </div>
        </Card>

        <Card title="การเก็บโต๊ะ" className="!mb-6">
          <Form.Item
            name="gracePeriodMinutes"
            label="เก็บโต๊ะหลังเวลาจอง (Grace period)"
            extra="เลยเวลานี้ไม่มาเช็กอิน → ระบบเปลี่ยนเป็นไม่มาตามนัดอัตโนมัติ และมัดจำตกเป็นของร้าน"
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
