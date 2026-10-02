import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { NotificationService } from '../modules/notification/notification.service';
import { SupabaseService } from '../supabase/supabase.service';
import { JobSecretGuard } from './job-secret.guard';

/** Endpoint ที่ pg_cron + pg_net เรียกตามรอบ (ดู apps/backend/supabase/migrations/…001400_retention_jobs.sql) */
@ApiExcludeController()
@SkipThrottle()
@UseGuards(JobSecretGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly notifications: NotificationService,
    private readonly db: SupabaseService,
  ) {}

  /** ทุก 1 นาที: PENDING/AWAITING_DEPOSIT หมดเวลา → EXPIRED · CONFIRMED เลย auto_cancel_at → NO_SHOW · CHECKED_IN เลยเวลา → COMPLETED */
  @Post('booking-timeouts')
  @HttpCode(200)
  bookingTimeouts() {
    if (!this.db.configured) return { expired: 0, no_show: 0, completed: 0, skipped: 'SUPABASE_SERVICE_ROLE_KEY is not configured' };
    return this.db.rpc('run_booking_timeouts', {});
  }

  /** ทุก 1 นาที: ส่งแจ้งเตือนจาก outbox + retry */
  @Post('notifications')
  @HttpCode(200)
  notificationsJob() {
    return this.notifications.processQueue();
  }
}
