import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../auth/admin.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { SupabaseJwtGuard, type AuthUser } from '../../auth/supabase-jwt.guard';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  ModerateReviewDto,
  ReviewDto,
  SetBarStatusDto,
  SetEditorPickDto,
  SetUserRoleDto,
  SettleDepositDto,
} from './admin.dto';

const Id = () => Param('id', new ParseUUIDPipe());

/**
 * งานเขียนของ Backoffice — ทุก endpoint เรียกฟังก์ชัน admin_* ใน DB (ตรวจ ADMIN ซ้ำ + บันทึก audit_logs ในธุรกรรมเดียวกัน)
 * การอ่านข้อมูลหน้าแอดมิน ใช้วิว admin_* ผ่าน Supabase ตรง (RLS: ADMIN + MFA)
 */
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly db: SupabaseService) {}

  @Patch('bars/:id/status')
  setBarStatus(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: SetBarStatusDto) {
    return this.db.rpc('admin_set_bar_status', { p_actor: me.id, p_bar: id, p_status: b.status, p_reason: b.reason ?? null });
  }

  @Patch('bars/:id/editor-pick')
  setEditorPick(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: SetEditorPickDto) {
    return this.db.rpc('admin_set_editor_pick', { p_actor: me.id, p_bar: id, p_value: b.value });
  }

  @Post('safety/:id/verify')
  @HttpCode(200)
  verifySafety(@CurrentUser() me: AuthUser, @Id() id: string) {
    return this.db.rpc('admin_verify_safety', { p_actor: me.id, p_feature: id });
  }

  @Post('deposits/:id/review')
  @HttpCode(200)
  reviewDeposit(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: ReviewDto) {
    return this.db.rpc('admin_review_deposit', { p_actor: me.id, p_deposit: id, p_approve: b.approve, p_reason: b.reason ?? null });
  }

  @Post('deposits/:id/settle')
  @HttpCode(200)
  settleDeposit(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: SettleDepositDto) {
    return this.db.rpc('admin_settle_deposit', { p_actor: me.id, p_deposit: id, p_how: b.how });
  }

  @Post('reviews/:id/moderate')
  @HttpCode(200)
  moderateReview(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: ModerateReviewDto) {
    return this.db.rpc('admin_moderate_review', { p_actor: me.id, p_review: id, p_action: b.action, p_reason: b.reason ?? null });
  }

  @Post('promotions/:id/review')
  @HttpCode(200)
  reviewPromotion(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: ReviewDto) {
    return this.db.rpc('admin_review_promotion', { p_actor: me.id, p_listing: id, p_approve: b.approve, p_reason: b.reason ?? null });
  }

  @Patch('users/:id/role')
  setUserRole(@CurrentUser() me: AuthUser, @Id() id: string, @Body() b: SetUserRoleDto) {
    return this.db.rpc('admin_set_user_role', { p_actor: me.id, p_user: id, p_role: b.role });
  }
}
