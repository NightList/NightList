import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthUser, AuthedRequest } from './supabase-jwt.guard';

/** ผู้ใช้ที่ผ่าน SupabaseJwtGuard แล้ว */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest<AuthedRequest>().user!,
);
