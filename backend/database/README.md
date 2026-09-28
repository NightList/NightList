# @nightlist/database

Supabase migrations, RLS, DB functions และ seed

```bash
pnpm --filter @nightlist/database db:start   # เปิด Supabase local (ต้องมี Docker)
pnpm --filter @nightlist/database db:reset   # รัน migrations + seed ใหม่
pnpm --filter @nightlist/database db:diff add_bars   # สร้าง migration จากการแก้ใน Studio
```

- Studio: http://127.0.0.1:54323
- อีเมลทดสอบ (local SMTP): http://127.0.0.1:54324
- ตั้งค่า pg_cron → `/jobs/*` ทำใน migration ของโมดูล jobs (ใช้ Vault เก็บ `JOB_SECRET`)
