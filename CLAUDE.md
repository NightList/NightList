# CLAUDE.md — กติกาการทำงานใน repo NightList

## Branch
- มีแค่ 2 branch: `demo` (dev) และ `main` (deploy ขึ้นเว็บ)
- ทำงานและ push ที่ `demo` เท่านั้น ห้าม push ตรงเข้า `main` และไม่ต้องแตก branch ย่อย
- เจ้าของ repo เป็นคน merge `demo → main` เมื่อทดสอบแล้ว

## Commit
- ใช้ Conventional Commits เช่น `feat(api): ...`, `fix(web): ...`, `docs: ...`
- 1 commit = 1 เรื่อง

## สเปค
- สเปคหลักอยู่ที่ `docs/PROMPT.md` ถ้าสเปคเปลี่ยน ให้อัปเดตไฟล์นี้ใน branch `demo`

## Skills
- **ทุกครั้งที่แก้ UI ต้องเปิด skill ที่เกี่ยวข้องก่อน** (frontend-design เสมอ + mobile-native ถ้าแตะมือถือ, antd ถ้าแตะคอมโพเนนต์ antd, animate ถ้าแตะ motion) เพื่อกันดีไซน์เพี้ยน
- ก่อนเริ่มงาน: ดึง `demo` ล่าสุดของเพื่อนก่อนเสมอ แล้วทำต่อบนนั้น
- `.claude/skills/ant-design` และ `.claude/skills/antd` (จาก ant-design/antd-skill) ใช้ทุกครั้งที่เขียน UI (antd v6 ใช้ทั้ง `apps/frontend` และ `apps/admin`)
- ก่อนเขียนโค้ด antd: `antd info <Component> --format json` / หลังแก้: `antd lint <path> --format json`
- Tailwind ใช้กับ layout/ตกแต่งเท่านั้น, ไอคอนใช้ Phosphor (`@phosphor-icons/react`) ห้ามใช้ `@ant-design/icons`
- `.claude/skills/frontend-design` (จาก anthropics/claude-code) ใช้ตอนออกแบบ/ปรับหน้าจอ — แต่ Figma + Midnight Gold คือโจทย์หลัก ห้ามหลุดธีม
- สถาปัตยกรรมและ route อ้างอิง `docs/ARCHITECTURE.md` และ `docs/SITEMAP.md`

## โครงโฟลเดอร์ (apps/frontend, apps/admin)
- 1 หน้า = `src/modules/<ชื่อหน้า camelCase>/page.tsx` · ของใช้เฉพาะหน้าไว้ใน `components/ type/ form/ modal/ utils/` ของโมดูลนั้น
- ใช้หลายหน้า → `src/ui/components`, `src/ui/utils`, `src/hooks` · API/Auth → `src/services`
- route อยู่ `src/router/index.tsx`, guard อยู่ `src/router/middleware.tsx`, layout อยู่ `src/layouts/`
- รายละเอียด: `docs/ARCHITECTURE.md` หัวข้อ "โครงภายในแอป"

## React
- ใช้ function component + hooks เท่านั้น (ยกเว้น `ErrorBoundary`) และ logic ที่ใช้ซ้ำให้แยกเป็น custom hook
- HOC ใช้เฉพาะเรื่องที่ครอบหลายหน้า ส่วนเรื่องสิทธิ์ใช้ layout route `<RequireAuth>` / `<RequireRole>`

## Auth
- เข้าสู่ระบบด้วย email + password ของ Supabase Auth (supabase-js) + ปุ่ม Google / Facebook (Supabase OAuth ตาม Figma "Login") ส่วน NestJS แค่ตรวจ JWT ห้ามเพิ่ม OTP หรือ provider อื่นโดยไม่ได้ตกลงกันก่อน
- ขั้นตอนเชื่อม Supabase project จริง: `docs/SUPABASE.md`

## คำสั่ง
- ติดตั้ง: `pnpm install` · รัน: `pnpm dev` · ตรวจก่อน commit: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- package ภายใน build ด้วย tsup/tsc → แอปต้องรอ `^build` (Turborepo จัดการให้)
- สี / ธีม: แก้ที่ `packages/ui/src/tokens.ts` และ `theme.css` ให้ตรงกัน (มี test ตรวจ)

## กฎธุรกิจที่ตกลงแล้ว
- จอง**เฉพาะโต๊ะ** + เลือกโปรโมชันของร้านได้ 1 อย่าง (มี cutoff time เช่น โปรเบียร์ก่อน 2 ทุ่ม) — **ไม่มี**สั่งอาหาร/เครื่องดื่ม/แพ็กเกจล่วงหน้า เมนูราคาแสดงเพื่อประเมินงบเท่านั้น
- **ทุกการจองต้องมัดจำ** เงินเข้า PromptPay ของ NightList (ไม่เข้าร้าน) → แอดมินตรวจสลิป → ถือไว้ → ลูกค้าเช็กอิน/ไม่มาแล้วค่อยโอนให้ร้านหรือเก็บเป็นเครดิตร้าน
- PR ของร้าน (ชาย/หญิงกี่คน) ร้านกรอกเองใน `/merchant/settings` แสดงในหน้าร้าน/การ์ด และกรองได้ในหน้าค้นหา
- แผนที่ใช้ Leaflet + vector tiles OpenFreeMap (ฟรี ไม่ต้องมี key) สีตามพาเลต Google Maps ปกติ/กลางคืน (`ui/utils/mapStyle.ts`) — ไม่ใช้ Google Maps API / CARTO · สำรองเป็น OSM raster · หน้า `/map` เต็มจอ หมุดและการ์ดใช้รูปร้าน `barImage()` (coverUrl หรือรูปแทน `/images/bars/placeholder.webp`)
- หน้าจัดอันดับเป็นรายสัปดาห์/รายเดือนตามจำนวนโหวต (1 การจองที่เช็กอิน = 1 โหวต) ใช้ GSAP + ScrollTrigger (`modules/ranking/utils/gsap.ts`) — GSAP ใช้เฉพาะหน้านั้น ที่อื่นใช้ Motion ตามเดิม
- รีวิวแนบรูป/วิดีโอได้สูงสุด 6 ไฟล์ (วิดีโอ ≤ 60 วิ / 60MB) · ของจริงเก็บ Supabase Storage `review-media` (migration 0003) · เดโม: รูปเป็น data URL, วิดีโอเก็บ IndexedDB (`services/mediaStore.ts`)
- ธีมมืดเป็นค่าเริ่มต้น · หน้า Auth ไม่มีปุ่มเปลี่ยนธีม/ปุ่มเข้าสู่ระบบบน navbar (`<Navbar minimal />`)
- ไม่มีแถบ "โหมดเดโม" บนหน้าเว็บ (ยังมีปุ่มเข้าเร็วเดโมในหน้า login และปุ่มรีเซ็ตในตั้งค่า)

## ข้อมูลร้าน (Supabase เท่านั้น) / โหมดเดโม
- `apps/frontend`: **ข้อมูลร้านมาจาก Supabase เท่านั้น** — ต้องมี `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` ใน `.env` ที่ root (ไม่มี → หน้าแจ้งให้ตั้งค่า, ต่อไม่ได้ → หน้า error + ปุ่มลองใหม่) ห้ามใช้ร้านเดโมเป็น fallback
  - `main.tsx` รอ `loadBarsFromSupabase()` (`src/services/barsRepo.ts` อ่าน view `bar_detail`) ก่อน render แล้วเอาร้านจาก DB ไปใส่ store ของ `@nightlist/mock` → หน้าเว็บยังเรียก `listBars()` / `getBarBySlug()` ได้เหมือนเดิม
  - ร้านเดโมอยู่ใน DB แล้ว (`apps/backend/supabase/seed.sql` สร้างจาก `@nightlist/mock` ด้วย `db:seed:gen`) — ห้ามใส่ชื่อร้านจริงใน seed
- ยังเป็นเดโม (localStorage): การจอง, มัดจำ, รีวิว, แจ้งเตือน และแอป `apps/admin` — ตอนต่อ API จริง ให้แทน service ของ mock ทีละหน้าด้วย TanStack Query + `src/services/api.ts`
- โครงสร้างตาราง: `docs/DATABASE.md` (spec: `docs/DATABASE_CHANGES.md`) · types: `import { Db } from '@nightlist/types'` (`Db.BarCard`, `Db.BarDetail` …)
- หน้าบ้านอ่านผ่าน view/RPC เท่านั้น (`bar_cards`, `bar_detail`, `public_reviews`, `my_bars`, `my_bookings`, `booking_detail`, `my_favorites`, `search_bars`, `nearby_bars`) — หนึ่งหน้า = หนึ่งการเรียก · **เขียนผ่าน NestJS เท่านั้น** (RLS ไม่เปิดให้หน้าบ้านเขียน)
- แก้ migration แล้วต้องรัน `pnpm --filter @nightlist/backend db:types` · migration ใหม่ต้องมี index บน FK + enable RLS + revoke write (ดูไฟล์ `…001500`)
