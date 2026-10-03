import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig } from 'axios';
import { log, since } from '@/services/log';
import { supabase } from '@/services/supabase';

/**
 * Axios client กลางของ Backoffice — ทุกการอ่าน/เขียนข้อมูลวิ่งผ่านตัวนี้ไป NestJS (ADR 0002)
 *   Component → TanStack Query hook (services/adminData.ts) → Rest → apiClient (Axios) → Backend API
 * - baseURL: VITE_API_BASE_URL (เดิม VITE_API_URL ยังใช้ได้) · dev ค่าเริ่มต้น http://localhost:3000/api · deploy: /api (same-origin)
 * - แนบ Bearer token ของ Supabase Auth (session ของ Backoffice) ให้อัตโนมัติ
 * - error ทุกแบบแปลงเป็น ApiError (ข้อความภาษาไทย) + log ใน Console
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')
).replace(/\/$/, '');

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
    this.name = 'ApiError';
  }
}

let getAccessToken = async (): Promise<string | null> =>
  supabase ? ((await supabase.auth.getSession()).data.session?.access_token ?? null) : null;
export function setAccessTokenGetter(fn: () => Promise<string | null>) {
  getAccessToken = fn;
}

type Timed = { metadata?: { t0: number } };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  const headers = AxiosHeaders.from(config.headers);
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;
  (config as Timed).metadata = { t0: performance.now() };
  return config;
});

const describe = (c?: AxiosRequestConfig) => `${(c?.method ?? 'get').toUpperCase()} ${c?.url ?? ''}`;

apiClient.interceptors.response.use(
  (res) => {
    const t0 = (res.config as Timed).metadata?.t0 ?? performance.now();
    const n = Array.isArray(res.data) ? ` · ${res.data.length} แถว` : '';
    log.info(`API ${describe(res.config)} → ${res.status}${n} · ${since(t0)}`);
    return res;
  },
  (err: unknown) => {
    if (!(err instanceof AxiosError)) return Promise.reject(err);
    const t0 = (err.config as Timed | undefined)?.metadata?.t0 ?? performance.now();
    if (!err.response) {
      log.error(`ติดต่อ API ไม่ได้ ${describe(err.config)} (${API_BASE_URL})`);
      return Promise.reject(new ApiError(0, `ติดต่อ API ไม่ได้ (${API_BASE_URL}) — เปิดหลังบ้านด้วย pnpm dev แล้วลองใหม่`));
    }
    const body = err.response.data as { message?: string | string[] } | string | null;
    const msg = typeof body === 'object' && body ? body.message : undefined;
    // 401 = ไม่มี/หมดอายุ session → ให้ยืนยันตัวตนใหม่ (ข้อความเดิมของ Backoffice)
    const code = err.response.status === 401 ? 'MFA_REQUIRED' : Array.isArray(msg) ? msg.join(', ') : (msg ?? `HTTP ${err.response.status}`);
    log.warn(`API ${describe(err.config)} → ${err.response.status} ${code} · ${since(t0)}`);
    return Promise.reject(new ApiError(err.response.status, code));
  },
);

/** HTTP helpers — คืน body ของ response ตรงๆ (type ตาม generic) */
export const Rest = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => (await apiClient.get<T>(url, config)).data,
  post: async <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) => (await apiClient.post<T>(url, body, config)).data,
  put: async <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) => (await apiClient.put<T>(url, body, config)).data,
  patch: async <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) => (await apiClient.patch<T>(url, body, config)).data,
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => (await apiClient.delete<T>(url, config)).data,
};

/** ตรวจว่า NestJS เปิดอยู่ไหม (log ใน Console ตอนเปิด Backoffice) */
export async function checkApi(): Promise<void> {
  try {
    await Rest.get('/health');
    log.ok(`เชื่อมต่อ NestJS API สำเร็จ (${API_BASE_URL})`);
  } catch {
    log.warn(`ติดต่อ NestJS API ไม่ได้ (${API_BASE_URL}) — เปิดด้วย pnpm dev · Backoffice จะโหลด/บันทึกข้อมูลไม่ได้`);
  }
}

/** role + ชื่อจาก public.users ผ่าน API (GET /me/profile) — null ถ้าไม่พบ/อ่านไม่ได้ */
export async function fetchProfile(accessToken: string): Promise<{ role: string; display_name: string } | null> {
  try {
    return await Rest.get<{ id: string; role: string; display_name: string }>('/me/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    return null;
  }
}
