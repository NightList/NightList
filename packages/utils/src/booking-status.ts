import type { BookingStatus, UserRole } from '@nightlist/types';

type Actor = UserRole | 'SYSTEM';

/**
 * State machine ของการจอง — ตรงกับตาราง "Status Transition Rules" ใน docs/PROMPT.md
 * ใช้ทั้งใน UI (แสดงปุ่มที่กดได้) และใน NestJS (validate ก่อนบันทึก)
 */
export const BOOKING_TRANSITIONS: Readonly<
  Record<BookingStatus, ReadonlyArray<{ to: BookingStatus; by: readonly Actor[] }>>
> = {
  PENDING: [
    { to: 'AWAITING_DEPOSIT', by: ['SYSTEM'] },
    { to: 'CONFIRMED', by: ['MERCHANT', 'STAFF', 'SYSTEM'] },
    { to: 'REJECTED', by: ['MERCHANT', 'STAFF'] },
    { to: 'CANCELLED_BY_CUSTOMER', by: ['CUSTOMER'] },
    { to: 'EXPIRED', by: ['SYSTEM'] },
  ],
  AWAITING_DEPOSIT: [
    { to: 'DEPOSIT_SUBMITTED', by: ['CUSTOMER'] },
    { to: 'CANCELLED_BY_CUSTOMER', by: ['CUSTOMER'] },
    { to: 'EXPIRED', by: ['SYSTEM'] },
  ],
  DEPOSIT_SUBMITTED: [
    { to: 'CONFIRMED', by: ['MERCHANT', 'STAFF'] },
    { to: 'AWAITING_DEPOSIT', by: ['MERCHANT', 'STAFF'] },
    { to: 'REJECTED', by: ['MERCHANT', 'STAFF'] },
  ],
  CONFIRMED: [
    { to: 'CHECKED_IN', by: ['MERCHANT', 'STAFF'] },
    { to: 'NO_SHOW', by: ['SYSTEM'] },
    { to: 'CANCELLED_BY_CUSTOMER', by: ['CUSTOMER'] },
    { to: 'CANCELLED_BY_MERCHANT', by: ['MERCHANT'] },
  ],
  CHECKED_IN: [{ to: 'COMPLETED', by: ['MERCHANT', 'STAFF', 'SYSTEM'] }],
  REJECTED: [],
  CANCELLED_BY_CUSTOMER: [],
  CANCELLED_BY_MERCHANT: [],
  NO_SHOW: [],
  EXPIRED: [],
  COMPLETED: [],
};

/** สถานะที่ยังถือโต๊ะอยู่ (ใช้ใน exclusion constraint / availability) */
export const HOLDING_STATUSES: readonly BookingStatus[] = [
  'PENDING',
  'AWAITING_DEPOSIT',
  'DEPOSIT_SUBMITTED',
  'CONFIRMED',
  'CHECKED_IN',
];

export function isTerminalStatus(status: BookingStatus): boolean {
  return BOOKING_TRANSITIONS[status].length === 0;
}

export function canTransition(from: BookingStatus, to: BookingStatus, actor: Actor): boolean {
  return BOOKING_TRANSITIONS[from].some((t) => t.to === to && t.by.includes(actor));
}

export function nextStatuses(from: BookingStatus, actor: Actor): BookingStatus[] {
  return BOOKING_TRANSITIONS[from].filter((t) => t.by.includes(actor)).map((t) => t.to);
}
