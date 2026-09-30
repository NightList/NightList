import { WarningCircle } from '@phosphor-icons/react';
import { ThemeProvider } from '@nightlist/ui';
import { Button, Result } from 'antd';

interface BootErrorProps {
  /** config = ยังไม่ได้ตั้ง .env · load = ต่อ Supabase ไม่ได้ */
  kind: 'config' | 'load';
  onRetry?: () => void;
}

/** หน้าที่แสดงแทนแอปเมื่อยังดึงข้อมูลร้านจาก Supabase ไม่ได้ (ไม่มีร้านเดโมมาแทน) */
export function BootError({ kind, onRetry }: BootErrorProps) {
  const config = kind === 'config';
  return (
    <ThemeProvider>
      <main className="grid min-h-dvh place-items-center bg-background p-6">
        <Result
          icon={<WarningCircle size={64} weight="duotone" className="mx-auto text-gold" />}
          title={config ? 'ยังไม่ได้ตั้งค่า Supabase' : 'โหลดข้อมูลร้านไม่สำเร็จ'}
          subTitle={
            config
              ? 'ใส่ VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ในไฟล์ .env ที่ root ของโปรเจกต์ แล้วรัน pnpm dev ใหม่ (ดู docs/SUPABASE.md)'
              : 'เชื่อมต่อฐานข้อมูลไม่ได้ ลองตรวจอินเทอร์เน็ตแล้วกดลองใหม่อีกครั้ง'
          }
          extra={
            onRetry && (
              <Button type="primary" size="large" onClick={onRetry}>
                ลองใหม่
              </Button>
            )
          }
        />
      </main>
    </ThemeProvider>
  );
}
