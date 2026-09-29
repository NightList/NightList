import { LockSimple } from '@phosphor-icons/react';
import { App, Button, Form, Input } from 'antd';
import { useAuth } from '@/services/auth';
import { supabase } from '@/services/supabase';

/** ฟอร์มตั้งรหัสผ่านใหม่ — ใช้ร่วมกันใน /reset-password และ /accept-invite */

export function NewPasswordForm({ onDone }: { onDone: () => void }) {
  const { message } = App.useApp();
  const { isDemo } = useAuth();
  return (
    <Form
      layout="vertical"
      size="large"
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
      <Button type="primary" htmlType="submit" block className="btn-auth">
        บันทึก
      </Button>
    </Form>
  );
}
