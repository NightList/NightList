import { EnvelopeSimple, LockSimple } from '@phosphor-icons/react';
import { App, Button, Form, Input, Result } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AuthCard } from '@/features/auth/AuthCard';
import { useAuth } from '@/shared/auth/AuthProvider';
import { supabase } from '@/shared/lib/supabase';

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

/** /forgot-password */
export function ForgotPasswordPage() {
  const { message } = App.useApp();
  return (
    <AuthCard title="ลืมรหัสผ่าน" subtitle="กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสใหม่ให้">
      <Form
        layout="vertical"
        size="large"
        variant="filled"
        requiredMark={false}
        onFinish={async ({ email }: { email: string }) => {
          if (supabase)
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${location.origin}/reset-password`,
            });
          message.success('ถ้ามีบัญชีนี้ เราได้ส่งลิงก์ไปที่อีเมลแล้ว');
        }}
      >
        <Form.Item name="email" label="อีเมล" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<EnvelopeSimple className="text-muted" />} autoComplete="email" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block className="!h-12 !rounded-xl">
          ส่งลิงก์
        </Button>
      </Form>
      <p className="mt-6 text-center">
        <Link to="/login">← กลับไปเข้าสู่ระบบ</Link>
      </p>
    </AuthCard>
  );
}

function NewPasswordForm({ onDone }: { onDone: () => void }) {
  const { message } = App.useApp();
  const { isDemo } = useAuth();
  return (
    <Form
      layout="vertical"
      size="large"
      variant="filled"
      requiredMark={false}
      onFinish={async ({ password }: { password: string }) => {
        if (!isDemo) {
          const { error } = await supabase!.auth.updateUser({ password });
          if (error) return message.error(error.message);
        }
        message.success('ตั้งรหัสผ่านใหม่แล้ว');
        onDone();
      }}
    >
      <Form.Item
        name="password"
        label="รหัสผ่านใหม่"
        rules={[{ required: true, min: 10, message: 'อย่างน้อย 10 ตัว' }]}
      >
        <Input.Password
          prefix={<LockSimple className="text-muted" />}
          autoComplete="new-password"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" block className="!h-12 !rounded-xl">
        บันทึก
      </Button>
    </Form>
  );
}

/** /reset-password */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  return (
    <AuthCard title="ตั้งรหัสผ่านใหม่">
      <NewPasswordForm onDone={() => navigate('/login')} />
    </AuthCard>
  );
}

/** /accept-invite — Staff ตั้งรหัสจากลิงก์เชิญ */
export function AcceptInvitePage() {
  const navigate = useNavigate();
  return (
    <AuthCard title="ยินดีต้อนรับทีมงาน" subtitle="ตั้งรหัสผ่านเพื่อเข้าใช้หน้าร้าน">
      <NewPasswordForm onDone={() => navigate('/merchant/tonight')} />
    </AuthCard>
  );
}
