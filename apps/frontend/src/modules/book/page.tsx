import { createBooking, depositFor, getBarBySlug, promotionApplies, useZoneAvailability } from '@/services/data';
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
  Spin,
  Steps,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { Tag as PromoIcon } from '@phosphor-icons/react';
import { Link, useNavigate, useParams } from 'react-router';
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

/**
 * /bars/:slug/book — จองโต๊ะอย่างเดียว (ไม่มีสั่งอาหาร/เครื่องดื่มล่วงหน้า)
 * ขั้น 1 วันเวลา/จำนวนคน/โซน + เลือกโปรโมชันของร้าน (ถ้าเข้าเงื่อนไขเวลา) → ขั้น 2 ยืนยัน + มัดจำ
 * ทุกการจองต้องมัดจำ เงินเข้า NightList ก่อน แล้วแพลตฟอร์มค่อยโอนให้ร้าน
 */
export function BookPage() {
  useDemo();
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const bar = getBarBySlug(slug);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Dayjs>(dayjs().hour() >= 22 ? dayjs().add(1, 'day') : dayjs());
  const [time, setTime] = useState('21:00');
  const [pax, setPax] = useState(4);
  const [zoneId, setZoneId] = useState<string>();
  const [promotionId, setPromotionId] = useState<string>();
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const datetime = useMemo(() => {
    const [h, m] = time.split(':').map(Number);
    return date.hour(h!).minute(m!).second(0).millisecond(0);
  }, [date, time]);
  // โซนว่างนับจากการจองจริงของทุกคนใน DB (เปลี่ยนวัน/เวลา → ถามใหม่)
  const availability = useZoneAvailability(bar, datetime.toISOString());

  if (!bar) return <Result status="404" title="ไม่พบร้าน" />;
  const slots = availability.data ?? [];
  const past = datetime.isBefore(dayjs());
  const promos = bar.promotions.filter((p) => p.active);
  const iso = datetime.toISOString();
  const chosenPromo = promos.find((p) => p.id === promotionId);
  const deposit = depositFor(bar, pax);

  const submit = async () => {
    setSubmitting(true);
    try {
      const b = await createBooking({
        barId: bar.id,
        zoneId: zoneId!,
        datetime: iso,
        pax,
        promotionId: chosenPromo && promotionApplies(chosenPromo, iso) ? chosenPromo.id : undefined,
        note,
      });
      if (b.status === 'AWAITING_DEPOSIT') {
        message.success('สร้างการจองแล้ว โอนมัดจำเพื่อยืนยันโต๊ะ');
        navigate(`/bookings/${b.id}/deposit`);
      } else {
        message.success('ส่งคำขอจองแล้ว รอร้านยืนยัน');
        navigate(`/bookings/${b.id}`);
      }
    } catch (e) {
      message.error((e as Error).message);
      // โซนอาจเต็มระหว่างกรอก → โหลดโซนว่างใหม่
      void availability.refetch();
    } finally {
      setSubmitting(false);
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
        items={[{ title: 'วันเวลา & โซน' }, { title: 'ยืนยัน & มัดจำ' }]}
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
                  value={pax}
                  onChange={setPax}
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
                {availability.isLoading && <Spin />}
                {slots.map(({ zone, freeTables, full }) => (
                  <Radio.Button
                    key={zone.id}
                    value={zone.id}
                    disabled={full}
                    className="!h-auto !rounded-xl !border !p-3 text-center"
                  >
                    <span className="block font-semibold">{zone.name}</span>
                    <span className="block text-xs text-muted">
                      {full ? 'เต็มแล้ว' : freeTables > 0 ? `ว่าง ${freeTables} โต๊ะ` : 'มีที่ว่าง'}
                    </span>
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            {promos.length > 0 && (
              <Form.Item
                label={
                  <span className="inline-flex items-center gap-1.5">
                    <PromoIcon /> โปรโมชันของร้าน (เลือกได้ 1 อย่าง)
                  </span>
                }
              >
                <Radio.Group
                  value={promotionId ?? ''}
                  onChange={(e) => setPromotionId(e.target.value || undefined)}
                  className="grid w-full gap-2"
                >
                  <Radio value="">ไม่รับโปร</Radio>
                  {promos.map((p) => {
                    const ok = promotionApplies(p, iso);
                    return (
                      <Radio key={p.id} value={p.id} disabled={!ok} className="!items-start">
                        <span className="block font-semibold">{p.title}</span>
                        <span className="block text-xs text-muted">
                          {p.description}
                          {p.cutoffTime && ` · ต้องเช็กอินก่อน ${p.cutoffTime} น.`}
                          {!ok && ' — ใช้กับเวลาที่เลือกไม่ได้'}
                        </span>
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            )}
            <Button
              type="primary"
              block
              disabled={!zoneId || past || !!slots.find((x) => x.zone.id === zoneId)?.full}
              onClick={() => setStep(1)}
            >
              ถัดไป
            </Button>
          </Form>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
            <dt className="text-muted">ร้าน</dt>
            <dd>{bar.name}</dd>
            <dt className="text-muted">วันเวลา</dt>
            <dd>{datetime.format('ddd D MMM YYYY · HH:mm น.')}</dd>
            <dt className="text-muted">จำนวน</dt>
            <dd>{pax} คน</dd>
            <dt className="text-muted">โซน</dt>
            <dd>{slots.find((s) => s.zone.id === zoneId)?.zone.name}</dd>
            <dt className="text-muted">เก็บโต๊ะให้</dt>
            <dd>
              ถึง {datetime.add(bar.gracePeriodMinutes, 'minute').format('HH:mm น.')} (
              {bar.gracePeriodMinutes} นาที)
            </dd>
            {chosenPromo && (
              <>
                <dt className="text-muted">โปรโมชัน</dt>
                <dd>
                  {chosenPromo.title}
                  {chosenPromo.cutoffTime && (
                    <span className="text-muted"> · เช็กอินก่อน {chosenPromo.cutoffTime} น.</span>
                  )}
                </dd>
              </>
            )}
            <dt className="text-muted">มัดจำ</dt>
            <dd>
              <span className="font-semibold text-gold-text">{baht(deposit)}</span>
              <span className="text-muted">
                {' '}
                ({bar.deposit.unit === 'PER_PERSON' ? 'ต่อคน' : 'ต่อโต๊ะ'}) · โอนเข้า NightList
              </span>
            </dd>
          </dl>
          <Alert
            className="mt-4"
            type="info"
            showIcon
            title="มัดจำเข้า NightList ไม่ใช่เข้าร้านโดยตรง"
            description={`เราถือเงินไว้ให้จนกว่าคุณจะเช็กอิน แล้วจึงส่งต่อให้ร้าน · ${bar.deposit.policy}`}
          />
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
            <Button block onClick={() => setStep(0)}>
              ย้อนกลับ
            </Button>
            <Button block type="primary" loading={submitting} onClick={() => void submit()}>
              ยืนยันและไปโอนมัดจำ
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
