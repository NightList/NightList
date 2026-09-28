import { Plus } from '@phosphor-icons/react';
import { updateBar } from '@nightlist/mock';
import { Button, Card, InputNumber, Tag } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { useMerchantBar } from './useMerchantBar';

export function MerchantTablesPage() {
  const bar = useMerchantBar();
  const addTable = (zoneId: string) =>
    updateBar(bar.id, {
      zones: bar.zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              tables: [
                ...z.tables,
                {
                  id: `${z.id}-t${Date.now()}`,
                  name: `${z.name.slice(-1)}${z.tables.length + 1}`,
                  seats: 4,
                },
              ],
              capacityPax: z.capacityPax + 4,
            }
          : z,
      ),
    });
  return (
    <div>
      <PageHeader
        title="โซน / โต๊ะ"
        subtitle="ระบบกันจองซ้อนจากช่วงเวลาจอง (reservation interval) ต่อโต๊ะ"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bar.zones.map((z) => (
          <Card
            key={z.id}
            title={z.name}
            extra={
              <Button size="small" icon={<Plus />} onClick={() => addTable(z.id)}>
                โต๊ะ
              </Button>
            }
          >
            <p className="mb-3 text-sm text-muted">
              ความจุ {z.capacityPax} คน · จองนาน{' '}
              <InputNumber
                size="small"
                min={60}
                max={480}
                step={30}
                defaultValue={z.defaultDurationMinutes}
                onBlur={(e) =>
                  updateBar(bar.id, {
                    zones: bar.zones.map((x) =>
                      x.id === z.id ? { ...x, defaultDurationMinutes: Number(e.target.value) } : x,
                    ),
                  })
                }
              />{' '}
              นาที
            </p>
            <div className="flex flex-wrap gap-2">
              {z.tables.map((t) => (
                <Tag key={t.id} className="!px-3 !py-1">
                  {t.name} · {t.seats} ที่
                </Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
