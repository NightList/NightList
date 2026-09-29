import { Card, Steps } from 'antd';
import { PageHeader } from '@/ui/components/pageHeader';

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
