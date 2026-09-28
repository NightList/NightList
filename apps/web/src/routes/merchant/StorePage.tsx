import { DISTRICTS, STYLES, updateBar } from '@nightlist/mock';
import { App, Button, Card, Form, Input, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '@/shared/auth/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';
import { useMerchantBar } from './useMerchantBar';

const DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export function MerchantStorePage() {
  const bar = useMerchantBar();
  const { user } = useAuth();
  const { message } = App.useApp();
  return (
    <div>
      <PageHeader
        title="ข้อมูลร้าน"
        subtitle="ข้อความต้องเป็นข้อมูลร้าน ห้ามชักชวนให้ดื่ม (ดูนโยบายถ้อยคำ)"
      />
      <Form
        layout="vertical"
        initialValues={{
          ...bar,
          instagram: bar.links.find((l) => l.type === 'INSTAGRAM')?.url,
          tiktok: bar.links.find((l) => l.type === 'TIKTOK')?.url,
          hours: bar.hours.map((h) => ({
            closed: !!h.closed,
            range: [dayjs(h.open, 'HH:mm'), dayjs(h.close, 'HH:mm')],
          })),
        }}
        onFinish={(v) => {
          updateBar(
            bar.id,
            {
              name: v.name,
              description: v.description,
              address: v.address,
              district: v.district,
              styles: v.styles,
              links: [
                ...(v.instagram ? [{ type: 'INSTAGRAM' as const, url: v.instagram }] : []),
                ...(v.tiktok ? [{ type: 'TIKTOK' as const, url: v.tiktok }] : []),
              ],
              hours: v.hours.map(
                (h: { closed: boolean; range: [dayjs.Dayjs, dayjs.Dayjs] }, day: number) => ({
                  day,
                  closed: h.closed,
                  open: h.range[0].format('HH:mm'),
                  close: h.range[1].format('HH:mm'),
                }),
              ),
            },
            user?.email,
          );
          message.success('บันทึกข้อมูลร้านแล้ว');
        }}
      >
        <Card title="ข้อมูลทั่วไป" className="!mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="name" label="ชื่อร้าน" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="district" label="ย่าน">
              <Select options={DISTRICTS.map((d) => ({ label: d, value: d }))} />
            </Form.Item>
          </div>
          <Form.Item name="address" label="ที่อยู่">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="คำอธิบายร้าน">
            <Input.TextArea rows={3} maxLength={400} showCount />
          </Form.Item>
          <Form.Item name="styles" label="สไตล์">
            <Select mode="multiple" options={STYLES.map((s) => ({ label: s, value: s }))} />
          </Form.Item>
        </Card>
        <Card title="เวลาเปิด-ปิด" className="!mb-6">
          <Form.List name="hours">
            {(fields) =>
              fields.map((f, i) => (
                <div key={f.key} className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="w-24">{DAYS[i]}</span>
                  <Form.Item name={[f.name, 'range']} noStyle>
                    <TimePicker.RangePicker format="HH:mm" minuteStep={15} order={false} />
                  </Form.Item>
                  <Form.Item name={[f.name, 'closed']} valuePropName="checked" noStyle>
                    <Switch checkedChildren="ปิด" unCheckedChildren="เปิด" />
                  </Form.Item>
                </div>
              ))
            }
          </Form.List>
          <p className="text-xs text-muted">รองรับปิดข้ามเที่ยงคืน เช่น 18:00–02:00</p>
        </Card>
        <Card title="ลิงก์โซเชียล (แสดงเป็นลิงก์เท่านั้น)" className="!mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="instagram" label="Instagram" rules={[{ type: 'url' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tiktok" label="TikTok" rules={[{ type: 'url' }]}>
              <Input />
            </Form.Item>
          </div>
        </Card>
        <Button type="primary" htmlType="submit" size="large">
          บันทึก
        </Button>
      </Form>
    </div>
  );
}
