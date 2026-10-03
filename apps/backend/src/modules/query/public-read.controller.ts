import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { bearerOf } from '../../auth/bearer';
import { ApiDoc } from '../../common/api-doc';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignedUrlsDto, ZoneAvailabilityQueryDto } from './query.dto';

/**
 * อ่านข้อมูลสาธารณะแทนหน้าเว็บ (เดิมหน้าเว็บ query Supabase ตรง) — ไม่บังคับล็อกอิน
 * ส่ง token ของผู้เรียกต่อให้ Supabase (ถ้ามี) → RLS ตัดสินสิทธิ์เหมือนเดิม
 */
@ApiTags('public')
@Controller()
export class PublicReadController {
  constructor(private readonly db: SupabaseService) {}

  @Get('public/catalog')
  @ApiDoc({
    summary: 'ข้อมูลตั้งต้นของเว็บ',
    description: 'ร้านที่อนุมัติแล้ว (view bar_detail) · รีวิวสาธารณะล่าสุด 2,000 รายการ · ย่าน · สไตล์ · ตั้งค่า PromptPay · แพ็กเกจโปรโมท — หน้าเว็บโหลดครั้งเดียวตอนเปิด',
    returns: '`bars` · `reviews` · `districts` · `styles` · `settings` · `packages` (แถวจาก DB ตรงๆ, key เป็น snake_case)',
    auth: false,
    validates: false,
  })
  async catalog(@Req() req: Request) {
    const t = bearerOf(req);
    const [bars, reviews, districts, styles, settings, packages] = await Promise.all([
      this.db.selectAs<unknown[]>(t, 'bar_detail?select=*&order=name'),
      this.db.selectAs<unknown[]>(t, 'public_reviews?select=*&order=created_at.desc&limit=2000'),
      this.db.selectAs<unknown[]>(t, 'districts?select=id,name_th&order=sort_order'),
      this.db.selectAs<unknown[]>(t, 'styles?select=id,key,name_th&order=sort_order'),
      this.db.selectAs<unknown[]>(t, 'platform_settings?select=key,value'),
      this.db.selectAs<unknown[]>(t, 'promotion_packages?select=id,name,placement,duration_days,price&order=price'),
    ]);
    return { bars, reviews, districts, styles, settings, packages };
  }

  @Get('public/team')
  @ApiDoc({
    summary: 'ทีมงานหน้าเกี่ยวกับเรา',
    description: 'สมาชิกทีมที่ active (view public_team) เรียงตาม sort_order',
    returns: 'รายการ `id` · `nickname` · `full_name` · `roles` · `bio` · `skills` · `photo_url` · `contacts` · `sort_order`',
    auth: false,
    validates: false,
  })
  team(@Req() req: Request) {
    return this.db.selectAs<unknown[]>(
      bearerOf(req),
      'public_team?select=id,nickname,full_name,roles,bio,skills,photo_url,contacts,sort_order&order=sort_order',
    );
  }

  @Get('bars/:barId/zone-availability')
  @ApiDoc({
    summary: 'โซนว่างของร้านในเวลาที่เลือก',
    description: 'DB นับการจองของทุกคนให้ (ลูกค้าไม่เห็นการจองของคนอื่น) — ใช้ในหน้าจอง',
    returns: 'รายการ `zone_id` · `remaining_pax` ที่นั่งที่เหลือ · `free_tables` โต๊ะว่าง · `full`',
    auth: false,
  })
  zoneAvailability(@Req() req: Request, @Param('barId', new ParseUUIDPipe()) barId: string, @Query() q: ZoneAvailabilityQueryDto) {
    return this.db.rpcAs<unknown[]>(bearerOf(req), 'zone_availability', { p_bar: barId, p_datetime: q.datetime });
  }

  @Get('share-cards/:token')
  @ApiDoc({
    summary: 'บัตรจองจากลิงก์แชร์',
    description: 'ข้อมูลการจองสำหรับเพื่อนที่ได้ลิงก์ (ไม่มีข้อมูลส่วนตัว)',
    returns: '`booking_datetime` · `pax` · `status` · `zone_name` · `bar_name` · `bar_slug` · `address` · `lat` · `lng` · `host_first_name` · `going_count` หรือ `null` ถ้าไม่พบ',
    auth: false,
  })
  async shareCard(@Req() req: Request, @Param('token') token: string) {
    const rows = await this.db.rpcAs<unknown[]>(bearerOf(req), 'get_share_card', { p_token: token.slice(0, 200) });
    return rows[0] ?? null;
  }

  @Post('storage/signed-urls')
  @HttpCode(200)
  @ApiDoc({
    summary: 'ขอ URL ชั่วคราวของไฟล์',
    description: 'เช่นรูป/วิดีโอรีวิว (bucket private) หรือสลิปของตัวเอง — Storage policy ตัดสินว่าผู้เรียกเห็นไฟล์ไหนได้ (ส่ง Bearer ถ้าล็อกอิน)',
    returns: '`urls` = object { path → URL } เฉพาะไฟล์ที่มีสิทธิ์',
    auth: false,
  })
  async signedUrls(@Req() req: Request, @Body() b: SignedUrlsDto) {
    return { urls: await this.db.signUrlsAs(bearerOf(req), b.bucket, b.paths, b.expires_in) };
  }
}
