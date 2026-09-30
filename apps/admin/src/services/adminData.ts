import type { Db } from '@nightlist/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { adminApi } from '@/services/api';
import { supabase } from '@/services/supabase';

type AdminView =
  | 'admin_users'
  | 'admin_bars'
  | 'admin_bookings'
  | 'admin_deposits'
  | 'admin_reviews'
  | 'admin_safety_queue'
  | 'admin_promoted_listings'
  | 'admin_billing_events'
  | 'admin_audit_logs';

export interface AdminViewRows {
  admin_users: Db.AdminUser;
  admin_bars: Db.AdminBar;
  admin_bookings: Db.AdminBooking;
  admin_deposits: Db.AdminDeposit;
  admin_reviews: Db.AdminReview;
  admin_safety_queue: Db.AdminSafetyItem;
  admin_promoted_listings: Db.AdminPromotedListing;
  admin_billing_events: Db.AdminBillingEvent;
  admin_audit_logs: Db.AdminAuditLog;
}

/** ตัวกรองแบบง่าย: [คอลัมน์, ค่า] = eq · [คอลัมน์, ค่า[]] = in */
export type ViewFilter = [column: string, value: string | boolean | number | string[]];

interface ListOptions {
  filters?: ViewFilter[];
  order?: { column: string; ascending?: boolean };
  limit?: number;
}

/**
 * อ่าน view ของแอดมินตรงจาก Supabase (RLS: ADMIN + MFA เท่านั้น — คนอื่นได้แถวว่าง)
 * query key ขึ้นต้นด้วย 'admin' เสมอ → การกระทำใด ๆ สำเร็จแล้วรีเฟรชทุกหน้าในคราวเดียว
 */
export function useAdminView<V extends AdminView>(view: V, opts: ListOptions = {}) {
  return useQuery({
    queryKey: ['admin', view, opts],
    queryFn: async (): Promise<AdminViewRows[V][]> => {
      if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
      let q = supabase.from(view).select('*');
      for (const [col, val] of opts.filters ?? []) q = Array.isArray(val) ? q.in(col, val) : q.eq(col, val);
      if (opts.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
      q = q.limit(opts.limit ?? 1000);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as AdminViewRows[V][];
    },
  });
}

/** ตัวเลขหน้าแดชบอร์ด (หนึ่งหน้า = หนึ่งการเรียก) */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async (): Promise<Db.AdminDashboard | null> => {
      if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
      const { data, error } = await supabase.rpc('admin_dashboard');
      if (error) throw error;
      return ((data as Db.AdminDashboard[] | null) ?? [])[0] ?? null;
    },
  });
}

/** ตาราง master ที่อ่านได้ทุกคน (styles, safety_features) หรือแอดมินอ่านได้ (platform_settings) */
export function useMasterTable<T>(table: 'styles' | 'safety_features' | 'platform_settings', orderBy: string) {
  return useQuery({
    queryKey: ['admin', 'master', table],
    queryFn: async (): Promise<T[]> => {
      if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
      const { data, error } = await supabase.from(table).select('*').order(orderBy);
      if (error) throw error;
      return data as T[];
    },
  });
}

interface ActionInput {
  method: 'POST' | 'PATCH';
  path: string;
  body?: unknown;
  /** ข้อความเมื่อสำเร็จ */
  success: string;
}

/** ส่งการกระทำของแอดมินไป NestJS → สำเร็จแล้วแจ้ง + โหลดข้อมูลทุกหน้าใหม่ · ล้มเหลวแจ้งเหตุผลเป็นภาษาไทย */
export function useAdminAction() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: ({ method, path, body }: ActionInput) => adminApi(method, path, body),
    onSuccess: (_d, v) => {
      void message.success(v.success);
      void qc.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (e: Error) => {
      void message.error(e.message);
    },
  });
}

/** URL ชั่วคราว (10 นาที) ของไฟล์ในบักเก็ตส่วนตัว เช่นสลิป */
export function useSignedUrl(bucket: 'deposit-slips' | 'promo-slips', path: string | null | undefined) {
  return useQuery({
    queryKey: ['signed', bucket, path],
    enabled: !!path,
    staleTime: 9 * 60_000,
    queryFn: async () => {
      if (!supabase || !path) return null;
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 600);
      if (error) return null;
      return data.signedUrl;
    },
  });
}
