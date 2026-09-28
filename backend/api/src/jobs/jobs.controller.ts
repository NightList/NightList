import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { NotificationService } from '@nightlist/services';
import { JobSecretGuard } from './job-secret.guard';

/** Endpoint ที่ pg_cron + pg_net เรียกตามรอบ (ดู backend/database/supabase/migrations) */
@ApiExcludeController()
@SkipThrottle()
@UseGuards(JobSecretGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly notifications: NotificationService) {}

  /** ทุก 1 นาที: CONFIRMED เลย auto_cancel_at → NO_SHOW, PENDING หมดเวลา → EXPIRED */
  @Post('booking-timeouts')
  @HttpCode(200)
  bookingTimeouts() {
    // TODO: implement with BookingService + repository
    return { noShow: 0, expired: 0 };
  }

  /** ทุก 1 นาที: ส่งแจ้งเตือนจาก outbox + retry */
  @Post('notifications')
  @HttpCode(200)
  notificationsJob() {
    return this.notifications.processQueue();
  }
}
