import { ForbiddenException, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { AuthedRequest } from './supabase-jwt.guard';

/** ต้องใช้คู่กับ SupabaseJwtGuard: role = ADMIN (อ่านจากตาราง users) + ผ่าน MFA แล้ว (aal2) */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    if (!req.user) throw new ForbiddenException('NOT_AUTHENTICATED');
    if (req.user.aal !== 'aal2') throw new ForbiddenException('MFA_REQUIRED');
    const rows = await this.supabase.select<{ role: string }[]>(
      `users?select=role&deleted_at=is.null&id=eq.${encodeURIComponent(req.user.id)}`,
    );
    if (rows[0]?.role !== 'ADMIN') throw new ForbiddenException('NOT_ADMIN');
    return true;
  }
}
