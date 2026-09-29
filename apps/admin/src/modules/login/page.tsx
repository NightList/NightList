import { ShieldStar } from '@phosphor-icons/react';
import { demoLoginAs } from '@nightlist/mock';
import { Alert, Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';

/** Admin login — ของจริง: email + password + TOTP MFA (Supabase AAL2) */
export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-4">
      <Card
        className="w-full max-w-md"
        title={
          <span className="flex items-center gap-2">
            <ShieldStar className="text-gold" /> NightList Backoffice
          </span>
        }
      >
        <Alert
          className="!mb-4"
          type="info"
          showIcon
          title="โหมดเดโม — กดปุ่มด้านล่างเพื่อเข้าเป็นแอดมิน"
        />
        <Form layout="vertical" disabled>
          <Form.Item label="อีเมล">
            <Input placeholder="admin@nightlist.app" />
          </Form.Item>
          <Form.Item label="รหัสผ่าน">
            <Input.Password />
          </Form.Item>
          <Form.Item label="รหัส MFA 6 หลัก">
            <Input.OTP length={6} />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          block
          size="large"
          onClick={() => {
            demoLoginAs('admin');
            navigate('/');
          }}
        >
          เข้าสู่ระบบ (เดโม)
        </Button>
      </Card>
    </div>
  );
}
