import { Module } from '@nestjs/common';
import { AdminGuard } from '../../auth/admin.guard';
import { SupabaseJwtGuard } from '../../auth/supabase-jwt.guard';
import { AdminController } from './admin.controller';
import { AdminReadController } from './admin-read.controller';

@Module({ controllers: [AdminController, AdminReadController], providers: [SupabaseJwtGuard, AdminGuard] })
export class AdminModule {}
