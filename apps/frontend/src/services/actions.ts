import type { BarPromotion, MenuItem, ReviewMedia, SafetyValue } from '@nightlist/mock';
import type { BookingStatus, CrowdStatus } from '@nightlist/types';
import { api } from '@/services/api';
import { uploadDepositSlip, uploadPromoSlip, uploadReviewMedia, uploadSafetyEvidence } from '@/services/storage';
import { currentProfile, refresh, setProfileName } from '@/services/sync';

/**
 * การบันทึกทั้งหมดของหน้าเว็บ → NestJS (/api/...) → ฟังก์ชันใน DB → โหลดข้อมูลใหม่จาก Supabase
 * แทนฟังก์ชันเขียนของ @nightlist/mock เดิม (createBooking, transition, updateBar …) — คืน Promise ทุกตัว
 */
const json = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });
const me = () => {
  const p = currentProfile();
  if (!p) throw new Error('กรุณาเข้าสู่ระบบ');
  return p;
};

// ----------------------------- ลูกค้า -----------------------------
export async function createBooking(input: {
  barId: string;
  zoneId: string;
  datetime: string;
  pax: number;
  promotionId?: string;
  note?: string;
}) {
  const r = await api<{ id: string; code: string; status: BookingStatus; deposit_required: number }>(
    '/bookings',
    json('POST', {
      bar_id: input.barId,
      zone_id: input.zoneId,
      datetime: input.datetime,
      pax: input.pax,
      promotion_id: input.promotionId ?? null,
      note: input.note?.trim() || null,
    }),
  );
  await refresh();
  return r;
}

/** อัปโหลดสลิปเข้า deposit-slips/<user>/... แล้วแจ้งหลังบ้าน */
export async function submitDeposit(bookingId: string, slip: Blob) {
  const path = await uploadDepositSlip(me().id, bookingId, slip);
  await api(`/bookings/${bookingId}/deposit`, json('POST', { slip_path: path }));
  await refresh();
}

export async function cancelBooking(bookingId: string, reason?: string) {
  await api(`/bookings/${bookingId}/cancel`, json('POST', { reason: reason ?? null }));
  await refresh();
}

export async function addReview(bookingId: string, rating: number, comment: string, media: ReviewMedia[]) {
  const reviewId = crypto.randomUUID();
  const uploaded = await uploadReviewMedia(me().id, reviewId, media);
  await api(`/bookings/${bookingId}/review`, json('POST', { review_id: reviewId, rating, comment, media: uploaded }));
  await refresh({ public: true });
}

export async function reportReview(reviewId: string, reason: 'SPAM' | 'OFFENSIVE' | 'FAKE' | 'PRIVACY' | 'OTHER' = 'OTHER', detail?: string) {
  await api(`/reviews/${reviewId}/report`, json('POST', { reason, detail: detail ?? null }));
  await refresh();
}

/** คืน true = เพิ่มเป็นร้านโปรด */
export async function toggleFavorite(barId: string) {
  const r = await api<{ favorite: boolean }>(`/me/favorites/${barId}/toggle`, json('POST'));
  await refresh();
  return r.favorite;
}

export async function markAllRead() {
  await api('/me/notifications/read', json('POST', {}));
  await refresh();
}

export async function updateProfile(patch: {
  display_name?: string;
  style_ids?: string[];
  district_ids?: string[];
  budget_per_person?: number | null;
  usual_pax?: number | null;
  onboarded?: boolean;
}) {
  await api('/me/profile', json('PATCH', patch));
  if (patch.display_name) setProfileName(patch.display_name);
  await refresh();
}

/** ลบบัญชี (ต้องไม่มีการจองที่ยังไม่จบ) — หลังจากนี้เข้าสู่ระบบไม่ได้ */
export async function deleteAccount() {
  await api('/me/delete', json('POST', {}));
}

export async function respondInvite(barId: string, accept: boolean) {
  await api(`/invites/${barId}/respond`, json('POST', { accept }));
  await refresh();
}

export async function merchantJoin(input: { name: string; category: string; district_id?: string | null; address: string; license?: string }) {
  const r = await api<{ id: string; status: string }>('/merchant/join', json('POST', input));
  await refresh();
  return r;
}

// ----------------------------- ร้านค้า -----------------------------
export async function setBookingStatus(bookingId: string, to: BookingStatus, reason?: string) {
  await api(`/merchant/bookings/${bookingId}/status`, json('POST', { to, reason: reason ?? null }));
  await refresh();
}

export async function checkIn(barId: string, code: string) {
  const r = await api<{ id: string; code: string; pax: number; zone_name: string | null; customer_name: string | null }>(
    `/merchant/bars/${barId}/check-in`,
    json('POST', { code }),
  );
  await refresh();
  return r;
}

export async function setCrowd(barId: string, status: CrowdStatus) {
  await api(`/merchant/bars/${barId}/crowd`, json('POST', { status }));
  await refresh({ public: true });
}

export async function updateBarInfo(
  barId: string,
  info: {
    name?: string;
    description?: string | null;
    address?: string;
    district_id?: string | null;
    style_keys?: string[];
    hours?: { day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }[];
    links?: { type: string; url: string }[];
  },
) {
  await api(`/merchant/bars/${barId}/info`, json('PATCH', info));
  await refresh({ public: true });
}

export async function setMenu(barId: string, menu: MenuItem[]) {
  await api(
    `/merchant/bars/${barId}/menu`,
    json('PUT', { items: menu.map((m) => ({ id: m.id, category: m.category, name: m.name, price: m.price, available: m.available })) }),
  );
  await refresh({ public: true });
}

/** คืนจำนวนโปรที่รอแอดมินตรวจถ้อยคำ */
export async function setBarPromotions(barId: string, list: BarPromotion[]) {
  const r = await api<{ pending: number }>(
    `/merchant/bars/${barId}/promotions`,
    json('PUT', {
      items: list.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || null,
        cutoff_time: p.cutoffTime ?? null,
        days: p.days ?? null,
        active: p.active,
      })),
    }),
  );
  await refresh({ public: true });
  return r.pending;
}

export async function setFees(barId: string, fees: { serviceChargeRate: number; vatRate: number; otherFees: number }) {
  await api(`/merchant/bars/${barId}/fees`, json('PUT', { service_charge: fees.serviceChargeRate ?? 0, vat: fees.vatRate ?? 0, other: fees.otherFees ?? 0 }));
  await refresh({ public: true });
}

export async function setZones(
  barId: string,
  zones: { id?: string; name: string; capacityPax: number; defaultDurationMinutes: number; tables: { id?: string; name: string; seats: number }[] }[],
) {
  await api(
    `/merchant/bars/${barId}/zones`,
    json('PUT', {
      zones: zones.map((z) => ({
        id: z.id ?? null,
        name: z.name,
        capacity_pax: z.capacityPax,
        default_duration_minutes: z.defaultDurationMinutes,
        tables: z.tables.map((t) => ({ id: t.id ?? null, name: t.name, seats: t.seats })),
      })),
    }),
  );
  await refresh({ public: true });
}

export async function setSafety(barId: string, key: string, value: SafetyValue) {
  await api(`/merchant/bars/${barId}/safety/${key}`, json('PUT', { value }));
  await refresh({ public: true });
}

/** อัปโหลดหลักฐาน (รูป/PDF) เข้า bar-verifications แล้วให้ทีม NightList ตรวจ */
export async function uploadSafetyProof(barId: string, key: string, file: Blob) {
  const path = await uploadSafetyEvidence(barId, key, file);
  await api(`/merchant/bars/${barId}/safety/${key}/evidence`, json('PUT', { path }));
}

export async function updateBookingSettings(
  barId: string,
  s: { deposit_amount?: number; deposit_unit?: string; deposit_policy?: string; grace_minutes?: number; pr_male?: number; pr_female?: number; pr_lgbtq?: number },
) {
  await api(`/merchant/bars/${barId}/booking-settings`, json('PATCH', s));
  await refresh({ public: true });
}

export async function setPayoutAccount(barId: string, a: { bank_code: string; account_name: string; account_no: string }) {
  await api(`/merchant/bars/${barId}/payout-account`, json('PUT', a));
  await refresh();
}

export async function orderPromotion(barId: string, packageId: string, slip: Blob) {
  const path = await uploadPromoSlip(barId, slip);
  await api(`/merchant/bars/${barId}/promotion-orders`, json('POST', { package_id: packageId, slip_path: path }));
  await refresh();
}

export async function inviteStaff(barId: string, email: string, role: 'MANAGER' | 'STAFF' | 'OWNER') {
  await api(`/merchant/bars/${barId}/staff`, json('POST', { email, role }));
}

export async function removeStaff(barId: string, userId: string) {
  await api(`/merchant/bars/${barId}/staff/${userId}`, json('DELETE'));
}
