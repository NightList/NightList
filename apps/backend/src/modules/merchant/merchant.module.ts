import { Module } from '@nestjs/common';
import { SupabaseJwtGuard } from '../../auth/supabase-jwt.guard';
import { MerchantController } from './merchant.controller';
import { PayoutCryptoService } from './payout-crypto.service';

@Module({ controllers: [MerchantController], providers: [SupabaseJwtGuard, PayoutCryptoService] })
export class MerchantModule {}
