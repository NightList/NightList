import { Injectable, Logger } from '@nestjs/common';

export type NotificationChannel = 'LINE' | 'WEB_PUSH' | 'IN_APP';

/**
 * Notification outbox
 * TODO: enqueue ลง notification_deliveries (QUEUED) ใน transaction เดียวกับ event,
 *       worker ดึง FOR UPDATE SKIP LOCKED แล้วส่ง LINE / Web Push + retry backoff
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async processQueue(): Promise<{ sent: number; failed: number }> {
    this.logger.debug('processQueue: not implemented yet');
    return { sent: 0, failed: 0 };
  }
}
