import { CATEGORY_LABELS, DISTRICTS } from '@nightlist/mock';
import { App, Button, Card, Form, Input, Select, Steps } from 'antd';
import { useNavigate } from 'react-router';
import { PageHeader } from '@/shared/components/PageHeader';

/** /merchant/join — สมัครเป็นร้าน → ส่งตรวจ */
export function MerchantJoinPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="สมัครเป็นร้านค้า"
        subtitle="ใช้ฟรีช่วงทดลอง · เก็บค่าคอมเฉพาะการจองที่ลูกค้ามาจริง"
      />
      <Steps
        className="mb-6"
        current={0}
        items={[{ title: 'ข้อมูลร้าน' }, { title: 'ทีมตรวจสอบ' }, { title: 'เปิดใช้งาน' }]}
      />
      <Card>
        <Form
          layout="vertical"
          size="large"
          onFinish={() => {
            message.success('ส่งข้อมูลแล้ว');
            navigate('/merchant/status');
          }}
        >
          <Form.Item name="name" label="ชื่อร้าน" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item name="category" label="ประเภท" rules={[{ required: true }]}>
              <Select
                options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
            <Form.Item name="district" label="ย่าน" rules={[{ required: true }]}>
              <Select options={DISTRICTS.map((d) => ({ label: d, value: d }))} />
            </Form.Item>
          </div>
          <Form.Item name="address" label="ที่อยู่" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="license"
            label="เลขใบอนุญาตสถานบริการ / ทะเบียนพาณิชย์"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            ส่งให้ทีมตรวจ
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export function MerchantStatusPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="สถานะการตรวจสอบ" />
      <Card>
        <Steps
          orientation="vertical"
          current={1}
          items={[
            { title: 'ส่งข้อมูลแล้ว', content: 'DRAFT → PENDING_REVIEW' },
            { title: 'ทีมกำลังตรวจสอบ', content: 'ปกติใช้เวลา 1–2 วันทำการ' },
            { title: 'อนุมัติ & เปิดหน้าร้าน' },
          ]}
        />
      </Card>
    </div>
  );
}
