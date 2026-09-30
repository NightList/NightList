import type { Session } from '@supabase/supabase-js';
import type { UserRole } from '@nightlist/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/services/supabase';

/**
 * Auth ของ Backoffice — ต้องเป็น ADMIN (อ่าน role จากตาราง users ไม่ใช่ user_metadata)
 * และผ่าน MFA แบบ TOTP แล้ว (Supabase AAL2) ถึงจะเข้าหน้าแอดมินได้
 */
interface AdminAuthValue {
  session: Session | null;
  role: UserRole | null;
  displayName: string | null;
  /** aal2 = ยืนยัน MFA แล้วใน session นี้ */
  aal: 'aal1' | 'aal2' | null;
  loading: boolean;
  isAdmin: boolean;
  /** เข้าหน้าแอดมินได้ = ADMIN + MFA แล้ว */
  canEnter: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [aal, setAal] = useState<'aal1' | 'aal2' | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);
    if (!supabase || !s) {
      setRole(null);
      setDisplayName(null);
      setAal(null);
      setLoading(false);
      return;
    }
    const [{ data: profile }, { data: level }] = await Promise.all([
      supabase.from('users').select('role, display_name').eq('id', s.user.id).maybeSingle(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    setRole((profile?.role as UserRole | undefined) ?? null);
    setDisplayName((profile?.display_name as string | undefined) ?? null);
    setAal((level?.currentLevel as 'aal1' | 'aal2' | null | undefined) ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      // เรียก supabase ต่อใน callback ตรง ๆ ไม่ได้ (deadlock) — เลื่อนไป tick ถัดไป
      setTimeout(() => void load(s), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  const value = useMemo<AdminAuthValue>(
    () => ({
      session,
      role,
      displayName,
      aal,
      loading,
      isAdmin: role === 'ADMIN',
      canEnter: role === 'ADMIN' && aal === 'aal2',
      refresh: async () => {
        if (!supabase) return;
        const { data } = await supabase.auth.getSession();
        await load(data.session);
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
      },
    }),
    [session, role, displayName, aal, loading, load],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
