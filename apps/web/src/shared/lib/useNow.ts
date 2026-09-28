import { useEffect, useState } from 'react';

/** เวลาปัจจุบันที่อัปเดตทุก `intervalMs` (ให้ component เป็น pure) */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
