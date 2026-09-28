import { EnvelopeSimple, LockSimple } from '@phosphor-icons/react';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { supabase } from '@/shared/lib/supabase';

interface LoginForm {
  email: string;
  password: string;
}

/** /login — email + password (Supabase Auth) */
export function LoginPage() {
  const { message } = App.useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    if (!supabase) {
      message.warning('ยังไม่ได้ตั้งค่า Supabase (.env)');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);
    if (error) {
      message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }
    navigate(params.get('next') ?? '/', { replace: true });
  };

  return (
    <div className="flex min-h-[70dvh] items-center justify-center">
      <Card className="w-full max-w-md shadow-glow">
        <Typography.Title level={2} className="!font-display text-center">
          ยินดีต้อนรับกลับ
        </Typography.Title>
        <Form<LoginForm> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="อีเมล"
            rules={[{ required: true, type: 'email', message: 'กรอกอีเมลให้ถูกต้อง' }]}
          >
            <Input size="large" prefix={<EnvelopeSimple />} autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="รหัสผ่าน" rules={[{ required: true, message: 'กรอกรหัสผ่าน' }]}>
            <Input.Password size="large" prefix={<LockSimple />} autoComplete="current-password" />
          </Form.Item>
          {/* TODO: Cloudflare Turnstile (VITE_TURNSTILE_SITE_KEY) → options.captchaToken */}
          <div className="mb-4 text-right">
            <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
          </div>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            เข้าสู่ระบบ
          </Button>
        </Form>
        <p className="mt-6 text-center text-muted">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </Card>
    </div>
  );
}
