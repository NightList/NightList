import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const reason = z.string().trim().min(1).max(500).optional();

export class SetBarStatusDto extends createZodDto(
  z.object({ status: z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED']), reason }),
) {}
export class SetEditorPickDto extends createZodDto(z.object({ value: z.boolean() })) {}
export class ReviewDto extends createZodDto(z.object({ approve: z.boolean(), reason })) {}
export class SettleDepositDto extends createZodDto(z.object({ how: z.enum(['PAID_OUT', 'CREDIT', 'REFUNDED']) })) {}
export class ModerateReviewDto extends createZodDto(
  z.object({ action: z.enum(['KEEP', 'HIDE', 'REMOVE', 'RESTORE']), reason }),
) {}
export class SetUserRoleDto extends createZodDto(
  z.object({ role: z.enum(['CUSTOMER', 'MERCHANT', 'STAFF', 'ADMIN']) }),
) {}
