import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  BookingModule,
  NotificationModule,
  PricingModule,
  RankingModule,
} from '@nightlist/services';
import { ZodValidationPipe } from 'nestjs-zod';
import { validateEnv } from './config/env';
import { HealthController } from './health/health.controller';
import { JobsController } from './jobs/jobs.controller';
import { PricingController } from './pricing/pricing.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    BookingModule,
    PricingModule,
    RankingModule,
    NotificationModule,
  ],
  controllers: [HealthController, PricingController, JobsController],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
