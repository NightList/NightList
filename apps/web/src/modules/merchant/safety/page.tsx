import { SealCheck } from '@phosphor-icons/react';
import { SAFETY_LABELS, updateBar, type SafetyValue } from '@nightlist/mock';
import { App, Card, Segmented, Upload, Button } from 'antd';
import { PageHeader } from '@/ui/components/pageHeader';
import { useMerchantBar } from '@/hooks/useMerchantBar';

export function MerchantSafetyPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  return (
    <div>
      <PageHeader
        title="ความปลอดภัย"
        subtitle="ข้อมูลที่ร้านแจ้งเองจะแสดงป้าย “ร้านแจ้ง” จนกว่าทีม NightList จะตรวจหลักฐาน"
      />
      <Card>
        <ul className="divide-y divide-border">
          {bar.safety.map((s) => (
            <li key={s.key} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex-1">{SAFETY_LABELS[s.key]}</span>
              {s.source === 'ADMIN_VERIFIED' && (
                <span className="flex items-center gap-1 text-xs text-gold-text">
                  <SealCheck weight="fill" /> ยืนยันแล้ว
                </span>
              )}
              <Segmented<SafetyValue>
                value={s.value}
                onChange={(value) => {
                  updateBar(bar.id, {
                    safety: bar.safety.map((x) =>
                      x.key === s.key ? { ...x, value, source: 'SELF_DECLARED' } : x,
                    ),
                  });
                  message.success('บันทึกแล้ว (รอทีมตรวจสอบ)');
                }}
                options={[
                  { label: 'มี', value: 'YES' },
                  { label: 'ไม่มี', value: 'NO' },
                  { label: 'ไม่ระบุ', value: 'UNKNOWN' },
                ]}
              />
              <Upload
                beforeUpload={() => {
                  message.info('เดโม: แนบหลักฐานแล้ว');
                  return false;
                }}
                showUploadList={false}
              >
                <Button size="small">แนบหลักฐาน</Button>
              </Upload>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
