import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { loadBarsFromSupabase } from './services/barsRepo';
import { isSupabaseConfigured } from './services/supabase';
import { BootError } from './ui/components/bootError';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

/**
 * ข้อมูลร้านมาจาก Supabase เท่านั้น (ไม่มีโหมดเดโม): รอโหลดเสร็จก่อน render
 * ไม่มี .env → หน้าบอกวิธีตั้งค่า · โหลดไม่ได้ → หน้าแจ้ง error + ปุ่มลองใหม่ (ไม่ใช้ร้านเดโมแทน)
 */
async function boot() {
  if (!isSupabaseConfigured) {
    render(<BootError kind="config" />);
    return;
  }
  try {
    await loadBarsFromSupabase();
    render(<App />);
  } catch (e) {
    console.error('[NightList] โหลดร้านจาก Supabase ไม่สำเร็จ', e);
    render(<BootError kind="load" onRetry={() => void boot()} />);
  }
}

void boot();
