import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { checkApi } from './services/api';
import { log } from './services/log';
import { isSupabaseConfigured } from './services/supabase';
import { loadPublic } from './services/sync';
import { BootError } from './ui/components/bootError';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

/**
 * ข้อมูลทั้งหมดมาจาก Supabase (ไม่มีโหมดเดโม): รอโหลดข้อมูลสาธารณะเสร็จก่อน render
 * ไม่มี .env → หน้าบอกวิธีตั้งค่า · โหลดไม่ได้ → หน้าแจ้ง error + ปุ่มลองใหม่
 * สถานะการเชื่อมต่อดูได้ใน DevTools → Console (กรองคำว่า NightList)
 */
async function boot() {
  if (!isSupabaseConfigured) {
    log.error('ยังไม่ได้ตั้ง VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ใน .env');
    render(<BootError kind="config" />);
    return;
  }
  try {
    await loadPublic();
    void checkApi();
    render(<App />);
  } catch (e) {
    log.error('เชื่อมต่อ Supabase ไม่สำเร็จ', e);
    render(<BootError kind="load" onRetry={() => void boot()} />);
  }
}

void boot();
