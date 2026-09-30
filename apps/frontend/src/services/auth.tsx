import type { Session } from '@supabase/supabase-js';
import type { UserRole } from '@nightlist/types';
import { currentUser, demoLogout, type DemoUser } from '@nightlist/mock';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useDemo } from '@/hooks/useDemo';
import { isSupabaseConfigured, supabase } from '@/services/supabase';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  barId?: string;
}

interface AuthContextValue {
  /** true = ยังไม่ได้ตั้ง Supabase → ใช้ข้อมูลเดโมในเบราว์เซอร์ */
  isDemo: boolean;
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const fromDemo = (u: DemoUser | null): AppUser | null =>
  u && { id: u.id, email: u.email, displayName: u.displayName, role: u.role, barId: u.barId };

/** โปรไฟล์จาก public.users (RLS: อ่านได้เฉพาะแถวตัวเอง) + ร้านแรกที่อยู่ในทีม (view my_bars) */
interface Profile {
  id: string;
  displayName: string;
  role: UserRole;
  barId?: string;
}

async function loadProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const [{ data: u, error }, { data: bars }] = await Promise.all([
    supabase.from('users').select('id, display_name, role').eq('id', userId).maybeSingle(),
    supabase.from('my_bars').select('id').order('created_at').limit(1),
  ]);
  if (error || !u) return null;
  return {
    id: u.id as string,
    displayName: u.display_name as string,
    role: u.role as UserRole,
    barId: (bars?.[0]?.id as string | undefined) ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  useDemo();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(isSupabaseConfigured);
  const [profile, setProfile] = useState<Profile | null>(null);
  /** โหลดโปรไฟล์ของ user id ไหนเสร็จแล้ว (สำเร็จหรือไม่ก็ตาม) */
  const [profileLoadedFor, setProfileLoadedFor] = useState<string | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // role / ชื่อ / ร้าน มาจาก DB (ไม่ใช้ user_metadata — ผู้ใช้แก้เองได้)
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    void loadProfile(userId)
      .then((p) => !cancelled && setProfile(p))
      .finally(() => !cancelled && setProfileLoadedFor(userId));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const demoUser = isSupabaseConfigured ? null : currentUser();
  // มี session แล้วแต่โปรไฟล์ยังไม่มา = ยังโหลดอยู่ (กัน RequireAuth เด้งไป /login ระหว่างรอ)
  const loading = sessionLoading || (!!userId && profileLoadedFor !== userId);

  const value = useMemo<AuthContextValue>(() => {
    const realUser: AppUser | null =
      session && profile && profile.id === session.user.id
        ? {
            id: session.user.id,
            email: session.user.email ?? '',
            displayName: profile.displayName,
            role: profile.role,
            barId: profile.barId,
          }
        : null;
    return {
      isDemo: !isSupabaseConfigured,
      user: isSupabaseConfigured ? realUser : fromDemo(demoUser),
      session,
      loading,
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        else demoLogout();
      },
    };
  }, [session, profile, loading, demoUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
