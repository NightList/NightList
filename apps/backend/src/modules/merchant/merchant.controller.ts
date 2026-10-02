import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user.decorator';
import { SupabaseJwtGuard, type AuthUser } from '../../auth/supabase-jwt.guard';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  BarInfoDto,
  BarPromotionsDto,
  BookingSettingsDto,
  CheckInDto,
  CrowdDto,
  EvidenceDto,
  FeesDto,
  InviteStaffDto,
  MenuDto,
  OrderPromotionDto,
  PayoutAccountDto,
  SafetyDto,
  TeamBookingStatusDto,
  ZonesDto,
} from './merchant.dto';
import { PayoutCryptoService } from './payout-crypto.service';

const Id = (name: string) => Param(name, new ParseUUIDPipe());

/**
 * งานเขียนฝั่งร้าน — ฟังก์ชันใน DB ตรวจว่าเป็นทีมร้านนี้ (bar_staff) และบทบาทพอไหม
 * พนักงาน (STAFF): การจอง/เช็กอิน/ความแน่น · เจ้าของ/ผู้จัดการ: ทุกอย่าง
 */
@ApiTags('merchant')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller('merchant')
export class MerchantController {
  constructor(
    private readonly db: SupabaseService,
    private readonly crypto: PayoutCryptoService,
  ) {}

  @Post('bookings/:bookingId/status')
  @HttpCode(200)
  setBookingStatus(@CurrentUser() me: AuthUser, @Id('bookingId') id: string, @Body() b: TeamBookingStatusDto) {
    return this.db.rpc('app_team_set_booking_status', { p_actor: me.id, p_booking: id, p_to: b.to, p_reason: b.reason ?? null });
  }

  @Post('bars/:barId/check-in')
  @HttpCode(200)
  checkIn(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: CheckInDto) {
    return this.db.rpc('app_check_in', { p_actor: me.id, p_bar: bar, p_code: b.code });
  }

  @Post('bars/:barId/crowd')
  @HttpCode(200)
  crowd(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: CrowdDto) {
    return this.db.rpc('app_set_crowd', { p_actor: me.id, p_bar: bar, p_status: b.status });
  }

  @Patch('bars/:barId/info')
  info(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: BarInfoDto) {
    return this.db.rpc('app_update_bar_info', { p_actor: me.id, p_bar: bar, p: b });
  }

  @Put('bars/:barId/menu')
  menu(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: MenuDto) {
    return this.db.rpc('app_set_menu', { p_actor: me.id, p_bar: bar, p_items: b.items });
  }

  @Put('bars/:barId/promotions')
  promotions(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: BarPromotionsDto) {
    return this.db.rpc('app_set_bar_promotions', { p_actor: me.id, p_bar: bar, p_items: b.items });
  }

  @Put('bars/:barId/fees')
  fees(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: FeesDto) {
    return this.db.rpc('app_set_fees', {
      p_actor: me.id,
      p_bar: bar,
      p_service_charge: b.service_charge,
      p_vat: b.vat,
      p_other: b.other,
    });
  }

  @Put('bars/:barId/zones')
  zones(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: ZonesDto) {
    return this.db.rpc('app_set_zones', { p_actor: me.id, p_bar: bar, p_zones: b.zones });
  }

  @Put('bars/:barId/safety/:key')
  safety(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Param('key') key: string, @Body() b: SafetyDto) {
    return this.db.rpc('app_set_safety', { p_actor: me.id, p_bar: bar, p_key: key.toUpperCase(), p_value: b.value });
  }

  @Put('bars/:barId/safety/:key/evidence')
  safetyEvidence(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Param('key') key: string, @Body() b: EvidenceDto) {
    return this.db.rpc('app_set_safety_evidence', { p_actor: me.id, p_bar: bar, p_key: key.toUpperCase(), p_path: b.path });
  }

  @Patch('bars/:barId/booking-settings')
  bookingSettings(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: BookingSettingsDto) {
    return this.db.rpc('app_update_booking_settings', { p_actor: me.id, p_bar: bar, p: b });
  }

  /** เลขบัญชีเข้ารหัสที่นี่ก่อนส่งลง DB — DB/หน้าเว็บเห็นแค่ 4 ตัวท้าย */
  @Put('bars/:barId/payout-account')
  payoutAccount(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: PayoutAccountDto) {
    return this.db.rpc('app_set_payout_account', {
      p_actor: me.id,
      p_bar: bar,
      p_bank_code: b.bank_code,
      p_account_name: b.account_name,
      p_account_no_enc: this.crypto.encrypt(b.account_no),
      p_last4: b.account_no.slice(-4),
    });
  }

  @Post('bars/:barId/promotion-orders')
  orderPromotion(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: OrderPromotionDto) {
    return this.db.rpc('app_order_promotion', { p_actor: me.id, p_bar: bar, p_package: b.package_id, p_slip_path: b.slip_path });
  }

  @Post('bars/:barId/staff')
  inviteStaff(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Body() b: InviteStaffDto) {
    return this.db.rpc('app_invite_staff', { p_actor: me.id, p_bar: bar, p_email: b.email, p_role: b.role });
  }

  @Delete('bars/:barId/staff/:userId')
  removeStaff(@CurrentUser() me: AuthUser, @Id('barId') bar: string, @Id('userId') user: string) {
    return this.db.rpc('app_remove_staff', { p_actor: me.id, p_bar: bar, p_user: user });
  }
}
