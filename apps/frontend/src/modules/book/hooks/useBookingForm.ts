import { App } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  createBooking,
  depositFor,
  promotionApplies,
  useZoneAvailability,
  type BarWithTier,
} from '@/services/data';

/** state + การส่งของฟอร์มจองโต๊ะ (ใช้ใน /bars/:slug/book) */
export function useBookingForm(bar: BarWithTier | null) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  // หลัง 4 ทุ่มเริ่มที่พรุ่งนี้
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
  const iso = datetime.toISOString();
  // โซนว่างนับจากการจองจริงของทุกคนใน DB (เปลี่ยนวัน/เวลา → ถามใหม่)
  const availability = useZoneAvailability(bar, iso);

  const slots = availability.data ?? [];
  const promos = bar?.promotions.filter((p) => p.active) ?? [];
  const chosenPromo = promos.find((p) => p.id === promotionId);
  const zone = slots.find((s) => s.zone.id === zoneId);
  const past = datetime.isBefore(dayjs());
  const canContinue = !!zoneId && !past && !zone?.full;

  const submit = async () => {
    if (!bar || !zoneId) return;
    setSubmitting(true);
    try {
      const b = await createBooking({
        barId: bar.id,
        zoneId,
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

  return {
    step,
    setStep,
    date,
    setDate,
    time,
    setTime,
    pax,
    setPax,
    zoneId,
    setZoneId,
    promotionId,
    setPromotionId,
    note,
    setNote,
    datetime,
    iso,
    slots,
    loadingSlots: availability.isLoading,
    promos,
    chosenPromo,
    zone,
    past,
    canContinue,
    deposit: bar ? depositFor(bar, pax) : 0,
    submitting,
    submit,
  };
}

export type BookingForm = ReturnType<typeof useBookingForm>;
