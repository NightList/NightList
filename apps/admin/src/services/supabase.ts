import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** null เมื่อยังไม่ได้ตั้งค่า .env — Backoffice จะแสดงหน้าให้ตั้งค่าแทน */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: true, storageKey: 'nightlist-admin-auth' } })
    : null;

export const isSupabaseConfigured = supabase !== null;
