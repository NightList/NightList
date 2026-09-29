import { ChatCircleDots, SignOut } from '@phosphor-icons/react';
import { currentUser, DISTRICTS, STYLES, updateProfile } from '@nightlist/mock';
import { App, Avatar, Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/services/auth';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';

export function ProfilePage() {
  useDemo();
  const { user, signOut } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const demo = currentUser();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="โปรไฟล์" />
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size={64} className="!bg-purple">
            {user.displayName.slice(0, 2)}
          </Avatar>
          <div className="flex-1">
            <p className="text-lg font-semibold">{user.displayName}</p>
            <p className="text-muted">
              {user.email} · {user.role}
            </p>
          </div>
          <Button
            icon={<SignOut />}
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
          >
            ออกจากระบบ
          </Button>
        </div>
        {(user.role === 'MERCHANT' || user.role === 'STAFF') && (
          <Link to="/merchant">
            <Button type="primary" className="mt-4">
              ไปหน้าร้านของฉัน
            </Button>
          </Link>
        )}
      </Card>
      {demo && (
        <Card title="ข้อมูลและความชอบ">
          <Form
            layout="vertical"
            initialValues={{ displayName: demo.displayName, ...demo.preferences }}
            onFinish={(v) => {
              updateProfile(demo.id, {
                displayName: v.displayName,
                preferences: {
                  styles: v.styles ?? [],
                  budget: v.budget,
                  pax: v.pax,
                  districts: v.districts ?? [],
                },
              });
              message.success('บันทึกแล้ว');
            }}
          >
            <Form.Item name="displayName" label="ชื่อที่แสดง" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="styles" label="สไตล์ร้านที่ชอบ">
              <Select mode="multiple" options={STYLES.map((s) => ({ label: s, value: s }))} />
            </Form.Item>
            <div className="grid gap-4 sm:grid-cols-2">
              <Form.Item name="budget" label="งบต่อหัว (บาท)">
                <InputNumber className="!w-full" min={0} step={100} />
              </Form.Item>
              <Form.Item name="pax" label="ไปกันกี่คนปกติ">
                <InputNumber className="!w-full" min={1} max={30} />
              </Form.Item>
            </div>
            <Form.Item name="districts" label="ย่านที่ชอบ">
              <Select mode="multiple" options={DISTRICTS.map((d) => ({ label: d, value: d }))} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              บันทึก
            </Button>
          </Form>
        </Card>
      )}
      <Card title="ช่องทางแจ้งเตือน">
        <p className="mb-3 text-sm text-muted">
          รับแจ้งเตือนการจองทาง LINE (ต้องเพิ่มเพื่อน LINE OA และยินยอมก่อน) — ใช้แจ้งเตือนเท่านั้น
          ไม่ได้ใช้เข้าสู่ระบบ
        </p>
        <Button
          icon={<ChatCircleDots />}
          onClick={() => message.info('เดโม: ยังไม่ได้เชื่อม LINE Messaging API')}
        >
          เชื่อม LINE
        </Button>
      </Card>
    </div>
  );
}
