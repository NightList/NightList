import { z } from 'zod';
import { PriceItem } from './pricing';

/** Body ของ POST /bookings */
export const CreateBookingInput = z.object({
  barId: z.uuid(),
  zoneId: z.uuid(),
  tableId: z.uuid().optional(),
  bookingDatetime: z.iso.datetime({ offset: true }),
  pax: z.number().int().min(1).max(50),
  packageId: z.uuid().optional(),
  items: z.array(PriceItem).default([]),
});
export type CreateBookingInput = z.infer<typeof CreateBookingInput>;
