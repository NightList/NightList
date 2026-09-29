import { FacebookLogo, GoogleLogo, ShieldStar, Storefront, User } from '@phosphor-icons/react';
import { demoLogin, demoLoginAs } from '@nightlist/mock';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { AuthCard } from '@/ui/components/authCard';

interface LoginForm {
  email: string;
  password: string;
}

type Provider = 'google' | 'facebook';

/**
 * /login — ดีไซน์ตาม Figma "Login": โลโก้ · อีเมล/รหัสผ่านมีป้ายกำกับ · ลืมรหัสผ่านชิดขวา ·
 * ปุ่มม่วง "เข้าสู่ระบบ" · "หรือดำเนินการต่อด้วย" Google / Facebook · ลิงก์สมัครสมาชิก
 * โหมดเดโม: ปุ่มเข้าเร็วตามบทบาทอยู่ท้ายการ์ด
 */
export function LoginPage() {
  const { message } = App.useApp();
  const { isDemo } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const next = params.get('next') ?? '/';

  const onFinish = async ({ email, password }: LoginForm) => {
    setLoading(true);
    try {
      if (isDemo) {
        demoLogin(email);
      } else {
        // TODO: Cloudflare Turnstile → options: { captchaToken }
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

  const oauth = async (provider: Provider) => {
    if (isDemo) {
      message.info('โหมดเดโม: ใช้ปุ่มเข้าเร็วด้านล่างแทน');
      return;
    }
    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (error) message.error('เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง');
  };

  const quick = (role: 'customer' | 'merchant' | 'staff') => {
    demoLoginAs(role);
    navigate(role === 'customer' ? next : role === 'staff' ? '/merchant/tonight' : '/merchant', {
      replace: true,
    });
  };

  return (
    <AuthCard>
      <Form<LoginForm> layout="vertical" size="large" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="email"
          label="อีเมล"
          className="!mb-4"
          rules={[{ required: true, type: 'email', message: 'กรอกอีเมลให้ถูกต้อง' }]}
        >
          <Input autoComplete="email" inputMode="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="รหัสผ่าน"
          className="!mb-1"
          rules={[{ required: true, message: 'กรอกรหัสผ่าน' }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <div className="mb-5 text-right">
          <Link to="/forgot-password" className="text-xs !text-white/80 hover:!text-white">
            ลืมรหัสผ่าน ?
          </Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="btn-auth mx-auto !flex w-[62%] min-w-40"
        >
          เข้าสู่ระบบ
        </Button>
      </Form>

      <p className="mb-3 mt-6 text-center text-xs text-white/80">หรือดำเนินการต่อด้วย</p>
      <div className="mx-auto flex w-[80%] min-w-52 flex-col gap-2.5">
        <Button block className="btn-oauth" icon={<GoogleLogo size={18} weight="bold" />} onClick={() => oauth('google')}>
          ดำเนินการต่อด้วย Google
        </Button>
        <Button
          block
          className="btn-oauth"
          icon={<FacebookLogo size={18} weight="fill" />}
          onClick={() => oauth('facebook')}
        >
          ดำเนินการต่อด้วย Facebook
        </Button>
      </div>

      <p className="mt-8 text-center text-xs text-white/85">
        ยังไม่มีบัญชี ?{' '}
        <Link to="/register" className="font-bold !text-[#c4a6ff] hover:!text-white">
          สมัครสมาชิก
        </Link>
      </p>

      {isDemo && (
        <div className="mt-7 border-t border-white/10 pt-5 text-center">
          <p className="mb-2.5 text-xs text-white/60">เดโม — เข้าเร็วตามบทบาท</p>
          <div className="grid grid-cols-3 gap-2">
            <Button size="small" type="text" icon={<User />} onClick={() => quick('customer')}>
              ลูกค้า
            </Button>
            <Button size="small" type="text" icon={<Storefront />} onClick={() => quick('merchant')}>
              เจ้าของร้าน
            </Button>
            <Button size="small" type="text" icon={<ShieldStar />} onClick={() => quick('staff')}>
              Staff
            </Button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
