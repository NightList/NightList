import { ShieldStar, Storefront, User } from '@phosphor-icons/react';
import { demoLogin, demoLoginAs } from '@nightlist/mock';
import { App, Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { AuthCard } from '@/ui/components/authCard';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * /login — email + password (Supabase Auth) · ดีไซน์ตาม Figma "login 2"
 * โหมดเดโม: มีปุ่มเข้าเร็วตามบทบาท แทนส่วน "หรือล็อกอินด้วย"
 */
export function LoginPage() {
  const { message } = App.useApp();
  const { isDemo } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const next = params.get('next') ?? '/';

  const onFinish = async ({ email, password, remember }: LoginForm) => {
    setLoading(true);
    try {
      if (isDemo) {
        demoLogin(email, remember);
      } else {
        // TODO: Cloudflare Turnstile → options: { captchaToken }
        // TODO: remember = false → สร้าง client ด้วย storage: sessionStorage
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
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
      subtitle="จัดอันดับร้านเหล้า คัดมาแล้วจากคนจริง บอกต่อร้านดี ๆ"
      footer={
        <>
          สำหรับผู้มีอายุ 20 ปีขึ้นไป · การเข้าสู่ระบบถือว่ายอมรับ <Link to="/terms">เงื่อนไข</Link>{' '}
          และ <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
        </>
      }
    >
      <Form<LoginForm>
        size="large"
        requiredMark={false}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          className="!mb-3"
          rules={[{ required: true, type: 'email', message: 'กรอกอีเมลให้ถูกต้อง' }]}
        >
          <Input aria-label="อีเมล" placeholder="อีเมล" autoComplete="email" inputMode="email" />
        </Form.Item>
        <Form.Item
          name="password"
          className="!mb-4"
          rules={[{ required: true, message: 'กรอกรหัสผ่าน' }]}
        >
          <Input.Password
            aria-label="รหัสผ่าน"
            placeholder="รหัสผ่าน"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className="mb-6 flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>จดจำฉันไว้</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" className="font-semibold !text-white hover:!text-[#b98cff]">
            ลืมรหัสผ่าน
          </Link>
        </div>

        <Button type="primary" htmlType="submit" block loading={loading} className="btn-auth">
          เข้าสู่ระบบ
        </Button>
      </Form>

      {isDemo && (
        <div className="mt-7 text-center">
          <p className="mb-3 text-white/85">หรือเข้าเร็วด้วยบัญชีเดโม</p>
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
        </div>
      )}

      <p className="mt-8 text-center text-base text-white">
        ยังไม่มีบัญชี?{' '}
        <Link to="/register" className="font-bold !text-[#a36cf5] hover:!text-[#b98cff]">
          สมัครสมาชิก
        </Link>
      </p>
    </AuthCard>
  );
}
