import { Plus, Trash } from '@phosphor-icons/react';
import { updateBar, type MenuItem } from '@nightlist/mock';
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
} from 'antd';
import { useState } from 'react';
import { PageHeader } from '@/ui/components/pageHeader';
import { baht } from '@/ui/utils/format';
import { useMerchantBar } from '@/hooks/useMerchantBar';

const CATS: MenuItem['category'][] = ['เครื่องดื่ม', 'มิกเซอร์', 'อาหาร', 'ของทานเล่น'];

export function MerchantMenuPage() {
  const bar = useMerchantBar();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<Omit<MenuItem, 'id' | 'available'>>();
  const save = (menu: MenuItem[]) => updateBar(bar.id, { menu });

  return (
    <div>
      <PageHeader
        title="เมนู"
        subtitle="ราคาเมนูใช้ในตัวประเมินราคาของลูกค้า"
        extra={
          <Button type="primary" icon={<Plus />} onClick={() => setOpen(true)}>
            เพิ่มรายการ
          </Button>
        }
      />
      <Card>
        <Table
          rowKey="id"
          dataSource={bar.menu}
          pagination={false}
          columns={[
            {
              title: 'หมวด',
              dataIndex: 'category',
              filters: CATS.map((c) => ({ text: c, value: c })),
              onFilter: (v, r) => r.category === v,
            },
            { title: 'รายการ', dataIndex: 'name' },
            {
              title: 'ราคา',
              dataIndex: 'price',
              render: (v: number, r) => (
                <InputNumber
                  size="small"
                  min={0}
                  defaultValue={v}
                  formatter={(x) => `${x}`}
                  onBlur={(e) => {
                    const price = Number(e.target.value);
                    if (price !== v)
                      save(bar.menu.map((m) => (m.id === r.id ? { ...m, price } : m)));
                  }}
                  suffix="฿"
                />
              ),
            },
            {
              title: 'มีขาย',
              dataIndex: 'available',
              render: (v: boolean, r) => (
                <Switch
                  size="small"
                  checked={v}
                  onChange={(available) =>
                    save(bar.menu.map((m) => (m.id === r.id ? { ...m, available } : m)))
                  }
                />
              ),
            },
            {
              title: '',
              key: 'd',
              render: (_, r) => (
                <Popconfirm
                  title="ลบรายการนี้?"
                  okText="ลบ"
                  cancelText="ยกเลิก"
                  onConfirm={() => save(bar.menu.filter((m) => m.id !== r.id))}
                >
                  <Button size="small" type="text" danger icon={<Trash />} aria-label="ลบ" />
                </Popconfirm>
              ),
            },
          ]}
        />
        <p className="mt-3 text-xs text-muted">
          รวม {bar.menu.length} รายการ · เฉลี่ย{' '}
          {baht(
            Math.round(bar.menu.reduce((s, m) => s + m.price, 0) / Math.max(1, bar.menu.length)),
          )}
        </p>
      </Card>
      <Modal
        open={open}
        title="เพิ่มรายการเมนู"
        okText="เพิ่ม"
        cancelText="ยกเลิก"
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const v = await form.validateFields();
          save([...bar.menu, { ...v, id: `${bar.id}-m${Date.now()}`, available: true }]);
          form.resetFields();
          setOpen(false);
          message.success('เพิ่มแล้ว');
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ category: 'อาหาร' }}>
          <Form.Item name="category" label="หมวด">
            <Select options={CATS.map((c) => ({ label: c, value: c }))} />
          </Form.Item>
          <Form.Item name="name" label="ชื่อรายการ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="ราคา (บาท)" rules={[{ required: true }]}>
            <InputNumber className="!w-full" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
