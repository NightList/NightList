# CLAUDE.md — กติกาการทำงานใน repo NightList

## Branch
- มีแค่ 2 branch: `demo` (dev) และ `main` (deploy ขึ้นเว็บ)
- ทำงานและ push ที่ `demo` เท่านั้น ห้าม push ตรงเข้า `main` และไม่ต้องแตก branch ย่อย
- เจ้าของ repo เป็นคน merge `demo → main` เมื่อทดสอบแล้ว

## Commit
- ใช้ Conventional Commits เช่น `feat(api): ...`, `fix(web): ...`, `docs: ...`
- 1 commit = 1 เรื่อง

## สเปค
- สเปคหลักอยู่ที่ `docs/PROMPT.md` ถ้าสเปคเปลี่ยน ให้อัปเดตไฟล์นี้ใน branch `claude-แสน-docs`

## Skills
- `.claude/skills/ant-design` และ `.claude/skills/antd` (จาก ant-design/antd-skill) ใช้ทุกครั้งที่เขียน UI (antd v6 ใช้ทั้ง `apps/web` และ `apps/admin`)
- ก่อนเขียนโค้ด antd: `antd info <Component> --format json` / หลังแก้: `antd lint <path> --format json`
- Tailwind ใช้กับ layout/ตกแต่งเท่านั้น, ไอคอนใช้ Phosphor (`@phosphor-icons/react`) ห้ามใช้ `@ant-design/icons`
- สถาปัตยกรรมและ route อ้างอิง `docs/ARCHITECTURE.md` และ `docs/SITEMAP.md`

## React
- ใช้ function component + hooks เท่านั้น (ยกเว้น `ErrorBoundary`) และ logic ที่ใช้ซ้ำให้แยกเป็น custom hook
- HOC ใช้เฉพาะเรื่องที่ครอบหลายหน้า ส่วนเรื่องสิทธิ์ใช้ layout route `<RequireAuth>` / `<RequireRole>`

## Auth
- เข้าสู่ระบบด้วย email + password ของ Supabase Auth (supabase-js) ส่วน NestJS แค่ตรวจ JWT ห้ามเพิ่ม OTP / social login โดยไม่ได้ตกลงกันก่อน

## คำสั่ง
- ติดตั้ง: `pnpm install` · รัน: `pnpm dev` · ตรวจก่อน commit: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- package ภายใน build ด้วย tsup/tsc → แอปต้องรอ `^build` (Turborepo จัดการให้)
- สี / ธีม: แก้ที่ `packages/ui/src/tokens.ts` และ `theme.css` ให้ตรงกัน (มี test ตรวจ)

## โหมดเดโม
- ถ้าไม่มี `VITE_SUPABASE_URL` แอปใช้ `@nightlist/mock` (ข้อมูลสมมติใน localStorage) — ห้ามใส่ชื่อร้านจริงใน seed
- ตอนต่อ API จริง ให้แทน service ของ mock ทีละหน้าด้วย TanStack Query + `shared/lib/api-client.ts`
