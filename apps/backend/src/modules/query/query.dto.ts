import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** bucket ที่หน้าเว็บอัปโหลด/ขอ URL ได้ (สิทธิ์จริงตัดสินโดย Storage policy ของแต่ละ bucket) */
export const UPLOAD_BUCKETS = ['deposit-slips', 'review-media', 'promo-slips', 'bar-verifications'] as const;
const bucket = z.enum(UPLOAD_BUCKETS);
/** path ใน bucket — ห้าม .. / ขึ้นต้นด้วย / (โฟลเดอร์แรกต้องเป็นเจ้าของ ตาม policy) */
const objectPath = z
  .string()
  .min(3)
  .max(300)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._\-/]*$/)
  .refine((p) => !p.includes('..') && !p.includes('//'), 'invalid path');

export class ZoneAvailabilityQueryDto extends createZodDto(
  z.object({ datetime: z.iso.datetime({ offset: true }).describe('เวลาที่จะจอง (ISO 8601 มี timezone)') }),
) {}

export class SignedUrlsDto extends createZodDto(
  z.object({
    bucket,
    paths: z.array(objectPath).min(1).max(500).describe('path ของไฟล์ใน bucket'),
    expires_in: z.number().int().min(60).max(24 * 3600).default(6 * 3600).describe('อายุ URL (วินาที)'),
  }),
) {}

export class UploadUrlDto extends createZodDto(
  z.object({ bucket, path: objectPath.describe('path ปลายทาง เช่น <user_id>/<booking_id>-123.jpg') }),
) {}
