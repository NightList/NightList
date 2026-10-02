import { log, since } from '@/services/log';
import { supabase } from '@/services/supabase';

/** NestJS API (งานเขียนทั้งหมดของแอดมินต้องผ่านที่นี่ — ตรวจสิทธิ์ซ้ำ + บันทึก audit log) */
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

/** ข้อความภาษาไทยของรหัส error จากหลังบ้าน */
const ERROR_TH: Record<string, string> = {
  NOT_ADMIN: 'บัญชีนี้ไม่มีสิทธิ์แอดมิน',
  MFA_REQUIRED: 'ต้องยืนยันรหัส 6 หลักจากแอป Authenticator ใหม่อีกครั้ง',
  BAR_NOT_FOUND: 'ไม่พบร้านนี้แล้ว',
  SAFETY_FEATURE_NOT_FOUND: 'ไม่พบรายการนี้แล้ว',
  DEPOSIT_NOT_FOUND: 'ไม่พบรายการมัดจำนี้แล้ว',
  DEPOSIT_ALREADY_REVIEWED: 'สลิปนี้มีคนตรวจไปแล้ว',
  DEPOSIT_NOT_PAYOUT_PENDING: 'รายการนี้ยังไม่ถึงขั้นโอนให้ร้าน',
  DEPOSIT_NOT_REFUND_PENDING: 'รายการนี้ยังไม่ถึงขั้นคืนเงินลูกค้า',
  REVIEW_NOT_FOUND: 'ไม่พบรีวิวนี้แล้ว',
  PROMOTION_NOT_FOUND: 'ไม่พบรายการโปรโมทนี้แล้ว',
  PROMOTION_NOT_AWAITING_REVIEW: 'รายการโปรโมทนี้ตรวจไปแล้ว',
  USER_NOT_FOUND: 'ไม่พบผู้ใช้นี้แล้ว',
  CANNOT_DEMOTE_SELF: 'ลดสิทธิ์แอดมินของตัวเองไม่ได้ ให้แอดมินคนอื่นทำแทน',
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(ERROR_TH[code] ?? code);
  }
}

export async function adminApi<T = unknown>(method: 'POST' | 'PATCH', path: string, body?: unknown): Promise<T> {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  const token = data.session?.access_token;
  if (!token) throw new ApiError(401, 'MFA_REQUIRED');
  let res: Response;
  const t0 = performance.now();
  try {
    res = await fetch(`${API_URL}/admin/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    log.error(`ติดต่อ API ไม่ได้ ${method} ${API_URL}/admin/${path}`);
    throw new ApiError(0, `ติดต่อ API ไม่ได้ (${API_URL}) — เปิดหลังบ้านด้วย pnpm dev แล้วลองใหม่`);
  }
  const text = await res.text();
  const json = text ? (JSON.parse(text) as { message?: string | string[] }) : null;
  if (!res.ok) {
    const msg = Array.isArray(json?.message) ? json.message.join(', ') : (json?.message ?? `HTTP ${res.status}`);
    log.warn(`API ${method} /admin/${path} → ${res.status} ${msg} · ${since(t0)}`);
    throw new ApiError(res.status, msg);
  }
  log.info(`API ${method} /admin/${path} → ${res.status} · ${since(t0)}`);
  return json as T;
}

/** ตรวจว่า NestJS เปิดอยู่ไหม (log ใน Console ตอนเปิด Backoffice) */
export async function checkApi(): Promise<void> {
  try {
    const r = await fetch(`${API_URL}/health`);
    if (r.ok) log.ok(`เชื่อมต่อ NestJS API สำเร็จ (${API_URL})`);
    else log.warn(`NestJS API ตอบ ${r.status} (${API_URL}) — ปุ่มจัดการจะใช้ไม่ได้`);
  } catch {
    log.warn(`ติดต่อ NestJS API ไม่ได้ (${API_URL}) — เปิดด้วย pnpm dev · ปุ่มจัดการจะใช้ไม่ได้`);
  }
}
