/**
 * Vercel Function entry — ส่งทุก request เข้า NestJS (cache instance ข้าม invocation)
 * build: `pnpm --filter @nightlist/api build` แล้ว Vercel ใช้ไฟล์นี้ (ดู vercel.json)
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { INestApplication } from '@nestjs/common';
import { createApp } from '../dist/bootstrap';

let appPromise: Promise<INestApplication> | undefined;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  appPromise ??= createApp();
  const app = await appPromise;
  const instance = app.getHttpAdapter().getInstance() as (
    req: IncomingMessage,
    res: ServerResponse,
  ) => void;
  instance(req, res);
}
