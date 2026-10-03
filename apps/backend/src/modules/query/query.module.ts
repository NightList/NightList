import { Module } from '@nestjs/common';
import { MeReadController } from './me-read.controller';
import { MerchantReadController } from './merchant-read.controller';
import { PublicReadController } from './public-read.controller';

/** endpoint อ่านข้อมูลทั้งหมดของหน้าเว็บ (ADR 0002) — หน้าเว็บไม่ query DB ตรงอีกแล้ว */
@Module({ controllers: [PublicReadController, MeReadController, MerchantReadController] })
export class QueryModule {}
