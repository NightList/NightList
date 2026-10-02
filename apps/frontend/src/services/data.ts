/**
 * จุดเดียวที่หน้าเว็บใช้อ่าน/เขียนข้อมูล (แทน import จาก @nightlist/mock ตรง ๆ)
 *
 * อ่าน: ฟังก์ชันอ่านเดิมของ @nightlist/mock ทำงานบน store ที่ services/sync.ts เติมข้อมูลจาก Supabase
 *       (ร้าน รีวิว การจอง แจ้งเตือน ร้านโปรด ร้านของฉัน) — ไม่มีข้อมูลเดโม
 * เขียน: services/actions.ts → NestJS → ฟังก์ชันใน DB แล้วโหลดใหม่
 * ข้อมูลที่ต้องถามสด (โซนว่าง สมาชิกทีม สมุดมัดจำ ค่าคอม คำเชิญ) ใช้ hook ด้านล่าง (TanStack Query)
 */
import { useQuery } from '@tanstack/react-query';
import type { BarWithTier } from '@nightlist/mock';
import { supabase } from '@/services/supabase';
import { log } from '@/services/log';

export {
  autoCancelAt,
  barBookings,
  barReviews,
  CATEGORY_LABELS,
  currentUser,
  depositFor,
  favorites,
  getBar,
  getBarBySlug,
  getBooking,
  getState,
  listBars,
  myBookings,
  myNotifications,
  myReviews,
  promotionApplies,
  promptPayPayload,
  rankingByPeriod,
  reviewableBooking,
  safetyScore,
  SAFETY_LABELS,
  tierList,
  withTier,
} from '@nightlist/mock';
export type {
  Bar,
  BarFilter,
  BarPromotion,
  BarWithTier,
  Booking,
  MenuItem,
  RankedBar,
  RankingPeriod,
  Review,
  ReviewMedia,
  SafetyValue,
} from '@nightlist/mock';
export { DISTRICTS, MASTER, STYLES, myPrefs } from '@/services/sync';
export * from '@/services/actions';

const rpc = async <T>(fn: string, args: Record<string, unknown>): Promise<T> => {
  if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    log.error(`rpc ${fn}`, error.message);
    throw new Error(error.message);
  }
  return data as T;
};

export interface ZoneSlot {
  zone: BarWithTier['zones'][number];
  remainingPax: number;
  freeTables: number;
  full: boolean;
}

/** โซนว่างของร้านในเวลาที่เลือก (DB นับการจองของทุกคนให้ — ลูกค้าเห็นการจองคนอื่นไม่ได้) */
export function useZoneAvailability(bar: BarWithTier | null, datetimeIso: string) {
  return useQuery({
    queryKey: ['zone_availability', bar?.id, datetimeIso],
    enabled: !!bar,
    staleTime: 15_000,
    queryFn: async (): Promise<ZoneSlot[]> => {
      const rows = await rpc<{ zone_id: string; remaining_pax: number; free_tables: number; full: boolean }[]>('zone_availability', {
        p_bar: bar!.id,
        p_datetime: datetimeIso,
      });
      return rows
        .map((r) => {
          const zone = bar!.zones.find((z) => z.id === r.zone_id);
          return zone ? { zone, remainingPax: r.remaining_pax, freeTables: r.free_tables, full: r.full } : null;
        })
        .filter((x): x is ZoneSlot => x !== null);
    },
  });
}

export interface TeamMember {
  user_id: string;
  display_name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  invited_at: string;
  accepted_at: string | null;
}
export const useBarTeam = (barId: string) =>
  useQuery({ queryKey: ['bar_team', barId], queryFn: () => rpc<TeamMember[]>('bar_team', { p_bar: barId }) });

export interface Invite {
  bar_id: string;
  bar_name: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  invited_at: string;
  invited_by: string | null;
}
export const useMyInvites = (enabled: boolean) =>
  useQuery({ queryKey: ['my_invites'], enabled, queryFn: () => rpc<Invite[]>('my_invites', {}) });

export interface LedgerRow {
  deposit_id: string;
  booking_id: string;
  booking_code: string;
  booking_datetime: string;
  customer_name: string | null;
  amount: number;
  status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  settlement: 'NONE' | 'HELD' | 'PAYOUT_PENDING' | 'PAID_OUT' | 'CREDIT' | 'REFUND_PENDING' | 'REFUNDED';
  verified_at: string | null;
  settled_at: string | null;
  created_at: string;
}
export const useBarLedger = (barId: string) =>
  useQuery({ queryKey: ['bar_deposit_ledger', barId], queryFn: () => rpc<LedgerRow[]>('bar_deposit_ledger', { p_bar: barId }) });

export interface BillingRow {
  id: string;
  event_type: 'CHECK_IN' | 'NO_SHOW';
  base_amount: number;
  amount: number;
  status: 'PENDING' | 'INVOICED' | 'PAID' | 'WAIVED';
  period: string;
  created_at: string;
  booking: { code: string; booking_datetime: string } | null;
}
export const useBillingEvents = (barId: string) =>
  useQuery({
    queryKey: ['billing_events', barId],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('billing_events')
        .select('id, event_type, base_amount, amount, status, period, created_at, booking:bookings!billing_events_booking_id_fkey(code, booking_datetime)')
        .eq('bar_id', barId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as unknown as BillingRow[];
    },
  });

export interface ShareCard {
  booking_datetime: string;
  pax: number;
  status: string;
  zone_name: string;
  bar_name: string;
  bar_slug: string;
  address: string;
  lat: number;
  lng: number;
  host_first_name: string;
  going_count: number;
}
/** บัตรจองสาธารณะจากลิงก์แชร์ (ไม่มีข้อมูลส่วนตัว) */
export const useShareCard = (token: string) =>
  useQuery({
    queryKey: ['share_card', token],
    queryFn: async () => (await rpc<ShareCard[]>('get_share_card', { p_token: token }))[0] ?? null,
  });
