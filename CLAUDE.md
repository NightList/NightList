# CLAUDE.md — กติกาการทำงานใน repo NightList

## Branch
- ห้าม commit หรือ push เข้า `main` โดยตรง
- 1 module ต่อ 1 branch ตั้งชื่อเป็น `claude-แสน-<module>`
  - module: `docs`, `web`, `admin`, `api`, `services`, `database`, `infra`, `ui`, `types`, `config`, `utils`
  - feature ย่อยให้ต่อท้าย เช่น `claude-แสน-api-booking`
- ก่อนเริ่มงาน ให้แตก branch จาก `main` ล่าสุด
- งานเสร็จแล้ว push branch ขึ้น GitHub แล้วให้เจ้าของ repo เปิด / merge Pull Request

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
