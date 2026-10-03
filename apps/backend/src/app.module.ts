import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';
import { validateEnv } from './config/env';
import { HealthController } from './health/health.controller';
import { JobsController } from './jobs/jobs.controller';
import { LocalJobsScheduler } from './jobs/local-jobs.scheduler';
import { AdminModule } from './modules/admin/admin.module';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PricingController } from './modules/pricing/pricing.controller';
import { PricingModule } from './modules/pricing/pricing.module';
import { QueryModule } from './modules/query/query.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    SupabaseModule,
    AdminModule,
    CustomerModule,
    MerchantModule,
    BookingModule,
    PricingModule,
    RankingModule,
    NotificationModule,
    QueryModule,
  ],
  controllers: [HealthController, PricingController, JobsController],
  providers: [
    LocalJobsScheduler,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
