import { EnvelopeSimple, LockSimple, MoonStars, SignIn } from '@phosphor-icons/react';
import { App, Button, Card, Divider, Flex, Form, Input, Typography } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { supabase } from '@/shared/lib/supabase';

interface LoginForm {
  email: string;
  password: string;
}

/**
 * /login — email + password (Supabase Auth)
 * ดีไซน์: การ์ดกระจก (glass) + ไอคอนแอปลอยเหนือการ์ด บนท้องฟ้ากลางคืน (ดู AuthLayout)
 */
export function LoginPage() {
  const { message } = App.useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    if (!supabase) {
      message.warning('ยังไม่ได้ตั้งค่า Supabase ในไฟล์ .env');
      return;
    }
    setLoading(true);
    // TODO: Cloudflare Turnstile → options: { captchaToken }
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);
    if (error) {
      message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }
    navigate(params.get('next') ?? '/', { replace: true });
  };

  return (
    <motion.div
      className="relative w-full max-w-[440px] pt-10"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ไอคอนแอปลอยเหนือการ์ด */}
      <div className="animate-float absolute left-1/2 top-0 z-10 -translate-x-1/2">
        <div className="grid h-20 w-20 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-purple via-[#7C3AED] to-gold shadow-[0_12px_40px_-8px_var(--purple)]">
          <MoonStars size={40} weight="fill" className="text-white drop-shadow" />
        </div>
      </div>

      <Card
        variant="borderless"
        classNames={{
          root: 'glass-card !rounded-3xl',
          body: '!px-7 !pb-8 !pt-14 sm:!px-9',
        }}
      >
        <Flex vertical align="center" className="mb-7 text-center">
          <Typography.Title level={2} className="!mb-1 !font-display">
            ยินดีต้อนรับกลับ
          </Typography.Title>
          <Typography.Text type="secondary">เข้าสู่ระบบเพื่อจองโต๊ะและดูการจองของคุณ</Typography.Text>
        </Flex>

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

          {/* ที่วาง Cloudflare Turnstile (VITE_TURNSTILE_SITE_KEY) */}

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

        <Divider plain className="!my-6 !text-muted">
          ยังไม่มีบัญชี?
        </Divider>

        <Link to="/register">
          <Button block size="large" className="!h-12 !rounded-xl">
            สร้างบัญชีใหม่
          </Button>
        </Link>
      </Card>

      <p className="mt-6 text-center text-xs text-muted">
        20+ เท่านั้น · ดื่มไม่ขับ · การเข้าสู่ระบบถือว่ายอมรับ{' '}
        <Link to="/terms">เงื่อนไข</Link> และ <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
      </p>
    </motion.div>
  );
}
