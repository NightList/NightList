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

export function AuthProvider({ children }: { children: ReactNode }) {
  useDemo();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const demoUser = isSupabaseConfigured ? null : currentUser();

  const value = useMemo<AuthContextValue>(() => {
    // TODO: เมื่อต่อ Supabase จริง ให้โหลด role/barId จาก public.users
    const realUser: AppUser | null = session
      ? {
          id: session.user.id,
          email: session.user.email ?? '',
          displayName:
            (session.user.user_metadata?.display_name as string) ?? session.user.email ?? '',
          role: 'CUSTOMER',
        }
      : null;
    return {
      isDemo: !isSupabaseConfigured,
      user: isSupabaseConfigured ? realUser : fromDemo(demoUser),
      session,
      loading,
      signOut: async () => {
        if (supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        } else demoLogout();
      },
    };
  }, [session, loading, demoUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
