import { log, since } from '@/services/log';
import { supabase } from '@/services/supabase';

// dev: NestJS แยก port · deploy (Vercel services): same-origin /api
export const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')).replace(/\/$/, '');

/** ข้อความภาษาไทยของรหัส error จาก NestJS / ฟังก์ชันใน DB */
const ERROR_TH: Record<string, string> = {
  USER_NOT_FOUND: 'ไม่พบบัญชีผู้ใช้ ลองออกจากระบบแล้วเข้าใหม่',
  BAR_NOT_FOUND: 'ไม่พบร้านนี้ หรือร้านยังไม่เปิดให้จอง',
  ZONE_NOT_FOUND: 'ไม่พบโซนนี้',
  ZONE_FULL: 'โซนนี้เต็มแล้วในช่วงเวลานั้น ลองเลือกโซนหรือเวลาอื่น',
  PAX_OUT_OF_RANGE: 'จำนวนคนเกินที่ร้านรับต่อการจอง',
  BOOKING_TOO_SOON: 'ต้องจองล่วงหน้ามากกว่านี้ ลองเลือกเวลาที่ช้าลง',
  BOOKING_TOO_FAR: 'จองล่วงหน้าไกลเกินที่ร้านเปิดรับ',
  PROMOTION_NOT_AVAILABLE: 'โปรโมชันนี้ใช้กับวัน/เวลาที่เลือกไม่ได้',
  BOOKING_NOT_FOUND: 'ไม่พบการจองนี้',
  BOOKING_NOT_AWAITING_DEPOSIT: 'การจองนี้ไม่ต้องส่งสลิปแล้ว',
  NO_DEPOSIT_REQUIRED: 'การจองนี้ไม่ต้องจ่ายมัดจำ',
  INVALID_SLIP_PATH: 'อัปโหลดสลิปไม่สำเร็จ ลองเลือกไฟล์ใหม่',
  SLIP_ALREADY_USED: 'สลิปนี้ถูกใช้ไปแล้ว',
  INVALID_BOOKING_TRANSITION: 'เปลี่ยนสถานะการจองนี้ไม่ได้แล้ว (สถานะอาจเปลี่ยนไปแล้ว ลองรีเฟรช)',
  BOOKING_NOT_CONFIRMED: 'การจองนี้ยังไม่ได้ยืนยัน หรือเช็กอินไปแล้ว',
  REVIEW_REQUIRES_CHECKIN: 'รีวิวได้หลังเช็กอินที่ร้านแล้วเท่านั้น',
  REVIEW_EXISTS: 'คุณรีวิวการจองนี้แล้ว',
  INVALID_RATING: 'ให้คะแนน 1–5 ดาว',
  REVIEW_MEDIA_LIMIT: 'แนบไฟล์ได้สูงสุด 6 ไฟล์',
  INVALID_MEDIA_PATH: 'อัปโหลดไฟล์รีวิวไม่สำเร็จ',
  REVIEW_NOT_FOUND: 'ไม่พบรีวิวนี้',
  NOT_BAR_MEMBER: 'บัญชีนี้ไม่ได้อยู่ในทีมของร้านนี้',
  NOT_BAR_MANAGER: 'เฉพาะเจ้าของหรือผู้จัดการร้านเท่านั้น',
  NOT_BAR_OWNER: 'เฉพาะเจ้าของร้านเท่านั้น',
  INVALID_LINK: 'ลิงก์โซเชียลไม่ตรงกับแพลตฟอร์ม (ต้องขึ้นต้นด้วย https://)',
  INVALID_PROMOTION: 'ชื่อโปรต้องยาว 1–60 ตัวอักษร',
  INVALID_FEES: 'ค่าธรรมเนียมไม่ถูกต้อง',
  INVALID_PAYOUT_ACCOUNT: 'ข้อมูลบัญชีไม่ครบ',
  PACKAGE_NOT_FOUND: 'ไม่พบแพ็กเกจนี้',
  INVITEE_NOT_REGISTERED: 'อีเมลนี้ยังไม่ได้สมัคร NightList — ให้พนักงานสมัครก่อนแล้วค่อยเชิญ',
  ALREADY_MEMBER: 'คนนี้อยู่ในทีมแล้ว',
  INVITE_NOT_FOUND: 'ไม่พบคำเชิญ (อาจถูกยกเลิกแล้ว)',
  CANNOT_REMOVE_SELF: 'นำตัวเองออกจากทีมไม่ได้',
  MEMBER_NOT_FOUND: 'ไม่พบสมาชิกนี้',
  APPLICATION_PENDING: 'คุณมีร้านที่รอตรวจอยู่แล้ว',
  INVALID_BAR_INFO: 'กรอกชื่อร้านและที่อยู่ให้ครบ',
  INVALID_DISPLAY_NAME: 'ชื่อที่แสดงต้องยาว 1–60 ตัวอักษร',
  SAFETY_FEATURE_NOT_FOUND: 'ไม่พบมาตรการนี้',
  PAYOUT_ENCRYPTION_KEY: 'หลังบ้านยังไม่ได้ตั้ง PAYOUT_ENCRYPTION_KEY',
  INVALID_EVIDENCE_PATH: 'อัปโหลดหลักฐานไม่สำเร็จ',
  HAS_ACTIVE_BOOKINGS: 'ยังมีการจองที่ยังไม่จบ — ยกเลิกหรือรอให้จบก่อนลบบัญชี',
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(ERROR_TH[code] ?? Object.entries(ERROR_TH).find(([k]) => code.includes(k))?.[1] ?? code);
  }
}

/** เรียก NestJS API พร้อมแนบ Supabase access token · log ทุก request ใน Console */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  const method = init.method ?? 'GET';
  const t0 = performance.now();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    log.error(`ติดต่อ API ไม่ได้ ${method} ${API_URL}${path}`);
    throw new ApiError(0, `ติดต่อเซิร์ฟเวอร์ไม่ได้ (${API_URL}) — เปิดหลังบ้านด้วย pnpm dev แล้วลองใหม่`);
  }
  const text = await res.text();
  const body = text ? (JSON.parse(text) as { message?: string | string[] }) : null;
  if (!res.ok) {
    const code = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? `HTTP ${res.status}`);
    log.warn(`API ${method} ${path} → ${res.status} ${code} · ${since(t0)}`);
    throw new ApiError(res.status, code);
  }
  log.info(`API ${method} ${path} → ${res.status} · ${since(t0)}`);
  return body as T;
}

/** ตรวจว่า NestJS เปิดอยู่ไหม (log ใน Console ตอนเปิดเว็บ) */
export async function checkApi(): Promise<boolean> {
  try {
    const r = await fetch(`${API_URL}/health`);
    if (r.ok) {
      log.ok(`เชื่อมต่อ NestJS API สำเร็จ (${API_URL})`);
      return true;
    }
    log.warn(`NestJS API ตอบ ${r.status} (${API_URL}) — การจอง/บันทึกข้อมูลจะใช้ไม่ได้`);
  } catch {
    log.warn(`ติดต่อ NestJS API ไม่ได้ (${API_URL}) — เปิดด้วย pnpm dev · การจอง/บันทึกข้อมูลจะใช้ไม่ได้`);
  }
  return false;
}
