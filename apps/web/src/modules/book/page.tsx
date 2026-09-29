import { availability, getBarBySlug } from '@nightlist/mock';
import { createBooking } from '@nightlist/mock';
import {
  App,
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Radio,
  Result,
  Select,
  Steps,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { PriceEstimator, type EstimatorValue } from '@/ui/components/priceEstimator';
import { PageHeader } from '@/ui/components/pageHeader';
import { useDemo } from '@/hooks/useDemo';
import { baht } from '@/ui/utils/format';

const TIMES = [
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
];

/** /bars/:slug/book — จองโต๊ะ */
export function BookPage() {
  useDemo();
  const { slug = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const bar = getBarBySlug(slug);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Dayjs>(dayjs().hour() >= 22 ? dayjs().add(1, 'day') : dayjs());
  const [time, setTime] = useState('21:00');
  const [zoneId, setZoneId] = useState<string>();
  const [note, setNote] = useState('');
  const [est, setEst] = useState<EstimatorValue>(
    (location.state as EstimatorValue | null) ?? { pax: 4, qty: {} },
  );

  const datetime = useMemo(() => {
    const [h, m] = time.split(':').map(Number);
    return date.hour(h!).minute(m!).second(0).millisecond(0);
  }, [date, time]);

  if (!bar) return <Result status="404" title="ไม่พบร้าน" />;
  const slots = availability(bar.id, datetime.toISOString());
  const past = datetime.isBefore(dayjs());

  const submit = () => {
    try {
      const b = createBooking({
        barId: bar.id,
        zoneId: zoneId!,
        datetime: datetime.toISOString(),
        pax: est.pax,
        packageId: est.packageId,
        items: Object.entries(est.qty).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        note,
      });
      message.success('สร้างการจองแล้ว');
      navigate(b.status === 'AWAITING_DEPOSIT' ? `/bookings/${b.id}/deposit` : `/bookings/${b.id}`);
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`จองโต๊ะ · ${bar.name}`}
        subtitle={bar.district}
        extra={<Link to={`/bars/${bar.slug}`}>← กลับหน้าร้าน</Link>}
      />
      <Steps
        current={step}
        className="mb-8"
        items={[{ title: 'วันเวลา & โซน' }, { title: 'รายการ & ราคา' }, { title: 'ยืนยัน' }]}
      />

      {step === 0 && (
        <Card>
          <Form layout="vertical" size="large">
            <div className="grid gap-4 sm:grid-cols-3">
              <Form.Item label="วันที่">
                <DatePicker
                  className="w-full"
                  value={date}
                  onChange={(d) => d && setDate(d)}
                  disabledDate={(d) =>
                    d.isBefore(dayjs(), 'day') || d.isAfter(dayjs().add(30, 'day'))
                  }
                  format="D MMM YYYY"
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item label="เวลา">
                <Select
                  value={time}
                  onChange={setTime}
                  options={TIMES.map((t) => ({ label: `${t} น.`, value: t }))}
                />
              </Form.Item>
              <Form.Item label="จำนวนคน">
                <Select
                  value={est.pax}
                  onChange={(pax) => setEst({ ...est, pax })}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1} คน`,
                    value: i + 1,
                  }))}
                />
              </Form.Item>
            </div>
            {past && (
              <Alert
                type="warning"
                showIcon
                className="mb-4"
                title="เวลานี้ผ่านไปแล้ว เลือกเวลาใหม่"
              />
            )}
            <Form.Item label="โซน">
              <Radio.Group
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="grid w-full gap-3 sm:grid-cols-3"
              >
                {slots.map(({ zone, freeTables, full }) => (
                  <Radio.Button
                    key={zone.id}
                    value={zone.id}
                    disabled={full}
                    className="!h-auto !rounded-xl !border !p-3 text-center"
                  >
                    <span className="block font-semibold">{zone.name}</span>
                    <span className="block text-xs text-muted">
                      {full ? 'เต็มแล้ว' : `ว่าง ${freeTables.length} โต๊ะ`}
                    </span>
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Button type="primary" block disabled={!zoneId || past} onClick={() => setStep(1)}>
              ถัดไป
            </Button>
          </Form>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <PriceEstimator bar={bar} value={est} onChange={setEst} />
          <div className="mt-6 flex gap-3">
            <Button block onClick={() => setStep(0)}>
              ย้อนกลับ
            </Button>
            <Button block type="primary" onClick={() => setStep(2)}>
              ถัดไป
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
            <dt className="text-muted">ร้าน</dt>
            <dd>{bar.name}</dd>
            <dt className="text-muted">วันเวลา</dt>
            <dd>{datetime.format('ddd D MMM YYYY · HH:mm น.')}</dd>
            <dt className="text-muted">จำนวน</dt>
            <dd>{est.pax} คน</dd>
            <dt className="text-muted">โซน</dt>
            <dd>{slots.find((s) => s.zone.id === zoneId)?.zone.name}</dd>
            <dt className="text-muted">เก็บโต๊ะให้</dt>
            <dd>
              ถึง {datetime.add(bar.gracePeriodMinutes, 'minute').format('HH:mm น.')} (
              {bar.gracePeriodMinutes} นาที)
            </dd>
            <dt className="text-muted">มัดจำ</dt>
            <dd>
              {bar.deposit.enabled
                ? `${baht(bar.deposit.amount)} (โอนเข้าบัญชีร้านโดยตรง)`
                : 'ไม่ต้องมัดจำ'}
            </dd>
          </dl>
          {bar.deposit.enabled && (
            <Alert
              className="mt-4"
              type="info"
              showIcon
              title="นโยบายมัดจำ"
              description={bar.deposit.policy}
            />
          )}
          <Input.TextArea
            className="!mt-4"
            rows={2}
            placeholder="หมายเหตุถึงร้าน (ไม่บังคับ) เช่น ฉลองวันเกิด"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            showCount
          />
          <div className="mt-6 flex gap-3">
            <Button block onClick={() => setStep(1)}>
              ย้อนกลับ
            </Button>
            <Button block type="primary" onClick={submit}>
              ยืนยันการจอง
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
