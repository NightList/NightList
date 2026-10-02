import { Table } from 'antd';
import type { BarWithTier } from '@/services/data';
import { baht } from '@/ui/utils/format';

/** เมนูและราคา — แสดงเพื่อประเมินงบเท่านั้น (ไม่มีสั่งล่วงหน้า) */
export function MenuTable({ menu }: { menu: BarWithTier['menu'] }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">ราคาอ้างอิงสำหรับประเมินงบ — สั่งที่ร้านตอนไปถึง (ไม่มีสั่งล่วงหน้า)</p>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={menu}
        columns={[
          { title: 'หมวด', dataIndex: 'category', width: 110 },
          { title: 'รายการ', dataIndex: 'name' },
          { title: 'ราคา', dataIndex: 'price', align: 'right', render: (v: number) => baht(v) },
        ]}
      />
    </div>
  );
}
