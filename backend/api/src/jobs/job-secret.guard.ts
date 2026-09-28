import { timingSafeEqual } from 'node:crypto';
import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/** /jobs/* เรียกได้เฉพาะ pg_cron ที่ส่ง header x-job-secret ถูกต้อง */
@Injectable()
export class JobSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const given = Buffer.from(String(req.headers['x-job-secret'] ?? ''));
    const expected = Buffer.from(this.config.getOrThrow<string>('JOB_SECRET'));
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
