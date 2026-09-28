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
