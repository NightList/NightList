import { EnvelopeSimple } from '@phosphor-icons/react';
import { App, Button, Form, Input } from 'antd';
import { Link } from 'react-router';
import { supabase } from '@/services/supabase';
import { AuthCard } from '@/ui/components/authCard';

/** /forgot-password */
export function ForgotPasswordPage() {
  const { message } = App.useApp();
  return (
    <AuthCard title="ลืมรหัสผ่าน" subtitle="กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสใหม่ให้">
      <Form
        layout="vertical"
        size="large"
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
        <Button type="primary" htmlType="submit" block className="btn-auth">
          ส่งลิงก์
        </Button>
      </Form>
      <p className="mt-6 text-center">
        <Link to="/login">← กลับไปเข้าสู่ระบบ</Link>
      </p>
    </AuthCard>
  );
}
