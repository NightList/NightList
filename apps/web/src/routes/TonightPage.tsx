import { QrCode } from '@phosphor-icons/react';
import { getAntdTheme } from '@nightlist/ui';
import { Button, ConfigProvider, Segmented } from 'antd';

/** /merchant/tonight — Staff Scanner (บังคับ Dark เสมอ ไม่สนธีมที่ผู้ใช้เลือก) */
export function TonightPage() {
  return (
    <ConfigProvider theme={getAntdTheme('dark')}>
      <div className="dark min-h-[70dvh] rounded-3xl bg-background p-6 text-text">
        <h1 className="mb-6 font-display text-2xl">คืนนี้</h1>
        <Button type="primary" size="large" block className="!h-20 !text-lg" icon={<QrCode size={32} />}>
          สแกน QR เช็กอิน
        </Button>
        <p className="mb-2 mt-8 text-muted">สถานะร้านตอนนี้</p>
        <Segmented
          block
          size="large"
          options={[
            { label: '🟢 ว่าง', value: 'AVAILABLE' },
            { label: '🟡 ใกล้เต็ม', value: 'ALMOST_FULL' },
            { label: '🔴 เต็ม', value: 'FULL' },
          ]}
        />
      </div>
    </ConfigProvider>
  );
}
