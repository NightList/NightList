# 🌙 NightList

**NightList** คือเว็บแอปสำหรับค้นหา จัดอันดับ และจองโต๊ะร้านกลางคืน เริ่มจากกรุงเทพฯ แล้วขยายไปทั่วประเทศ

ร้านแบ่งเป็น 3 ประเภท: **ผับ/บาร์** · **ร้านนั่งชิล** · **ร้านอาหารที่มีเครื่องดื่ม**

> **สถานะ:** 📝 Planning — ตอนนี้ repo นี้มีสเปคและ prompt สำหรับให้ AI สร้างโค้ด ยังไม่มีโค้ด

---

## ✨ ฟีเจอร์หลัก (MVP)

| ฟีเจอร์ | รายละเอียด |
|---|---|
| ⭐ **จัดอันดับดาว 1–5** | คิดคะแนนจากรีวิวที่เช็กอินจริง, จำนวนเช็กอิน, Safety Score และความครบของข้อมูลราคา แยกตามประเภทและย่าน |
| 💰 **Tag แนะนำ (Promoted)** | ร้านจ่ายเงินเพื่อขึ้นหน้าแรกหรือผลค้นหาได้ ติดป้าย "แนะนำ · โฆษณา" เสมอ และไม่มีผลต่อดาว |
| 🛡️ **ข้อมูลความปลอดภัย** | บอกว่าร้านมี ✅ / ไม่มี ❌ / ยังไม่มีข้อมูล ⚪ สำหรับ รปภ., CCTV, ทางหนีไฟ, ตรวจบัตร ฯลฯ พร้อมป้ายยืนยันโดย NightList |
| 🧮 **ประเมินราคาก่อนไป** | คำนวณจากเมนู + service charge + VAT แล้วแสดงยอดรวมและยอดต่อหัว เก็บ snapshot ราคาไว้ตอนจอง |
| 📅 **จองโต๊ะ + มัดจำ** | เลือกโซนหรือโต๊ะ, ป้องกันจองซ้อน, โอนมัดจำผ่าน PromptPay + อัปโหลดสลิป (เงินเข้าบัญชีร้านโดยตรง) |
| 📲 **QR Check-in** | การ์ดหรือ PR หน้าร้านสแกน QR ได้เลย ถ้าไม่มาเช็กอินเกินเวลาที่ร้านตั้งไว้ ระบบยกเลิกโต๊ะอัตโนมัติ |
| 👯 **Share to Gang** | แชร์บัตรจอง (แผนที่, เวลา, โซน) เข้ากลุ่ม LINE ได้ทันที |
| 🟢🟡🔴 **Crowd Status** | สถานะความแน่นของร้านแบบ real-time ที่ร้านกดอัปเดตเอง |
| 📝 **รีวิว** | รีวิวได้เฉพาะคนที่เช็กอินแล้ว 1 booking = 1 รีวิว |
| 🏪 **Merchant Dashboard** | จัดการร้าน เมนู โต๊ะ มัดจำ การจอง หน้า "คืนนี้" สำหรับ Staff และ Analytics |
| 🗂️ **Admin Backoffice** | อนุมัติร้าน, ยืนยัน Safety, ดูแลรีวิว, ค่าคอมมิชชัน (Billing Events) และ Audit Log |

**Core Loop:** `Discover → Estimate → Check Availability → Book → Check-in → Review`

---

## 🧱 Tech Stack

| ชั้น | เทคโนโลยี |
|---|---|
| Frontend | React + TypeScript + Vite + React Router + TanStack Query + Tailwind CSS + shadcn/ui |
| Backend | NestJS (TypeScript) + nestjs-zod + Swagger |
| Database | Supabase (PostgreSQL, Auth, Storage, Realtime, RLS, pg_cron) |
| Infra | Terraform (Vercel + Supabase providers) |
| Hosting | Vercel (`web`, `admin`, `api`) |
| Monorepo | pnpm workspaces + Turborepo |
| Auth | Phone OTP, Google, LINE Login |
| Notification | Web Push, LINE Messaging API, In-app |

## 📁 โครงสร้างโปรเจกต์ (แผน)

```
night-list/
├── apps/
│   ├── web/          # React — ลูกค้า + ร้าน (/merchant) + Staff Scanner (PWA)
│   └── admin/        # React — Backoffice ทีม NightList
├── packages/
│   ├── ui/           # shadcn/ui + theme ดำ·ทอง·ม่วง
│   ├── types/        # TypeScript types + Zod schemas
│   ├── config/       # eslint, tsconfig, tailwind preset
│   └── utils/        # price/star calculator, status transitions
├── backend/
│   ├── api/          # NestJS app (controllers, guards)
│   ├── services/     # NestJS domain modules + jobs
│   └── database/     # Supabase migrations, RLS, seed
├── infra/terraform/  # Vercel + Supabase (dev/staging/prod)
└── docs/
    └── PROMPT.md     # สเปคเต็ม + prompt สำหรับ AI
```

## 🎨 ดีไซน์

ธีม **ดำ · ทอง · ม่วง** — Dark, Nightlife, Premium, Mobile-first

| Token | สี | ใช้กับ |
|---|---|---|
| Background | `#09090B` | พื้นหน้า |
| Surface | `#111113` | การ์ด |
| Gold | `#D4AF37` | ปุ่มหลัก, ดาว, ยอดเงิน, ป้ายโฆษณา |
| Purple | `#7C3AED` | ปุ่มรอง, chip ที่เลือก, focus |
| Purple Light | `#A78BFA` | ลิงก์/ข้อความบนพื้นดำ |
| Text | `#F5F5F5` | ตัวอักษร |

---

## 🤖 วิธีใช้ Prompt

1. เปิดไฟล์ [`docs/PROMPT.md`](docs/PROMPT.md)
2. คัดลอกทั้งหมดไปวางใน AI สร้างโค้ด (Claude, Cursor, v0, Lovable, Bolt ฯลฯ)
3. AI จะเริ่มจากการเสนอ Sitemap + User Flow แล้วทำตาม "ลำดับการส่งงาน" ในไฟล์ทีละขั้น

## 🗺️ Roadmap

- **Phase 1 — MVP**
  - 1A: ฝั่งลูกค้า
  - 1B: ฝั่งร้าน (Merchant)
  - 1C: Admin Backoffice
- **Phase 2 — AI & Growth**
  - AI Recommendation และ Chatbot
  - Campaign tracking
  - Payment gateway อัตโนมัติ
  - eKYC
  - ขยายไปต่างจังหวัด

## ⚖️ ข้อกำหนดทางกฎหมาย

- **อายุ:** ต้องยืนยันอายุ 20 ปีขึ้นไป (Age Gate)
- **พ.ร.บ.ควบคุมเครื่องดื่มแอลกอฮอล์:**
  - ไม่โฆษณาเครื่องดื่มแอลกอฮอล์ และไม่ทำโปรลด แจก หรือแถมแอลกอฮอล์
  - ไม่ใช้คำเลี่ยงเพื่อทำโปรเหล่านี้
  - แพลตฟอร์มเน้นข้อมูลร้าน ราคา ความปลอดภัย และการจอง
- **PDPA:** มี Consent, Privacy Policy, ลบบัญชีได้ และใช้ตำแหน่งเฉพาะตอนจำเป็น
- ข้อความ "ดื่มไม่ขับ" พร้อมปุ่มเรียกรถกลับบ้าน

> ส่วนนี้เป็นแนวทางเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย ควรให้ทนายตรวจก่อนเปิดใช้งานจริง

---

© NightList
