import { Injectable, Logger, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * เครื่อง dev ไม่มี pg_cron → รัน run_booking_timeouts() เองทุก JOBS_LOCAL_INTERVAL_MS
 * production (Vercel) ใช้ pg_cron เรียก /api/jobs/booking-timeouts แทน
 */
@Injectable()
export class LocalJobsScheduler implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger('LocalJobs');
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly config: ConfigService,
    private readonly db: SupabaseService,
  ) {}

  onModuleInit() {
    const ms = this.config.get<number>('JOBS_LOCAL_INTERVAL_MS', 60_000);
    if (this.config.get('NODE_ENV') !== 'development' || !ms || !this.db.configured) return;
    this.timer = setInterval(() => void this.tick(), ms);
    this.timer.unref();
    this.logger.log(`รัน job หมดเวลาการจองทุก ${Math.round(ms / 1000)} วินาที (เครื่อง dev)`);
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      const r = await this.db.rpc<{ expired: number; no_show: number; completed: number }>('run_booking_timeouts', {});
      if (r.expired || r.no_show || r.completed) this.logger.log(`หมดเวลา ${r.expired} · ไม่มาตามนัด ${r.no_show} · ปิดโต๊ะ ${r.completed}`);
    } catch (e) {
      this.logger.warn(`run_booking_timeouts: ${(e as Error).message}`);
    }
  }
}
