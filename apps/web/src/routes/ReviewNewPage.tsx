import { addReview, getBar, getBooking } from '@nightlist/mock';
import { App, Button, Card, Form, Input, Rate, Result } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import { PageHeader } from '@/shared/components/PageHeader';

/** /reviews/new?booking=:id — รีวิวได้เฉพาะ booking ที่เช็กอินแล้ว (1 booking = 1 รีวิว) */
export function ReviewNewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const b = getBooking(params.get('booking') ?? '');
  const bar = b ? getBar(b.barId) : null;
  if (!b || !bar) return <Result status="404" title="ไม่พบการจอง" />;
  if (!['CHECKED_IN', 'COMPLETED'].includes(b.status))
    return <Result status="warning" title="รีวิวได้หลังเช็กอินที่ร้านแล้วเท่านั้น" />;
  if (b.reviewed) return <Result status="success" title="คุณรีวิวการจองนี้แล้ว ขอบคุณครับ" />;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={`รีวิว ${bar.name}`} subtitle="รีวิวของคุณช่วยคำนวณดาวและ Tier ของร้าน" />
      <Card>
        <Form
          layout="vertical"
          size="large"
          initialValues={{ rating: 5 }}
          onFinish={(v: { rating: number; comment: string }) => {
            try {
              addReview(b.id, v.rating, v.comment);
              message.success('ขอบคุณสำหรับรีวิว!');
              navigate(`/bars/${bar.slug}`);
            } catch (e) {
              message.error((e as Error).message);
            }
          }}
        >
          <Form.Item name="rating" label="ให้คะแนน" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="เล่าประสบการณ์"
            rules={[{ required: true, min: 10, message: 'อย่างน้อย 10 ตัวอักษร' }]}
          >
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="บรรยากาศ บริการ ราคาตรงกับที่ประเมินไหม ความปลอดภัย ..."
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            ส่งรีวิว
          </Button>
        </Form>
      </Card>
    </div>
  );
}
