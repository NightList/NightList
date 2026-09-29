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
- แผนที่ใช้ Leaflet + OpenStreetMap/CARTO (ไม่ใช้ Google Maps API) · หน้า `/map` เต็มจอ หมุดเป็นรูปร้าน (`coverUrl` หรือ gradient)
- ธีมมืดเป็นค่าเริ่มต้น · หน้า Auth ไม่มีปุ่มเปลี่ยนธีม/ปุ่มเข้าสู่ระบบบน navbar (`<Navbar minimal />`)
- ไม่มีแถบ "โหมดเดโม" บนหน้าเว็บ (ยังมีปุ่มเข้าเร็วเดโมในหน้า login และปุ่มรีเซ็ตในตั้งค่า)

## โหมดเดโม
- ถ้าไม่มี `VITE_SUPABASE_URL` แอปใช้ `@nightlist/mock` (ข้อมูลสมมติใน localStorage) — ห้ามใส่ชื่อร้านจริงใน seed
- ตอนต่อ API จริง ให้แทน service ของ mock ทีละหน้าด้วย TanStack Query + `src/services/api.ts`
