import { App, Button, Result } from 'antd';
import { useSearchParams } from 'react-router';
import { supabase } from '@/services/supabase';
import { AuthCard } from '@/ui/components/authCard';

/** /verify-email */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const { message } = App.useApp();
  const email = params.get('email') ?? '';
  return (
    <AuthCard title="เช็กอีเมลของคุณ" subtitle={`เราส่งลิงก์ยืนยันไปที่ ${email || 'อีเมลของคุณ'}`}>
      <Result
        status="success"
        title="เกือบเสร็จแล้ว"
        subTitle="กดลิงก์ในอีเมลเพื่อยืนยัน แล้วค่อยกลับมาจองโต๊ะ"
      />
      <Button
        block
        onClick={async () => {
          if (supabase && email) await supabase.auth.resend({ type: 'signup', email });
          message.success('ส่งอีเมลใหม่แล้ว');
        }}
      >
        ส่งอีเมลอีกครั้ง
      </Button>
    </AuthCard>
  );
}
