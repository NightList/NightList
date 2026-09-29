import { UploadSimple } from '@phosphor-icons/react';
import { depositFor, getBar, getBooking, PLATFORM, promptPayPayload, submitDeposit } from '@nightlist/mock';
import { Alert, App, Button, Card, Result, Upload } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';
import { baht } from '@/ui/utils/format';

/** ย่อรูปสลิปก่อนเก็บ (เดโมเก็บใน localStorage) */
function toSmallDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 480 / img.width);
      const c = document.createElement('canvas');
      c.width = img.width * scale;
      c.height = img.height * scale;
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.7));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** /bookings/:id/deposit — โอน PromptPay เข้า NightList (แพลตฟอร์มถือเงินไว้ให้) + อัปโหลดสลิป */
export function DepositPage() {
  useDemo();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [slip, setSlip] = useState<string>();
  const b = getBooking(id);
  const bar = b ? getBar(b.barId) : null;
  if (!b || !bar) return <Result status="404" title="ไม่พบการจอง" />;
  const amount = depositFor(bar, b.pax);
  if (b.status !== 'AWAITING_DEPOSIT') {
    return (
      <Result
        status="info"
        title="การจองนี้ไม่ต้องจ่ายมัดจำแล้ว"
        extra={<Button onClick={() => navigate(`/bookings/${b.id}`)}>ดูบัตรจอง</Button>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="จ่ายมัดจำ" subtitle={`${bar.name} · รหัสจอง ${b.code}`} />
      <Card>
        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <div className="text-center">
            <div className="inline-block rounded-2xl bg-white p-3">
              <QRCodeSVG
                value={promptPayPayload(PLATFORM.promptpayId, amount)}
                size={190}
              />
            </div>
            <p className="mt-2 text-sm text-muted">PromptPay: {PLATFORM.name}</p>
          </div>
          <div>
            <p className="text-muted">ยอดมัดจำ</p>
            <p className="text-4xl font-bold text-gold-text">{baht(amount)}</p>
            <p className="mt-2 text-sm text-muted">
              โอนเข้า NightList — เราถือเงินไว้ให้ และส่งต่อให้ร้านหลังคุณเช็กอิน
              ยกเลิกตามเงื่อนไขได้เงินคืนจากเราโดยตรง
            </p>
            <Alert
              className="mt-4"
              type="info"
              showIcon
              title="นโยบายมัดจำของร้าน"
              description={bar.deposit.policy}
            />
          </div>
        </div>
        <Upload.Dragger
          accept="image/*"
          maxCount={1}
          showUploadList={false}
          beforeUpload={async (file) => {
            if (file.size > 10 * 1024 * 1024) {
              message.error('ไฟล์ใหญ่เกิน 10MB');
              return Upload.LIST_IGNORE;
            }
            setSlip(await toSmallDataUrl(file));
            return false;
          }}
          className="!mt-6 block"
        >
          {slip ? (
            <img src={slip} alt="สลิปที่เลือก" className="mx-auto max-h-64 rounded-lg" />
          ) : (
            <div className="py-6">
              <UploadSimple size={36} className="mx-auto text-gold-text" />
              <p className="mt-2">แตะเพื่อเลือกรูปสลิป หรือลากไฟล์มาวาง</p>
              <p className="text-xs text-muted">JPG / PNG ไม่เกิน 10MB</p>
            </div>
          )}
        </Upload.Dragger>
        <Button
          type="primary"
          block
          size="large"
          className="mt-6"
          disabled={!slip}
          onClick={() => {
            submitDeposit(b.id, slip!);
            message.success('ส่งสลิปแล้ว NightList จะตรวจและยืนยันโต๊ะให้');
            navigate(`/bookings/${b.id}`);
          }}
        >
          ส่งสลิป
        </Button>
      </Card>
    </div>
  );
}
