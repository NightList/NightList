import { EnvelopeSimple, LockSimple, UserCircle } from '@phosphor-icons/react';
import { demoRegister } from '@nightlist/mock';
import { App, Button, Checkbox, DatePicker, Form, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthCard } from '@/ui/components/authCard';
import { useAuth } from '@/services/auth';
import { supabase } from '@/services/supabase';

interface RegisterForm {
  displayName: string;
  email: string;
  password: string;
  confirm: string;
  birthdate: Dayjs;
  accept: boolean;
}

/** /register — สมัครด้วยอีเมล + รหัสผ่าน (Supabase signUp → trigger สร้าง public.users) */
export function RegisterPage() {
  const { isDemo } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const max = dayjs().subtract(20, 'year');

  const onFinish = async (v: RegisterForm) => {
    setLoading(true);
    try {
      if (isDemo) {
        demoRegister({ email: v.email, displayName: v.displayName });
        message.success('สร้างบัญชีแล้ว (เดโม)');
        navigate('/onboarding');
      } else {
        const { error } = await supabase!.auth.signUp({
          email: v.email,
          password: v.password,
          options: {
            emailRedirectTo: `${location.origin}/onboarding`,
            data: {
              display_name: v.displayName,
              birthdate: v.birthdate.format('YYYY-MM-DD'),
              terms_version: 'v1',
              privacy_version: 'v1',
            },
          },
        });
        if (error) throw error;
        navigate(`/verify-email?email=${encodeURIComponent(v.email)}`);
      }
    } catch (e) {
      message.error((e as Error).message || 'สมัครไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="สร้างบัญชี" subtitle="ใช้เวลาไม่ถึงนาที · สำหรับผู้ที่อายุ 20 ปีขึ้นไป">
      <Form<RegisterForm>
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item name="displayName" label="ชื่อที่แสดง" rules={[{ required: true, max: 60 }]}>
          <Input prefix={<UserCircle className="text-muted" />} autoComplete="nickname" />
        </Form.Item>
        <Form.Item
          name="email"
          label="อีเมล"
          rules={[{ required: true, type: 'email', message: 'กรอกอีเมลให้ถูกต้อง' }]}
        >
          <Input
            prefix={<EnvelopeSimple className="text-muted" />}
            autoComplete="email"
            inputMode="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[{ required: true, min: 10, message: 'อย่างน้อย 10 ตัว' }]}
        >
          <Input.Password
            prefix={<LockSimple className="text-muted" />}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="ยืนยันรหัสผ่าน"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator: (_, v) =>
                v === getFieldValue('password')
                  ? Promise.resolve()
                  : Promise.reject(new Error('รหัสผ่านไม่ตรงกัน')),
            }),
          ]}
        >
          <Input.Password
            prefix={<LockSimple className="text-muted" />}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="วันเกิด"
          rules={[{ required: true, message: 'ต้องระบุวันเกิด' }]}
          extra="ต้องอายุ 20 ปีขึ้นไป"
        >
          <DatePicker
            className="w-full"
            defaultPickerValue={max}
            disabledDate={(d) => d.isAfter(max)}
            format="D MMM YYYY"
          />
        </Form.Item>
        <Form.Item
          name="accept"
          valuePropName="checked"
          rules={[
            {
              validator: (_, v) =>
                v ? Promise.resolve() : Promise.reject(new Error('ต้องยอมรับก่อนสมัคร')),
            },
          ]}
        >
          <Checkbox>
            ยอมรับ <Link to="/terms">เงื่อนไขการใช้งาน</Link> และ{' '}
            <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
          </Checkbox>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="btn-auth"
        >
          สมัครสมาชิก
        </Button>
      </Form>
      <p className="mt-6 text-center text-muted">
        มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
      </p>
    </AuthCard>
  );
}
