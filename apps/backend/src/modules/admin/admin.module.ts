import { Module } from '@nestjs/common';
import { AdminGuard } from '../../auth/admin.guard';
import { SupabaseJwtGuard } from '../../auth/supabase-jwt.guard';
import { AdminController } from './admin.controller';

@Module({ controllers: [AdminController], providers: [SupabaseJwtGuard, AdminGuard] })
export class AdminModule {}
