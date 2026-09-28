import { currentUser, DISTRICTS, STYLES, updateProfile } from '@nightlist/mock';
import { Button, Card, Form, InputNumber, Select } from 'antd';
import { useNavigate } from 'react-router';
import { PageHeader } from '@/shared/components/PageHeader';

/** /onboarding — ความชอบ ใช้กับ rule-based recommendation */
export function OnboardingPage() {
  const navigate = useNavigate();
  const u = currentUser();
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="ชอบร้านแบบไหน?"
        subtitle="ช่วยให้เราแนะนำร้านที่ใช่ (แก้ได้ภายหลังในโปรไฟล์)"
      />
      <Card>
        <Form
          layout="vertical"
          size="large"
          initialValues={u?.preferences}
          onFinish={(v) => {
            if (u)
              updateProfile(u.id, {
                preferences: {
                  styles: v.styles ?? [],
                  budget: v.budget,
                  pax: v.pax,
                  districts: v.districts ?? [],
                },
              });
            navigate('/');
          }}
        >
          <Form.Item name="styles" label="สไตล์ร้าน">
            <Select mode="multiple" options={STYLES.map((s) => ({ label: s, value: s }))} />
          </Form.Item>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item name="budget" label="งบต่อหัว">
              <InputNumber className="!w-full" min={0} step={100} suffix="บาท" />
            </Form.Item>
            <Form.Item name="pax" label="ไปกันกี่คน">
              <InputNumber className="!w-full" min={1} max={30} suffix="คน" />
            </Form.Item>
          </div>
          <Form.Item name="districts" label="ย่าน">
            <Select mode="multiple" options={DISTRICTS.map((d) => ({ label: d, value: d }))} />
          </Form.Item>
          <div className="flex gap-3">
            <Button block onClick={() => navigate('/')}>
              ข้าม
            </Button>
            <Button block type="primary" htmlType="submit">
              เริ่มเลย
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
