import dayjs from 'dayjs';
import 'dayjs/locale/th';

/** ตั้งค่ากลางของแอป — แก้ที่นี่ที่เดียว */
dayjs.locale('th');

/** TanStack Query defaults */
export const queryConfig = {
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
} as const;

/** จำนวนแจ้งเตือนล่าสุดใน navbar */
export const NOTIFICATION_PREVIEW_LIMIT = 3;
