import type { ThemeMode } from '@nightlist/types';
import { useThemeMode } from '@nightlist/ui';
import { resetDemo } from '@nightlist/mock';
import { App, Button, Card, Segmented } from 'antd';
import { useNavigate } from 'react-router';
import { useAuth } from '@/shared/auth/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';

export function SettingsPage() {
  const { mode, setMode } = useThemeMode();
  const { isDemo, signOut } = useAuth();
  const { modal, message } = App.useApp();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="ตั้งค่า" />
      <Card title="ธีม">
        <Segmented<ThemeMode>
          value={mode}
          onChange={setMode}
          options={[
            { label: '🌙 มืด', value: 'DARK' },
            { label: '☀️ สว่าง', value: 'LIGHT' },
            { label: '💻 ตามระบบ', value: 'SYSTEM' },
          ]}
        />
        <p className="mt-3 text-sm text-muted">
          การลดการเคลื่อนไหว (motion) ใช้ตามการตั้งค่าของอุปกรณ์
        </p>
      </Card>
      <Card title="ความเป็นส่วนตัว">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={async () => {
              await signOut();
              message.success('ออกจากระบบทุกอุปกรณ์แล้ว');
              navigate('/');
            }}
          >
            ออกจากระบบทุกอุปกรณ์
          </Button>
          <Button
            danger
            onClick={() =>
              modal.confirm({
                title: 'ลบบัญชี?',
                content: 'ข้อมูลการจองและรีวิวจะถูกลบตามนโยบาย (เดโม: รีเซ็ตข้อมูลในเบราว์เซอร์)',
                okText: 'ลบบัญชี',
                okButtonProps: { danger: true },
                cancelText: 'ยกเลิก',
                onOk: async () => {
                  await signOut();
                  if (isDemo) resetDemo();
                  navigate('/');
                },
              })
            }
          >
            ลบบัญชี
          </Button>
        </div>
      </Card>
    </div>
  );
}
