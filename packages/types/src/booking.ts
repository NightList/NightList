import { z } from 'zod';

/** Body ของ POST /bookings — จองเฉพาะโต๊ะ (+ โปรโมชันของร้านถ้ามี) ไม่มีสั่งอาหาร/เครื่องดื่มล่วงหน้า */
export const CreateBookingInput = z.object({
  barId: z.uuid(),
  zoneId: z.uuid(),
  tableId: z.uuid().optional(),
  bookingDatetime: z.iso.datetime({ offset: true }),
  pax: z.number().int().min(1).max(50),
  promotionId: z.uuid().optional(),
  note: z.string().max(200).optional(),
});
export type CreateBookingInput = z.infer<typeof CreateBookingInput>;
