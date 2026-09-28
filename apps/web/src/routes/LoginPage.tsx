import {
  EnvelopeSimple,
  LockSimple,
  SignIn,
  Storefront,
  User,
  ShieldStar,
} from '@phosphor-icons/react';
import { demoLogin, demoLoginAs } from '@nightlist/mock';
import { App, Button, Divider, Flex, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AuthCard } from '@/features/auth/AuthCard';
import { useAuth } from '@/shared/auth/AuthProvider';
import { supabase } from '@/shared/lib/supabase';

interface LoginForm {
  email: string;
  password: string;
}

/** /login — email + password (Supabase Auth) · โหมดเดโมมีปุ่มเข้าเร็ว */
export function LoginPage() {
  const { message } = App.useApp();
  const { isDemo } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const next = params.get('next') ?? '/';

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      if (isDemo) {
        demoLogin(values.email);
      } else {
        // TODO: Cloudflare Turnstile → options: { captchaToken }
        const { error } = await supabase!.auth.signInWithPassword(values);
        if (error) throw error;
      }
      navigate(next, { replace: true });
    } catch {
      message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  const quick = (role: 'customer' | 'merchant' | 'staff') => {
    demoLoginAs(role);
    navigate(role === 'customer' ? next : role === 'staff' ? '/merchant/tonight' : '/merchant', {
      replace: true,
    });
  };

  return (
    <AuthCard
      title="ยินดีต้อนรับกลับ"
      subtitle="เข้าสู่ระบบเพื่อจองโต๊ะและดูการจองของคุณ"
      footer={
        <>
          20+ เท่านั้น · ดื่มไม่ขับ · การเข้าสู่ระบบถือว่ายอมรับ <Link to="/terms">เงื่อนไข</Link>{' '}
          และ <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
        </>
      }
    >
      <Form<LoginForm>
        layout="vertical"
        size="large"
        variant="filled"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="อีเมล"
          rules={[{ required: true, type: 'email', message: 'กรอกอีเมลให้ถูกต้อง' }]}
        >
          <Input
            prefix={<EnvelopeSimple className="text-muted" />}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[{ required: true, message: 'กรอกรหัสผ่าน' }]}
          className="!mb-2"
        >
          <Input.Password
            prefix={<LockSimple className="text-muted" />}
            placeholder="••••••••••"
            autoComplete="current-password"
          />
        </Form.Item>
        <Flex justify="end" className="mb-6">
          <Link to="/forgot-password" className="text-sm">
            ลืมรหัสผ่าน?
          </Link>
        </Flex>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          icon={<SignIn weight="bold" />}
          iconPlacement="end"
          className="!h-12 !rounded-xl !text-base shadow-[0_8px_30px_-6px_var(--gold)]"
        >
          เข้าสู่ระบบ
        </Button>
      </Form>

      {isDemo && (
        <>
          <Divider plain className="!my-5 !text-muted">
            โหมดเดโม · เข้าเร็ว
          </Divider>
          <div className="grid grid-cols-3 gap-2">
            <Button icon={<User />} onClick={() => quick('customer')}>
              ลูกค้า
            </Button>
            <Button icon={<Storefront />} onClick={() => quick('merchant')}>
              เจ้าของร้าน
            </Button>
            <Button icon={<ShieldStar />} onClick={() => quick('staff')}>
              Staff
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            หรือใช้อีเมล demo@nightlist.app รหัสอะไรก็ได้
          </p>
        </>
      )}

      <Divider plain className="!my-5 !text-muted">
        ยังไม่มีบัญชี?
      </Divider>
      <Link to="/register">
        <Button block size="large" className="!h-12 !rounded-xl">
          สร้างบัญชีใหม่
        </Button>
      </Link>
    </AuthCard>
  );
}
