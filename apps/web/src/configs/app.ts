import dayjs from 'dayjs';
import 'dayjs/locale/th';

/** ตั้งค่ากลางของแอป — แก้ที่นี่ที่เดียว */
dayjs.locale('th');

/** TanStack Query defaults */
export const queryConfig = {
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
} as const;

/** เดโม: จำลอง pg_cron — ตรวจ NO_SHOW / EXPIRED ทุกกี่ ms */
export const DEMO_TIMEOUT_INTERVAL = 60_000;
