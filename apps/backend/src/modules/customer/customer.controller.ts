import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user.decorator';
import { SupabaseJwtGuard, type AuthUser } from '../../auth/supabase-jwt.guard';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  AddReviewDto,
  CancelBookingDto,
  CreateBookingDto,
  MarkReadDto,
  MerchantJoinDto,
  ReportReviewDto,
  RespondInviteDto,
  SubmitDepositDto,
  UpdateProfileDto,
} from './customer.dto';

const Id = (name = 'id') => Param(name, new ParseUUIDPipe());

/**
 * งานเขียนฝั่งลูกค้า — ทุก endpoint เรียกฟังก์ชัน app_* ใน DB (ตรวจสิทธิ์ซ้ำ + ทำทั้งหมดในธุรกรรมเดียว)
 * ไฟล์ (สลิป / รูปรีวิว) หน้าเว็บอัปโหลดเข้า Supabase Storage เองตาม policy แล้วส่งแค่ path มา
 */
@ApiTags('customer')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller()
export class CustomerController {
  constructor(private readonly db: SupabaseService) {}

  @Post('bookings')
  createBooking(@CurrentUser() me: AuthUser, @Body() b: CreateBookingDto) {
    return this.db.rpc('app_create_booking', {
      p_actor: me.id,
      p_bar: b.bar_id,
      p_zone: b.zone_id,
      p_datetime: b.datetime,
      p_pax: b.pax,
      p_promotion: b.promotion_id ?? null,
      p_note: b.note ?? null,
    });
  }

  @Post('bookings/:id/deposit')
  @HttpCode(200)
  submitDeposit(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: SubmitDepositDto) {
    return this.db.rpc('app_submit_deposit', { p_actor: me.id, p_booking: id, p_slip_path: b.slip_path, p_slip_ref: b.slip_ref ?? null });
  }

  @Post('bookings/:id/cancel')
  @HttpCode(200)
  cancelBooking(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: CancelBookingDto) {
    return this.db.rpc('app_cancel_booking', { p_actor: me.id, p_booking: id, p_reason: b.reason ?? null });
  }

  @Post('bookings/:id/review')
  addReview(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: AddReviewDto) {
    return this.db.rpc('app_add_review', {
      p_actor: me.id,
      p_booking: id,
      p_review_id: b.review_id,
      p_rating: b.rating,
      p_comment: b.comment,
      p_media: b.media,
    });
  }

  @Post('reviews/:id/report')
  @HttpCode(200)
  reportReview(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: ReportReviewDto) {
    return this.db.rpc('app_report_review', { p_actor: me.id, p_review: id, p_reason: b.reason, p_detail: b.detail ?? null });
  }

  @Post('me/favorites/:barId/toggle')
  @HttpCode(200)
  toggleFavorite(@CurrentUser() me: AuthUser, @Id('barId') barId: string) {
    return this.db.rpc('app_toggle_favorite', { p_actor: me.id, p_bar: barId });
  }

  @Post('me/notifications/read')
  @HttpCode(200)
  markRead(@CurrentUser() me: AuthUser, @Body() b: MarkReadDto) {
    return this.db.rpc('app_mark_notifications_read', { p_actor: me.id, p_ids: b.ids ?? null });
  }

  @Patch('me/profile')
  updateProfile(@CurrentUser() me: AuthUser, @Body() b: UpdateProfileDto) {
    return this.db.rpc('app_update_profile', { p_actor: me.id, p: b });
  }

  /** ลบบัญชี: ปิดบัญชีใน DB + ระงับการเข้าสู่ระบบ (ข้อมูลส่วนตัวถูกล้างตามรอบ retention) */
  @Post('me/delete')
  @HttpCode(200)
  async deleteAccount(@CurrentUser() me: AuthUser) {
    const r = await this.db.rpc('app_delete_account', { p_actor: me.id });
    await this.db.banUser(me.id);
    return r;
  }

  @Post('invites/:barId/respond')
  @HttpCode(200)
  respondInvite(@CurrentUser() me: AuthUser, @Id('barId') barId: string, @Body() b: RespondInviteDto) {
    return this.db.rpc('app_respond_invite', { p_actor: me.id, p_bar: barId, p_accept: b.accept });
  }

  @Post('merchant/join')
  merchantJoin(@CurrentUser() me: AuthUser, @Body() b: MerchantJoinDto) {
    return this.db.rpc('app_merchant_join', { p_actor: me.id, p: b });
  }
}
