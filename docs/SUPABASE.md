# เชื่อม Supabase (project ที่มีอยู่แล้ว)

สถานะตอนนี้: แอปทำงานใน **โหมดเดโม** (`@nightlist/mock` เก็บใน localStorage) ถ้ามี `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` ระบบ **สมัคร/เข้าสู่ระบบ** จะไปที่ Supabase Auth ทันที ส่วนข้อมูลร้าน/การจองยังเป็นเดโมจนกว่าจะย้ายทีละหน้า (ดูข้อ 5)

## 1. เอาค่ามาจากไหน

Supabase Dashboard → Project → **Settings → API**

| ค่า | ใช้ที่ | ตัวแปร |
|---|---|---|
| Project URL | frontend, admin, backend | `VITE_SUPABASE_URL`, `SUPABASE_URL` |
| anon public key | frontend, admin | `VITE_SUPABASE_ANON_KEY` |
| service_role key (**ลับ** ห้ามใส่ฝั่งเว็บ) | backend เท่านั้น | `SUPABASE_SERVICE_ROLE_KEY` |
| Connection string (Settings → Database) | migration | `DATABASE_URL` |

## 2. ใส่ค่าในเครื่อง

```bash
cp .env.example .env      # ครั้งแรก
# แก้ .env:
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # backend เท่านั้น
```

`.env` อยู่ใน `.gitignore` แล้ว **ห้าม commit**

## 3. รัน migration (สร้างตาราง)

```bash
pnpm --filter @nightlist/backend db:link    # ครั้งแรก: supabase link --project-ref <ref>
pnpm --filter @nightlist/backend db:push    # apply apps/backend/supabase/migrations/*
```

migration ที่มี:
- `20260929000000_init.sql` — users / preferences / consents + trigger สมัครสมาชิก (Age Gate 20+)
- `20260930000000_bars_bookings_deposits.sql` — bars (รวม PR ชาย/หญิง, บัญชีรับเงิน), โปรโมชัน, โซน/โต๊ะ, เมนูราคา, การจอง (เฉพาะโต๊ะ + โปร), **มัดจำเข้าแพลตฟอร์ม** (`deposits.settlement`: HELD → PAYOUT_PENDING → PAID_OUT / CREDIT / REFUNDED), `platform_settings.deposit_promptpay`, Storage bucket `slips`

หลัง push ให้แก้ PromptPay ของแพลตฟอร์มใน Table Editor → `platform_settings` → key `deposit_promptpay`

## 4. Vercel

Project → Settings → Environment Variables (ทั้ง Production และ Preview):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY   (Sensitive)
CORS_ORIGINS=https://<โดเมน>
JOB_SECRET, QR_SIGNING_KEY  (สุ่มยาวๆ)
```

Supabase → Authentication → URL Configuration: ใส่ Site URL = โดเมนเว็บ และ Redirect URLs = `https://<โดเมน>/**`
ถ้าใช้ปุ่ม Google/Facebook ในหน้า Login: Authentication → Providers → เปิด Google / Facebook แล้วใส่ Client ID/Secret จาก Google Cloud / Meta for Developers

## 5. ลำดับย้ายจากเดโมไปข้อมูลจริง

1. **Auth** — ได้ทันทีเมื่อใส่ key (สมัคร/ล็อกอิน/ลืมรหัส/OAuth)
2. **ร้าน + ค้นหา + แผนที่** — อ่านจาก `bars` ผ่าน supabase-js (RLS เปิดให้อ่านร้านที่ APPROVED)
3. **การจอง + มัดจำ** — เขียนผ่าน NestJS (`POST /api/bookings`, `POST /api/bookings/:id/deposit`) เพื่อคุม state machine และ exclusion constraint · สลิปอัปโหลดเข้า bucket `slips/<user_id>/<booking_id>.jpg`
4. **แอดมินตรวจสลิป / โอนให้ร้าน** — `PATCH /api/deposits/:id/verify`, `PATCH /api/deposits/:id/settle` (service role)
5. **pg_cron** — NO_SHOW / EXPIRED เรียก `/api/jobs/*` ด้วย `JOB_SECRET`

แต่ละหน้าแทน service ของ `@nightlist/mock` ด้วย TanStack Query + `src/services/api.ts` ตาม `CLAUDE.md`
