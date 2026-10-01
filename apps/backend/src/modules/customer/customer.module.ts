import { Module } from '@nestjs/common';
import { SupabaseJwtGuard } from '../../auth/supabase-jwt.guard';
import { CustomerController } from './customer.controller';

@Module({ controllers: [CustomerController], providers: [SupabaseJwtGuard] })
export class CustomerModule {}
