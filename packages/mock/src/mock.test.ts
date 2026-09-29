import { beforeEach, describe, expect, it } from 'vitest';
import {
  addReview,
  barLedger,
  getBooking,
  settleDeposit,
  checkInByCode,
  createBooking,
  demoLoginAs,
  getBar,
  listBars,
  promptPayPayload,
  resetDemo,
  reviewDeposit,
  submitDeposit,
  tierList,
  transition,
} from './index';

beforeEach(() => resetDemo());

describe('demo data', () => {
  it('has 15 approved fictional bars with tiers', () => {
    expect(listBars()).toHaveLength(15);
    const tiers = tierList();
    expect(tiers.S.length + tiers.A.length + tiers.B.length + tiers.C.length).toBe(14); // 1 ร้านใหม่
  });

  it('full booking flow: deposit → confirm → check-in → review', () => {
    demoLoginAs('customer');
    const bar = getBar('bar-1')!;
    const date = new Date(Date.now() + 2 * 86_400_000).toISOString();
    const b = createBooking({
      barId: bar.id,
      zoneId: bar.zones[1]!.id,
      datetime: date,
      pax: 4,
    });
    expect(b.status).toBe('AWAITING_DEPOSIT');
    submitDeposit(b.id, 'data:image/png;base64,xx');
    // แอดมินแพลตฟอร์มตรวจสลิป → เงินถูกถือไว้ที่แพลตฟอร์ม
    reviewDeposit(b.id, true, 'admin');
    expect(getBooking(b.id)!.deposit?.settlement).toBe('HELD');
    const checked = checkInByCode(bar.id, b.code, 'staff');
    expect(checked.status).toBe('CHECKED_IN');
    // เช็กอินแล้ว → มัดจำเป็นของร้าน รอโอน → แอดมินโอน/เก็บเครดิต
    expect(getBooking(b.id)!.deposit?.settlement).toBe('PAYOUT_PENDING');
    settleDeposit(b.id, 'CREDIT', 'admin');
    expect(barLedger(bar.id).credit).toBeGreaterThanOrEqual(500);
    transition(b.id, 'COMPLETED', 'STAFF', 'staff');
    expect(addReview(b.id, 5, 'ดีมาก').rating).toBe(5);
    expect(() => addReview(b.id, 4, 'ซ้ำ')).toThrow();
  });

  it('builds a PromptPay payload with CRC', () => {
    const p = promptPayPayload('0812345678', 500);
    expect(p.startsWith('000201')).toBe(true);
    expect(p).toMatch(/6304[0-9A-F]{4}$/);
    expect(p).toContain('5406500.00');
  });
});
