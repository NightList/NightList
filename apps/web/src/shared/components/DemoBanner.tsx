import { Flask } from '@phosphor-icons/react';
import { resetDemo } from '@nightlist/mock';
import { App, Button } from 'antd';
import { useAuth } from '@/shared/auth/AuthProvider';

/** แถบแจ้งว่าอยู่ในโหมดเดโม (ยังไม่ได้ต่อ Supabase) */
export function DemoBanner() {
  const { isDemo } = useAuth();
  const { modal } = App.useApp();
  if (!isDemo) return null;
  return (
    <div className="flex items-center justify-center gap-2 border-b border-border bg-purple/15 px-4 py-1.5 text-xs text-muted">
      <Flask size={14} className="text-purple" />
      <span>โหมดเดโม · ข้อมูลร้านเป็นข้อมูลสมมติ เก็บในเบราว์เซอร์นี้เท่านั้น</span>
      <Button
        size="small"
        type="link"
        className="!h-auto !p-0 !text-xs"
        onClick={() =>
          modal.confirm({
            title: 'รีเซ็ตข้อมูลเดโม?',
            content: 'การจอง รีวิว และการแก้ไขทั้งหมดในเบราว์เซอร์นี้จะกลับเป็นค่าเริ่มต้น',
            okText: 'รีเซ็ต',
            cancelText: 'ยกเลิก',
            onOk: () => resetDemo(),
          })
        }
      >
        รีเซ็ต
      </Button>
    </div>
  );
}
