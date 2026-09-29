import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { Request } from 'express';

export interface AuthUser {
  id: string;
  email?: string;
  /** Authenticator Assurance Level — admin ต้องเป็น aal2 (MFA) */
  aal?: string;
}

/** ตรวจ Supabase access token (Bearer) ด้วย JWKS ของโปรเจกต์ */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;

  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('SUPABASE_URL');
    this.issuer = `${url}/auth/v1`;
    this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`));
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing bearer token');
    try {
      const { payload } = await jwtVerify<JWTPayload & { email?: string; aal?: string }>(
        token,
        this.jwks,
        { issuer: this.issuer, audience: 'authenticated' },
      );
      req.user = { id: payload.sub!, email: payload.email, aal: payload.aal };
      // TODO: โหลด role จาก public.users แล้วตรวจด้วย RolesGuard
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
