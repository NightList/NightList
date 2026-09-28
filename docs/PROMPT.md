# Prompt: NightList — เว็บแอปรวมร้านกลางคืน + Tier List + จองโต๊ะ (v2.3)

> คัดลอกทั้งหมดด้านล่างไปใช้กับ AI สร้างโค้ด (Claude, Cursor, v0, Lovable, Bolt ฯลฯ)

---

## บทบาท
คุณเป็น Full-stack Developer และ UX Designer ช่วยสร้างเว็บแอป **"NightList"** (Responsive, Mobile-first, ทำเป็น PWA ได้) UI เป็นภาษาไทยทั้งหมด

NightList เป็นแพลตฟอร์มสำหรับค้นหา จัดอันดับ และจองโต๊ะร้านกลางคืน โดยเริ่มจากกรุงเทพฯ แล้วค่อยขยายไปทั่วประเทศ ร้านแบ่งเป็น 3 ประเภทหลัก คือ **ผับ/บาร์**, **ร้านนั่งชิล** และ **ร้านอาหารที่มีเครื่องดื่ม**

**Core Loop:** Discover → Estimate → Check Availability → Book → Check-in → Review

## เสาหลัก 4 ข้อของสเปค
1. **Tier List ร้านกลางคืน**: จัดอันดับร้านในกรุงเทพฯ (อนาคตทั่วประเทศ)
2. **จองโต๊ะ**: มีมัดจำ, เช็กอินด้วย QR และยกเลิกอัตโนมัติ
3. **ความปลอดภัยของร้าน**: บอกให้ชัดว่าร้านไหนมีมาตรการความปลอดภัยอะไร และร้านไหนไม่มี
4. **ความโปร่งใสเรื่องราคา**: รู้ค่าใช้จ่ายโดยประมาณก่อนไป

## ปัญหาที่จะแก้
1. ลูกค้าไม่รู้ราคากลางของร้าน ไม่รู้ว่าไป 3-4 คนจะจ่ายเท่าไหร่
2. ร้านที่ไม่ดังแทบไม่มีคนไป ต้องการช่องทางดึงลูกค้า
3. หาร้านตามสไตล์ที่ชอบยาก ไม่รู้ว่าร้านไหนเข้ากับกลุ่มตัวเอง
4. ลูกค้าจองแล้วไม่มา (No-show) ซึ่งเป็นปัญหาใหญ่ของร้าน
5. ไม่รู้ว่าร้านปลอดภัยแค่ไหน และไม่รู้ว่าตอนนี้ร้านแน่นหรือยังก่อนออกเดินทาง
6. เพื่อนในกลุ่มหาร้านไม่เจอ หรือจำเวลานัดไม่ได้

---

## User Roles

**Customer**
- สมัครสมาชิก / เข้าสู่ระบบ
- ค้นหาและกรองร้าน
- ดู Tier List และคะแนนความปลอดภัย
- ดูเมนูและราคา และคำนวณค่าใช้จ่ายโดยประมาณ
- ดูโต๊ะว่าง จองโต๊ะ และจ่ายมัดจำ
- แชร์การจองให้เพื่อน
- เช็กอินด้วย QR
- รีวิวร้าน และบันทึกร้านโปรด

**Merchant (เจ้าของร้าน + พนักงานหน้าร้าน/การ์ด/PR)**
- สมัครและยืนยันตัวตนร้าน
- จัดการข้อมูลร้าน รูป เมนู ราคา แพ็กเกจ และโซน/โต๊ะ
- ตั้งค่ามัดจำและตรวจสลิปโอนเงิน
- ยืนยันหรือปฏิเสธการจอง
- สแกน QR เพื่อเช็กอินลูกค้า
- อัปเดตสถานะความแน่นของร้าน
- กรอกข้อมูลความปลอดภัยของร้าน
- ดูรีวิวและ Analytics
- Sub-role **Staff**: สิทธิ์สแกน QR, ดูรายการจองของคืนนั้น และอัปเดตความแน่นเท่านั้น

**Admin (ทีมเรา)**
- อนุมัติหรือระงับร้าน
- ตรวจสอบและยืนยันข้อมูลความปลอดภัยของร้าน
- ดูแลรีวิวที่ถูกรายงาน จัดการดาว/Tier และอนุมัติการโปรโมท
- จัดการค่าคอมมิชชัน
- ดู Audit Log

## Customer Flow
Age Gate (20+) → Onboarding (ความชอบ) → Home / Tier List / Search → Restaurant Detail → Menu/Pricing → Price Estimate → Availability → Booking (+มัดจำ) → Merchant Confirmation → Share to Gang → QR Check-in → Completed → Review

---

## ฟีเจอร์หลัก (MVP)

### 1. Tier List ⭐
- จัดอันดับร้านเป็น **ระดับดาว 1–5 ดาว (⭐–⭐⭐⭐⭐⭐)** แยกตามประเภท (ผับ/บาร์, นั่งชิล, ร้านอาหารที่มีเครื่องดื่ม) และตามย่าน
  - ระบบคำนวณคะแนนรวม 0–100 แล้วแปลงเป็นดาว: 90+ = 5 ดาว, 75–89 = 4 ดาว, 60–74 = 3 ดาว, 40–59 = 2 ดาว, ต่ำกว่า 40 = 1 ดาว
  - ร้านที่มีรีวิวจากการเช็กอินจริงน้อยกว่า 5 รีวิว ให้แสดงเป็น "ร้านใหม่" แทนดาว
  - ดาวของ NightList ต่างจากคะแนนรีวิว (rating ที่ลูกค้าให้) ต้องแสดงแยกกันให้ชัด
- **คะแนนคำนวณจาก:**
  - รีวิวที่มาจากการเช็กอินจริงเท่านั้น (ถ่วงน้ำหนักตามความใหม่ของรีวิว)
  - จำนวนการเช็กอินจริงผ่านแอป
  - คะแนนความปลอดภัย (ข้อ 3)
  - ความครบถ้วนของข้อมูลราคา
- มีตัวเลือก **Editor's Pick** ที่แอดมินปักหมุดได้ แต่ต้องแยกป้ายให้ชัดว่าเป็นการคัดเลือกโดยทีม ไม่ใช่คะแนนจากระบบ
- **ร้านจ่ายเงินเพื่อเพิ่มดาวไม่ได้** ดาวมาจากคะแนนระบบเท่านั้น ส่วนการโปรโมทแบบจ่ายเงินดูที่ข้อ 1.1
- เก็บประวัติดาวรายเดือน เพื่อให้แสดงได้ว่าร้าน "ขึ้น/ลงดาว"

### 1.1 Tag แนะนำแบบจ่ายเงิน (Promoted Listing) 💰
- ร้านจ่ายเงินเพื่อขึ้น **Tag "แนะนำ"** และได้ตำแหน่งโปรโมทในหน้าแรก (Home) และผลค้นหา
- **แพ็กเกจโปรโมท** (แอดมินตั้งราคาได้):
  - ระยะเวลา: 7 / 14 / 30 วัน
  - ตำแหน่ง: Home Banner, Home "ร้านแนะนำ", อันดับต้นในผลค้นหาตามย่าน/ประเภท
  - จำนวนช่องโปรโมทต่อตำแหน่งต่อย่านมีจำกัด (เช่น 3 ช่อง) เพื่อไม่ให้หน้าแรกเต็มไปด้วยโฆษณา
- **ความโปร่งใส:**
  - ทุกการ์ดที่โปรโมทต้องมีป้าย **"แนะนำ · โฆษณา"** ให้เห็นชัด
  - การโปรโมทไม่มีผลต่อดาว คะแนนรีวิว หรือ Safety Score
  - ร้านที่ถูกระงับหรือมี Safety Score ต่ำกว่าเกณฑ์ ซื้อโปรโมทไม่ได้
  - เนื้อหาโปรโมทต้องทำตามนโยบายถ้อยคำ (ห้ามโฆษณาเครื่องดื่มแอลกอฮอล์)
- **การจ่ายเงินใน MVP:**
  - ร้านเลือกแพ็กเกจใน Merchant Dashboard → โอน PromptPay ของ NightList → อัปโหลดสลิป
  - แอดมินตรวจแล้วเปิดใช้งาน ระบบเริ่มและหมดอายุตามวันที่อัตโนมัติ
  - payment gateway อัตโนมัติอยู่ใน Phase 2
- **Analytics ของร้าน:** impressions, clicks และจำนวนการจองที่มาจากตำแหน่งโปรโมท

### 2. ค้นหาและแนะนำร้าน
- **ค้นหาจาก:** ชื่อร้าน, ย่าน, ร้านใกล้ฉัน, ประเภทร้าน, งบต่อหัว, จำนวนคน, วัน/เวลาที่ว่าง, ความแน่นตอนนี้ และมาตรการความปลอดภัย
- ผลค้นหาแสดงร้านที่โปรโมท (ข้อ 1.1) ไว้ด้านบนพร้อมป้าย "แนะนำ · โฆษณา" ส่วนลำดับที่เหลือเรียงตามความเกี่ยวข้อง/ดาว/ระยะทาง
- **Style ของร้าน:** Live Music, Chill, Pub/Dance, Rooftop, Food-focused, Quiet, Outdoor, Private Room, Buffet
- **Recommendation ใน MVP เป็นแบบ rule-based** ดูจากความชอบตอน Onboarding + Style + งบ + ระยะทาง + โต๊ะว่าง ส่วน AI Recommendation / Chatbot อยู่ใน **Phase 2**
- Style เก็บเป็นตาราง `styles` (master) + `bar_styles` (many-to-many) ไม่เก็บเป็น array ใน `bars`
- **Location:** ขอสิทธิ์ตำแหน่งเฉพาะตอนกด "ร้านใกล้ฉัน" ใช้พิกัดคำนวณระยะแล้วไม่บันทึกลงฐานข้อมูล ถ้าไม่อนุญาตให้เลือกย่านแทน

### 3. ข้อมูลความปลอดภัยของร้าน (Safety Info) ⭐
แต่ละร้านมี checklist แสดงเป็นไอคอน โดยแยกให้เห็นชัดว่า **มี ✅ / ไม่มี ❌ / ยังไม่มีข้อมูล ⚪** ดังนี้
- รปภ./การ์ด
- กล้อง CCTV
- ทางหนีไฟและถังดับเพลิง
- ชุดปฐมพยาบาล
- ตรวจบัตรประชาชน (20+)
- จุดจอดรถ และบริการเรียกรถกลับบ้าน
- พนักงานหญิงช่วยดูแล
- ความสว่างบริเวณทางเข้า/ที่จอดรถ
- ช่องทางแจ้งเหตุฉุกเฉินในร้าน

**ระดับความน่าเชื่อถือของข้อมูล:**
- "ร้านแจ้งเอง": ร้านกรอกข้อมูลเอง
- "ยืนยันโดย NightList": แอดมินตรวจจากรูป/เอกสาร หรือไปดูหน้างานแล้ว
- ลูกค้าที่เช็กอินแล้วโหวตได้ว่าข้อมูลตรงหรือไม่ ถ้ามีรายงานว่าไม่ตรงหลายครั้ง ระบบจะเปิดเรื่องให้แอดมินตรวจ

**คะแนนความปลอดภัย (Safety Score):** คิดเป็น 0-100 แสดงบนการ์ดร้าน และใช้เป็นตัวกรองได้

### 4. สถานะความแน่นของร้าน (Crowd Status)
- แถบสถานะแบบ real-time: 🟢 ว่าง / 🟡 ใกล้เต็ม / 🔴 โต๊ะเต็ม
- ร้านหรือ Staff กดอัปเดตได้ในแตะเดียว แสดงบนการ์ดร้านพร้อมเวลาที่อัปเดตล่าสุด
- ถ้าไม่ได้อัปเดตเกิน 60 นาที ให้แสดงเป็น "ไม่ทราบสถานะ"
- ใช้ Supabase Realtime

### 5. ความโปร่งใสเรื่องราคา (Price Transparency)
- **หน้าร้านแสดง:**
  - ราคาเมนู
  - ราคาเฉลี่ยต่อคน
  - แพ็กเกจ เช่น "เซ็ตโต๊ะ 3-4 คน ประมาณ X บาท"
  - Service Charge, VAT, ค่าเปิดขวด/ค่าอื่นๆ
- **ตัวคำนวณ:** Selected Items × Quantity + Service Charge + VAT + Other Fees = **Estimated Total** และยอดต่อหัว
- ต้องระบุว่าเป็น "ราคาโดยประมาณ" เสมอ และไม่รับประกันราคาสุดท้าย ถ้าร้านไม่ได้กำหนดราคาตายตัว
- **Price Snapshot:** เมื่อกดจอง ให้บันทึกผลการประเมินราคาลง `booking_price_snapshots` (รายการ, จำนวน, ราคาต่อหน่วย, service charge %, VAT %, ค่าอื่นๆ, ยอดรวม, ยอดต่อหัว) เพื่อให้ราคาที่ลูกค้าเห็นตอนจองไม่เปลี่ยนตามเมื่อร้านแก้ราคาภายหลัง
- **Package Snapshot:** ถ้าเลือกแพ็กเกจ ให้ copy ชื่อแพ็กเกจ รายการ ราคา และค่าธรรมเนียม ณ ตอนจอง ลง `booking_package_snapshots`

### 6. จองโต๊ะ + มัดจำ (Deposit)
- ลูกค้าเลือกร้าน วัน เวลา จำนวนคน และโซน โดย **ระบุโต๊ะหรือไม่ก็ได้**:
  - `zone_id` บังคับ ส่วน `table_id` เป็น optional
  - ถ้าลูกค้าไม่เลือกโต๊ะ ร้านจะ assign โต๊ะตอนยืนยันหรือตอนเช็กอิน
  - ร้านเล็กที่ไม่แบ่งโต๊ะ ใช้โซนเดียว (เช่น "ทั้งร้าน") พร้อมกำหนดความจุรวมได้
- **Availability แบบ Reservation Interval:**
  - ทุกการจองเก็บเป็นช่วงเวลา `reserved_from` – `reserved_until` (ร้านตั้ง `default_duration_minutes` ต่อโซน เช่น 180 นาที)
  - เก็บเป็นคอลัมน์ `tstzrange` ชื่อ `reserved_period`
- **Overlap Protection (ป้องกัน Double Booking):**
  - ระดับโต๊ะ: ใช้ PostgreSQL exclusion constraint `EXCLUDE USING gist (table_id WITH =, reserved_period WITH &&)` เฉพาะสถานะที่ยังถือโต๊ะอยู่ (PENDING, AWAITING_DEPOSIT, DEPOSIT_SUBMITTED, CONFIRMED, CHECKED_IN)
  - ระดับโซน (กรณีไม่ระบุโต๊ะ): ตรวจความจุโซนใน transaction ที่ `SELECT ... FOR UPDATE` เพื่อไม่ให้จองเกินจำนวนโต๊ะหรือจำนวนคนที่โซนรับได้
  - การเช็กโต๊ะว่างใน UI ต้องใช้ logic เดียวกันกับตอนบันทึก
- **ระบบมัดจำ (ร้านเลือกเปิดหรือปิดเองได้):**
  - ร้านตั้งยอดมัดจำขั้นต่ำ (ต่อโต๊ะหรือต่อคน) และใส่ PromptPay QR ของร้าน
  - ลูกค้าโอนเข้าบัญชีร้านโดยตรง แล้วอัปโหลดสลิป
  - ร้านกดตรวจและยืนยัน ระบบจะอ่าน QR ในสลิปเพื่อช่วยตรวจยอดและเวลาเบื้องต้น
  - **แพลตฟอร์มไม่ถือเงินลูกค้า** เพื่อไม่ต้องเป็นผู้ให้บริการชำระเงิน
  - ร้านต้องประกาศนโยบายมัดจำให้ชัดก่อนลูกค้าโอน ได้แก่ หักเป็นค่าอาหาร / คืนได้ถ้ายกเลิกก่อน X ชม. / ไม่คืนถ้า No-show
  - ถ้ามัดจำไม่ได้รับการยืนยันภายในเวลาที่กำหนด ให้ booking เป็น EXPIRED
- **Booking Status:** PENDING, AWAITING_DEPOSIT, DEPOSIT_SUBMITTED, CONFIRMED, REJECTED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_MERCHANT, CHECKED_IN, COMPLETED, NO_SHOW, EXPIRED
- **Status Transition Rules:** เปลี่ยนสถานะได้เฉพาะตามตารางนี้ ต้อง validate ฝั่ง server (หรือใช้ DB function) และบันทึกทุกครั้งลง `booking_status_history` (from, to, changed_by, reason, created_at)

| จาก | ไปได้ | ผู้ทำ |
|---|---|---|
| PENDING | AWAITING_DEPOSIT, CONFIRMED, REJECTED, CANCELLED_BY_CUSTOMER, EXPIRED | ระบบ / ร้าน / ลูกค้า |
| AWAITING_DEPOSIT | DEPOSIT_SUBMITTED, CANCELLED_BY_CUSTOMER, EXPIRED | ลูกค้า / ระบบ |
| DEPOSIT_SUBMITTED | CONFIRMED, AWAITING_DEPOSIT (สลิปไม่ผ่าน), REJECTED | ร้าน |
| CONFIRMED | CHECKED_IN, NO_SHOW, CANCELLED_BY_CUSTOMER, CANCELLED_BY_MERCHANT | Staff / ระบบ / ลูกค้า / ร้าน |
| CHECKED_IN | COMPLETED | ร้าน / ระบบ (ปิดอัตโนมัติหลัง `reserved_until`) |
| REJECTED, CANCELLED_*, NO_SHOW, EXPIRED, COMPLETED | — (สถานะสุดท้าย) | — |

- สถานะ **PENDING** ที่ร้านไม่ตอบภายในเวลาที่กำหนด (เช่น 30 นาที หรือก่อนเวลาจอง) จะกลายเป็น **EXPIRED**
- **NO_SHOW** ใช้เมื่อการจองที่ CONFIRMED แล้วเลย `auto_cancel_at` โดยไม่มีการเช็กอิน

### 7. แชร์การจองให้เพื่อน (Share to Gang)
- หลังจองสำเร็จ มีปุ่มแชร์ "บัตรจอง" ที่มีชื่อร้าน แผนที่ (ลิงก์ Google Maps) วัน-เวลา โซนโต๊ะ และชื่อคนจอง
- แชร์เข้า LINE ได้ทันที (LINE share URL หรือ LIFF) และมี Web Share API สำหรับแอปอื่น
- ลิงก์เปิดเป็นหน้า public ที่ไม่ต้องล็อกอิน และไม่แสดงข้อมูลส่วนตัว เช่น เบอร์โทร หรือ QR เช็กอิน
- (ตัวเลือก) เพื่อนกด "ไปด้วย" เพื่อให้คนจองเห็นว่ามีใครไปบ้าง

### 8. QR Check-in + ยกเลิกอัตโนมัติ
- **QR Check-in:**
  - เมื่อการจอง CONFIRMED ลูกค้าจะได้ QR Code ที่เป็น signed token ใช้ครั้งเดียว และหมดอายุหลัง auto_cancel_at
  - การ์ดหรือ PR หน้าร้านเปิดหน้า Staff Scanner บนมือถือ (ใช้กล้องผ่านเว็บ) แล้วสแกน ระบบจะเช็กอินทันที พร้อมแสดงชื่อ จำนวนคน และโซน
  - มี Manual Check-in สำรอง (ค้นหาจากชื่อหรือรหัสจอง)
  - บันทึกลงตาราง `checkins`: `checked_in_at`, `checked_in_by` (user id ของ Staff/ร้าน) และ `method` (`QR` / `MANUAL`)
  - booking หนึ่งรายการเช็กอินได้ครั้งเดียว (unique `booking_id`)
  - การเช็กอินจะสร้าง Billing Event `CHECK_IN` (ดูข้อ 13)
- **Auto Cancellation:**
  - ร้านตั้ง Grace Period ได้เอง (เช่น 15 / 30 / 60 นาที) ระบบคำนวณ `auto_cancel_at = booking_datetime + grace_period`
  - แจ้งเตือนลูกค้าก่อนหมดเวลา
  - ถ้าไม่มีการเช็กอิน สถานะจะเป็น NO_SHOW แล้วโต๊ะกลับไปว่าง
  - แจ้งทั้งลูกค้าและร้าน ส่วนมัดจำเป็นไปตามนโยบายที่ร้านประกาศไว้
  - การเปลี่ยนเป็น NO_SHOW จะสร้าง Billing Event `NO_SHOW` (ดูข้อ 13)

### 9. เมนูร้าน
- ร้านอัปโหลดเมนูพร้อมรูป ราคา และหมวดหมู่
- ติดสถานะ available ได้

### 10. รีวิว
- รีวิวได้เฉพาะ booking ที่ CHECKED_IN หรือ COMPLETED ให้คะแนน เขียนความเห็น และแนบรูป
- **1 booking รีวิวได้ 1 ครั้ง** (unique constraint บน `reviews.booking_id`) แก้ไขได้ แต่สร้างใหม่ซ้ำไม่ได้
- แสดงแบบแกลเลอรีรูป
- มีระบบรายงานรีวิว (Report Review), Moderation และ log ฝั่งแอดมิน

### 11. โปรโมชันสำหรับคนจองผ่านแอป (ต้องเป็นไปตามข้อ "นโยบายถ้อยคำ" ด้านล่าง)
- **อนุญาตเฉพาะสิทธิประโยชน์ที่ไม่ใช่เครื่องดื่มแอลกอฮอล์** เช่น
  - ส่วนลดค่าอาหาร
  - อาหารทานเล่นฟรี
  - น้ำดื่ม/ซอฟต์ดริงก์ฟรี
  - ยกเว้นค่าเข้า/ค่าโต๊ะ
  - โต๊ะโซนพิเศษ
- **ห้ามมีโปรลดราคา แจก หรือซื้อ 1 แถม 1 สำหรับเครื่องดื่มแอลกอฮอล์**

### 12. Merchant Dashboard
- **Merchant Verification:** DRAFT → PENDING_REVIEW → APPROVED / REJECTED / SUSPENDED
- **จัดการข้อมูล:** ร้าน, รูป, เวลาเปิด-ปิด, เมนู, ราคา, แพ็กเกจ, โซน/โต๊ะ, มัดจำ, Grace Period, Safety Info และโปรโมชัน
- **การจอง:** ดูแบบปฏิทินหรือรายการ, ตรวจสลิป และยืนยันหรือปฏิเสธ
- **หน้าจอ "คืนนี้" สำหรับ Staff:** ปุ่มสแกน QR, รายการจองของคืนนี้ และปุ่มอัปเดตความแน่น
- **Analytics:** จำนวนการจอง, อัตราเช็กอิน, อัตรา No-show, ช่วงเวลาที่คนจองเยอะ, ดาว และผลของการโปรโมท
- **โปรโมทร้าน:** เลือกแพ็กเกจ, อัปโหลดสลิป และดูสถานะ/วันหมดอายุ

### 13. Admin + โมเดลรายได้
- ให้ร้านใช้ฟรีช่วงทดลอง (`trial_ends_at`) หลังจากนั้นเก็บค่าคอมมิชชัน
- **Commission Rule แยกจากตาราง `bars`:**
  - ตาราง `commission_rules` มีฟิลด์ bar_id, calculation_type (`PERCENTAGE` / `FIXED` / `FIXED_PER_PERSON`), rate, `charge_on_no_show`, `no_show_rate`, effective_from, effective_to และ created_by
  - ร้านหนึ่งมีได้หลาย rule ตามช่วงเวลา แต่ต้องไม่ทับกัน การแก้ rate ให้สร้าง rule ใหม่แทนการแก้ของเดิม เพื่อเก็บเป็น history
  - ตอนคำนวณค่าคอม ให้ใช้ rule ที่มีผล ณ `booking_datetime`
- **Billing Events:** ตาราง `billing_events` มีฟิลด์ booking_id, bar_id, event_type, commission_rule_id, base_amount, amount, status (`PENDING` / `INVOICED` / `PAID` / `WAIVED`) และ period
  - **`CHECK_IN`:** สร้างเมื่อเช็กอินสำเร็จ คิดค่าคอมตาม rule โดย base_amount มาจาก Price Snapshot (หรือจำนวนคน ถ้าเป็น FIXED_PER_PERSON)
  - **`NO_SHOW`:** สร้างเมื่อ booking เป็น NO_SHOW แต่จะคิดเงินเฉพาะเมื่อ rule ตั้ง `charge_on_no_show = true` (ค่าเริ่มต้นคือ false) ถ้าตั้งไว้ ให้คิดจาก `no_show_rate` เช่น % ของมัดจำที่ร้านยึดไว้
  - ถ้าอยู่ในช่วง trial ให้สร้าง event เป็น `WAIVED`
  - booking หนึ่งรายการมี billing event แต่ละประเภทได้ 1 รายการ (unique `booking_id` + `event_type`)
  - ไม่สร้าง event สำหรับ PENDING, REJECTED, CANCELLED_* และ EXPIRED
- แอดมินดูสรุปรายเดือนจาก `billing_events` และออก invoice ได้
- **แอดมินทำได้:**
  - ดูสรุปค่าคอมรายเดือน
  - อนุมัติหรือระงับร้าน
  - ยืนยัน Safety Info
  - ดูแลรีวิว
  - ปักหมุด Editor's Pick
  - ตั้งราคาแพ็กเกจโปรโมท, ตรวจสลิป และเปิด/ปิดการโปรโมท
  - ดู Audit Log

### 14. โซเชียลและการตลาด
- **External Links เท่านั้น:** ร้านใส่ลิงก์ IG, TikTok, Facebook, LINE OA, เว็บไซต์ และลิงก์คลิปรีวิวได้ ตารางคือ `bar_links` (bar_id, type, url, sort_order) และตรวจ URL/โดเมนตาม type
- หน้าร้านทุกหน้ามี OG image สำหรับแชร์
- **ไม่ดึงข้อมูลจากโซเชียลใดๆ ใน MVP** ไม่ว่าจะเป็นโพสต์ ยอดผู้ติดตาม หรือการเช็กอินจาก IG/Facebook
  - Meta ไม่เปิด API ให้ดึงข้อมูลการเช็กอินของผู้ใช้ทั่วไปแล้ว
  - การ scrape ผิดเงื่อนไขการใช้งานและ PDPA
- Campaign/UTM tracking ไม่อยู่ใน MVP schema

### 15. Favorite และ Notification
- **Favorite:** บันทึกร้านที่สนใจ
- **Notification:** แจ้งเมื่อ booking ถูกสร้าง, ยืนยัน, ปฏิเสธ, ยกเลิก, เมื่อมัดจำได้รับการยืนยัน, แจ้งเตือนก่อนถึงเวลา, เตือนก่อนยกเลิกอัตโนมัติ, เมื่อเช็กอิน และชวนรีวิว
- **ช่องทาง:** Web Push, LINE Messaging API และ In-app (กระดิ่งในเว็บ)
- **สถานะของแต่ละการส่ง:** `notifications` (1 รายการต่อผู้รับต่อเหตุการณ์) + `notification_deliveries` (1 รายการต่อช่องทาง) โดยมีฟิลด์:
  - status: `QUEUED` / `SENT` / `FAILED` / `RETRYING`
  - attempt_count, last_error, next_retry_at, sent_at
  - `read_at` สำหรับ In-app
  - retry แบบ exponential backoff สูงสุด 5 ครั้ง ถ้ายังไม่ผ่านให้เป็น FAILED แล้วส่งช่องทางสำรอง (In-app)
- **แยก Authentication กับ Notification:**
  - LINE Login ใช้สำหรับยืนยันตัวตนเท่านั้น การส่ง LINE ต้องให้ผู้ใช้เพิ่มเพื่อน LINE OA และยินยอม (opt-in) แยกต่างหาก
  - เก็บช่องทางแจ้งเตือนไว้ใน `notification_channels` (user_id, channel, line_user_id / push_subscription, opted_in_at, opted_out_at) ไม่ปนกับตาราง auth
  - ผู้ใช้ที่ล็อกอินด้วยเบอร์โทรหรือ Google ก็เปิดรับ LINE ได้ และผู้ใช้ LINE Login ปิดการแจ้งเตือนได้

---

## นโยบายถ้อยคำและกฎหมาย (Wording & Legal Policy) ⚠️
ระบบต้องเน้นข้อมูลร้าน บรรยากาศ ราคา ความปลอดภัย และการจอง **ไม่ใช่การชักชวนให้ดื่ม** ตามแนว พ.ร.บ.ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ. 2551

**ห้าม:**
- ใช้ชื่อหรือโลโก้ยี่ห้อเครื่องดื่มแอลกอฮอล์ในการโฆษณาหรือแบนเนอร์
- ใช้ถ้อยคำเชิญชวนให้ดื่ม เช่น "ดื่มให้สุด" หรือ "ยิ่งดื่มยิ่งคุ้ม"
- ทำโปรลดราคา แจก หรือแถมเครื่องดื่มแอลกอฮอล์
- **ใช้คำแสลงหรือคำเลี่ยงมาแทนชื่อเครื่องดื่มเพื่อทำโปรที่ผิดกฎหมาย** เพราะกฎหมายดูที่เนื้อหาและเจตนา การเปลี่ยนคำไม่ทำให้ถูกกฎหมาย

**ให้ใช้:**
- คำกลางๆ เชิงข้อมูล เช่น "เครื่องดื่ม", "เซ็ตโต๊ะ", "แพ็กเกจโต๊ะ 3-4 คน", "สิทธิพิเศษเมื่อจองผ่าน NightList"
- ราคาเมนูแสดงเป็นข้อมูลรายการในหน้าร้านได้ แต่ไม่ทำเป็นแบนเนอร์หรือโฆษณาดัน

**อื่นๆ:**
- **Age Gate 20+:**
  - ผู้เยี่ยมชมต้องยืนยันว่าอายุ 20 ปีขึ้นไป ก่อนเห็นเนื้อหา
  - ตอนสมัคร ต้องกรอกวันเกิดและตรวจว่าอายุ 20+
  - `age_verification_method` เป็น `SELF_DECLARED` (MVP), `ID_CHECK_AT_VENUE` (Staff ติ๊กยืนยันตอนเช็กอินหลังดูบัตร) หรือ `EKYC` (Phase 2)
  - บันทึก `age_verified`, `age_verified_at` และ `age_verification_method`
- **Consent:**
  - ตาราง `user_consents` (user_id, consent_type, version, granted, granted_at, revoked_at)
  - consent_type: TERMS, PRIVACY, AGE_CONFIRMATION, LOCATION, MARKETING, LINE_NOTIFICATION
  - ถ้าเอกสารเปลี่ยนเวอร์ชัน ต้องให้ผู้ใช้ยอมรับใหม่
- มีข้อความ "ดื่มไม่ขับ" และปุ่มเรียกรถกลับบ้าน (ลิงก์ Grab / Bolt)
- ทำตาม PDPA:
  - มี Privacy Policy, Terms, Cookie Policy และ Consent Management
  - ผู้ใช้ลบบัญชีได้ และมี Data Retention Policy
  - สลิปมัดจำเก็บเท่าที่จำเป็น แล้วลบตามรอบที่กำหนด
- ขอสิทธิ์ตำแหน่งเฉพาะตอนใช้ "ร้านใกล้ฉัน" ไม่ track ตลอดเวลา และไม่บันทึกพิกัดของผู้ใช้
- ให้ AI ที่เขียนข้อความในระบบ (copy, seed data, โปรตัวอย่าง) ทำตามนโยบายนี้ทุกครั้ง

---

## Database (MVP Schema)
- **ผู้ใช้และสิทธิ์:** users, user_preferences, user_consents, auth_identities (provider: PHONE / GOOGLE / LINE)
- **แจ้งเตือน (แยกจาก auth):** notification_channels, notifications, notification_deliveries
- **ร้าน:** bars, bar_hours, styles, bar_styles, bar_media, bar_links, bar_verifications, bar_staff, bar_safety_features, safety_reports, crowd_status_logs
- **จัดอันดับ:** tier_scores, tier_history
- **เมนูและราคา:** menu_categories, menu_items, price_packages, price_package_items, bar_fees (service charge, VAT, ค่าเปิดขวด)
- **โต๊ะและการจอง:** table_zones, tables, bookings, booking_status_history, booking_price_snapshots, booking_package_snapshots, deposits, checkins, booking_shares
- **รีวิว:** reviews, review_images, review_reports, review_moderation_logs
- **โปรโมท:** promotion_packages, promoted_listings, promoted_listing_payments, promoted_listing_stats
- **อื่นๆ:** favorites, promotions, commission_rules, billing_events, audit_logs
- **ไม่อยู่ใน MVP schema:** campaigns, campaign_clicks และตารางที่ใช้ดึงข้อมูลจากโซเชียล

**ฟิลด์สำคัญ**
- `users`: id, name, phone, birthdate, role (CUSTOMER / MERCHANT / STAFF / ADMIN), age_verified, age_verified_at, age_verification_method
- `auth_identities`: id, user_id, provider, provider_user_id, created_at (ใช้ยืนยันตัวตนเท่านั้น)
- `notification_channels`: id, user_id, channel (LINE / WEB_PUSH / IN_APP), line_user_id, push_subscription, opted_in_at, opted_out_at
- `notifications`: id, user_id, event_type, booking_id, payload, read_at, created_at
- `notification_deliveries`: id, notification_id, channel, status (QUEUED / SENT / FAILED / RETRYING), attempt_count, last_error, next_retry_at, sent_at
- `bars`: id, owner_id, slug, name, category (PUB_BAR / CHILL / RESTAURANT), description, address, district, province, lat, lng, status, trial_ends_at, deposit_enabled, deposit_amount, deposit_unit (PER_TABLE / PER_PERSON), promptpay_id, deposit_policy, grace_period_minutes, pending_timeout_minutes, safety_score, current_tier
  - ไม่มี open_hours, styles หรือ commission ในตารางนี้
- `bar_hours`: id, bar_id, day_of_week, open_time, close_time, is_closed, special_date (กรณีวันหยุด/วันพิเศษ) และรองรับเวลาปิดข้ามเที่ยงคืน (เช่น 18:00–02:00)
- `styles`: id, key, name_th, icon · `bar_styles`: bar_id, style_id (PK คู่)
- `bar_links`: id, bar_id, type (INSTAGRAM / TIKTOK / FACEBOOK / LINE_OA / WEBSITE / REVIEW_CLIP), url, sort_order
- `bar_safety_features`: id, bar_id, feature_key, value (YES / NO / UNKNOWN), source (SELF_DECLARED / ADMIN_VERIFIED), evidence_url, verified_by, verified_at
- `crowd_status_logs`: id, bar_id, status (AVAILABLE / ALMOST_FULL / FULL), updated_by, created_at
- `tier_scores`: id, bar_id, period, category, review_score, checkin_score, safety_score, price_info_score, total_score, stars (1–5), is_new (boolean)
- `table_zones`: id, bar_id, name, capacity_pax, default_duration_minutes, allow_zone_only_booking
- `tables`: id, zone_id, name, seats, active
- `price_packages`: id, bar_id, name, pax_min, pax_max, total_price, active
- `price_package_items`: id, package_id, menu_item_id, quantity, unit_price_snapshot
- `bookings`: id, code, user_id, bar_id, zone_id (required), table_id (nullable), booking_datetime, reserved_from, reserved_until, reserved_period (tstzrange), pax, status, grace_period_minutes, auto_cancel_at, confirmed_at, completed_at
  - `EXCLUDE USING gist (table_id WITH =, reserved_period WITH &&) WHERE (table_id IS NOT NULL AND status IN ('PENDING','AWAITING_DEPOSIT','DEPOSIT_SUBMITTED','CONFIRMED','CHECKED_IN'))`
- `booking_status_history`: id, booking_id, from_status, to_status, changed_by, reason, created_at
- `booking_price_snapshots`: id, booking_id, items (json: name, qty, unit_price), subtotal, service_charge_rate, vat_rate, other_fees, estimated_total, per_person, created_at
- `booking_package_snapshots`: id, booking_id, package_id, package_name, items (json), package_price, fees (json), created_at
- `deposits`: id, booking_id, amount, slip_image_url, slip_ref, status (SUBMITTED / VERIFIED / REJECTED / REFUNDED / FORFEITED), verified_by, verified_at
- `checkins`: id, booking_id (unique), checked_in_at, checked_in_by, method (QR / MANUAL), id_checked (boolean)
- `reviews`: id, booking_id (unique), user_id, bar_id, rating, comment, status, created_at, updated_at
- `booking_shares`: id, booking_id, share_token, created_at
- `commission_rules`: id, bar_id, calculation_type, rate, charge_on_no_show, no_show_rate, effective_from, effective_to, created_by
- `billing_events`: id, booking_id, bar_id, event_type (CHECK_IN / NO_SHOW), commission_rule_id, base_amount, amount, status (PENDING / INVOICED / PAID / WAIVED), period, created_at, unique (booking_id, event_type)
- `user_consents`: id, user_id, consent_type, version, granted, granted_at, revoked_at
- `promotion_packages`: id, name, placement (HOME_BANNER / HOME_RECOMMENDED / SEARCH_TOP), duration_days, price, max_slots_per_area, active
- `promoted_listings`: id, bar_id, package_id, placement, district, category, starts_at, ends_at, status (PENDING_PAYMENT / PAYMENT_SUBMITTED / ACTIVE / EXPIRED / REJECTED / CANCELLED), approved_by
- `promoted_listing_payments`: id, promoted_listing_id, amount, slip_image_url, status (SUBMITTED / VERIFIED / REJECTED), verified_by, verified_at
- `promoted_listing_stats`: id, promoted_listing_id, date, impressions, clicks, bookings

## โครงสร้างโปรเจกต์ (Monorepo)
ใช้ **pnpm workspaces + Turborepo** และ TypeScript ทั้งหมด

```
night-list/
├── apps/
│   ├── web/                # React (Vite) — ฝั่งลูกค้า + ฝั่งร้าน (/merchant) + Staff Scanner (PWA)
│   │   └── api/og/         # Vercel Function สร้าง meta/OG image ให้ /restaurants/:slug และ /share/:token
│   └── admin/              # React (Vite) — Backoffice ทีม NightList (อนุมัติร้าน, Safety, ดาว, โปรโมท, Review, Billing, Audit)
│
├── packages/
│   ├── ui/                 # shadcn/ui components + theme (dark nightlife) ใช้ร่วมกัน 2 แอป
│   ├── types/              # TypeScript types + Zod schemas (BookingStatus, DTO, API contracts) ใช้ร่วม frontend/NestJS
│   ├── config/             # eslint, tsconfig, tailwind preset, env schema
│   └── utils/              # price calculator, star calculator, date/timezone (Asia/Bangkok), status transition map, formatters
│
├── backend/
│   ├── api/                # NestJS app — HTTP entry (controllers, guards, pipes), deploy เป็น Vercel Function
│   ├── services/           # NestJS domain modules: auth, bars, availability, booking, deposit, checkin, review,
│   │                       #   tier, promotion, billing, notification, jobs (auto-cancel, expiry, tier calc, retry, cleanup)
│   └── database/           # Supabase migrations (SQL), RLS policies, DB functions, seed data, generated DB types
│
├── infra/
│   └── terraform/
│       ├── modules/        # vercel-project, supabase-project
│       ├── envs/           # dev / staging / prod (tfvars)
│       └── main.tf
│
├── .github/workflows/      # CI: lint, test, build, supabase db push, terraform plan/apply
├── turbo.json
├── pnpm-workspace.yaml
└── README.md
```

**หลักการแบ่งหน้าที่**
- `apps/*` ไม่เขียนลง DB ตรงสำหรับงานสำคัญ (booking, status, check-in, deposit, billing, promotion) ต้องเรียกผ่าน NestJS API
- การอ่านข้อมูลสาธารณะ (รายชื่อร้าน, เมนู) และ Realtime (Crowd Status, สถานะ booking) ใช้ Supabase client + RLS จาก frontend ได้โดยตรง เพราะ NestJS บน Vercel เป็น serverless จึงถือ websocket ไม่ได้
- `backend/api` เป็นชั้นบางๆ (controller + guard + validation) ส่วน business logic อยู่ใน `backend/services` เพื่อให้ jobs และ API ใช้ logic เดียวกัน
- Status transition map, ตัวคำนวณราคา และตัวคำนวณดาว อยู่ใน `packages/utils` ให้ทั้ง frontend (แสดงผล) และ NestJS (validate) ใช้โค้ดเดียวกัน
- `apps/admin` deploy แยกโดเมน (เช่น admin.nightlist.app) และเข้าได้เฉพาะ role ADMIN

## Sitemap
**apps/web** (React Router)
```
/
├── age-gate, onboarding, home
├── ranking (/:category/:district)     ← จัดอันดับดาว
├── search
├── restaurants/:slug
├── booking/:id, booking/:id/deposit, booking/success
├── share/:token                        ← บัตรจองสาธารณะ
├── notifications, favorites, reviews, profile, settings/notifications
└── merchant/
    ├── dashboard, tonight (scanner + crowd), restaurant, hours, safety, links
    ├── menu, pricing, packages, zones-tables, deposits
    ├── promote (ซื้อ/ดูสถานะโปรโมท)
    └── bookings, reviews, analytics, staff
```
**apps/admin**
```
/
├── dashboard, restaurants, merchants, safety-verification
├── ranking (ดาว + Editor's Pick), promotions (แพ็กเกจ + อนุมัติสลิป)
├── users, bookings, reviews
├── commission-rules, billing-events
└── audit-logs
```

## Tech Stack
| ชั้น | เทคโนโลยี |
|---|---|
| **Frontend** | **React** 18 + TypeScript + Vite + React Router + TanStack Query + Tailwind CSS + shadcn/ui + React Hook Form + Zod (`apps/web`, `apps/admin`) |
| **Backend** | **NestJS** (TypeScript) + nestjs-zod (ใช้ schema ร่วมจาก `packages/types`) + Swagger/OpenAPI + Guards สำหรับ RBAC |
| **DB** | **Supabase** — PostgreSQL (+ btree_gist, pg_cron, pg_net), Auth, Storage (รูปร้าน/สลิป), Realtime, RLS |
| **Infra** | **Terraform** — provider `vercel/vercel` และ `supabase/supabase`, remote state (Terraform Cloud หรือ S3 + lock) |
| **Hosting** | **Vercel** — 3 projects: `web`, `admin` (static + Vercel Functions สำหรับ OG) และ `api` (NestJS เป็น Vercel Function) |
| Monorepo | pnpm + Turborepo |
| แผนที่ | Google Maps หรือ Leaflet + OpenStreetMap |
| Auth | Supabase Auth: Phone OTP, Google, LINE Login (ใช้ยืนยันตัวตนเท่านั้น) — NestJS ตรวจ Supabase JWT ทุก request |
| แจ้งเตือน | Web Push, LINE Messaging API (ผ่าน LINE OA opt-in) และ In-app |
| แชร์ | LINE share URL / LIFF + Web Share API |
| QR | สร้าง QR ใน NestJS (signed JWT) + สแกนด้วยกล้องผ่านเว็บ (เช่น html5-qrcode) |
| PWA | vite-plugin-pwa (Manifest + Service Worker) ใน `apps/web` |

**Background Jobs (เพราะ NestJS รันแบบ serverless บน Vercel)**
- ใช้ **Supabase pg_cron + pg_net** เรียก endpoint `POST /jobs/*` ของ NestJS ตามรอบเวลา และป้องกัน endpoint ด้วย `JOB_SECRET`
  - ทุก 1 นาที: auto-cancel/no-show, pending/deposit expiry, notification retry, เปิด/ปิด promoted listing
  - รายวัน: คำนวณดาว, ลบสลิปที่หมดอายุ, สรุป promoted_listing_stats
  - (ทางเลือก: Vercel Cron ได้ แต่รอบทุกนาทีต้องใช้แพลน Pro)
- ทุก job ต้อง idempotent และทำงานเป็น batch สั้นๆ ไม่เกิน timeout ของ Vercel Function
- แจ้งเตือนใช้ outbox pattern: บันทึกลง `notification_deliveries` สถานะ QUEUED ใน transaction เดียวกับ event แล้วให้ job ส่งพร้อม retry

**SEO / แชร์ลิงก์ (เพราะ React SPA)**
- `apps/web` เป็น SPA ส่วนหน้า `/restaurants/:slug` และ `/share/:token` ใช้ Vercel rewrites ส่ง bot/crawler (LINE, Facebook, X) ไปที่ `api/og` เพื่อคืน HTML ที่มี meta/OG tags และรูป OG ที่สร้างด้วย `@vercel/og`
- ทำ `sitemap.xml` ของหน้าร้านจาก Vercel Function

## Infrastructure as Code (Terraform)
- **จัดการด้วย Terraform:**
  - Vercel: สร้าง 3 projects (`web`, `admin`, `api`) ผูก Git repo, root directory, build command, environment variables ต่อ environment, custom domains (nightlist.app, admin.nightlist.app, api.nightlist.app)
  - Supabase: project ต่อ environment (dev / staging / prod), region `ap-southeast-1` (Singapore), ตั้งค่า Auth providers, redirect URLs, storage buckets
  - Secrets (Supabase keys, LINE channel secret/token, JOB_SECRET, QR signing key) ส่งเป็นตัวแปร `sensitive` จาก Terraform Cloud / GitHub Secrets และห้าม commit ลง repo
- **ไม่ใช้ Terraform จัดการ schema:** migrations, RLS และ DB functions อยู่ใน `backend/database` แล้วรันด้วย `supabase db push` ใน CI
- **CI/CD (GitHub Actions):**
  - PR: lint + test + build + `terraform plan` (comment ผลลงใน PR)
  - merge `main`: `terraform apply` (staging) → `supabase db push` → Vercel deploy
  - prod ต้องมี manual approval
- **Environments:** dev / staging / prod แยก Supabase project และ Vercel environment กันชัดเจน

## ดีไซน์
- **สไตล์:** Dark, Nightlife, Premium, Minimal, Modern
- **สี: โทน ดำ · ทอง · ม่วง** (ดำเป็นพื้น ใช้ทองเป็นสีหลัก และม่วงเป็นสีรอง)
  - **ดำ (พื้นหลัง):**
    - Background #09090B
    - Surface/การ์ด #111113
    - Surface ยกระดับ (modal, bottom sheet) #18181B
    - Border #27272A
  - **ทอง (Primary):**
    - Gold #D4AF37 และ Gold Light #E9C46A (hover, ตัวอักษรบนพื้นดำ)
    - ใช้กับปุ่ม CTA หลัก ("จองเลย"), ดาว ⭐, ป้าย "แนะนำ · โฆษณา" และ Editor's Pick
    - ตัวอักษรบนปุ่มทองใช้ #09090B
  - **ม่วง (Secondary):**
    - Purple #7C3AED สำหรับพื้นปุ่มรอง/ขอบ/focus ring (ตัวอักษรบนพื้นม่วงใช้ #F5F5F5) และ Purple Light #A78BFA สำหรับลิงก์/ข้อความบนพื้นดำ (ห้ามใช้ #7C3AED เป็นตัวอักษรบนพื้นดำ เพราะ contrast ไม่พอ)
    - ใช้กับแท็บที่เลือก, chip ตัวกรอง, focus ring, ลิงก์, badge สไตล์ร้าน และ glow/gradient ตกแต่ง
    - gradient หัวข้อหรือแบนเนอร์: #7C3AED → #D4AF37
  - **ตัวอักษร:** Text #F5F5F5 และ Text รอง #A1A1AA
  - **สีสถานะ Crowd Status:** 🟢 #22C55E / 🟡 #EAB308 / 🔴 #EF4444 (ใส่ไอคอนหรือข้อความคู่ด้วย ไม่ใช้สีอย่างเดียว)
  - ทุกคู่สีตัวอักษรกับพื้นต้องผ่าน WCAG AA (contrast ≥ 4.5:1)
  - ทองและม่วงใช้เป็นสีเน้นเท่านั้น ไม่ใช้เต็มพื้นที่ใหญ่
  - กำหนดเป็น design tokens ใน `packages/ui` (Tailwind preset) เช่น `bg`, `surface`, `gold`, `gold-light`, `purple`, `purple-light`
- **การ์ดร้าน:** รูป, ชื่อ, ดาว (1–5) หรือป้าย "ร้านใหม่", ป้าย "แนะนำ · โฆษณา" (ถ้าโปรโมท), ประเภท/สไตล์, ระยะทาง, ราคาต่อหัว, คะแนน, Safety Score, Crowd Status และป้ายโต๊ะว่าง
- **หน้าร้าน:** ปุ่ม "ประเมินราคา" และ "จองเลย" ติดด้านล่างจอ
- **Staff Scanner:** ปุ่มใหญ่ ใช้มือเดียวได้ในที่มืด

### Layout อ้างอิงจาก Mockup (ปรับเป็นธีม ดำ · ทอง · ม่วง)
**Desktop (Home)**
- **Header:** โลโก้ NightList (พระจันทร์เสี้ยว gradient ม่วง→ทอง) + เมนู: จัดอันดับ / จองโต๊ะ / แนะนำ / ค้นหา / โปรไฟล์
  - เมนูปกติเป็นสีเทา #A1A1AA ส่วนเมนูที่เลือกอยู่เป็นทอง พร้อมขีดล่างทอง
- **Hero "ร้านแนะนำสุดฮอตในกรุงเทพฯ":**
  - พื้น gradient ดำ → ม่วงเข้ม (#09090B → #2E1065) และขอบบาง ทองจาง (rgba ของ #D4AF37 ที่ 30%)
  - ป้าย "แนะนำ · โฆษณา" เป็นขอบทอง ตัวอักษรทอง
- **"อันดับร้านดังประจำสัปดาห์ (⭐–⭐⭐⭐⭐⭐)":** grid การ์ดร้าน 3 คอลัมน์ เลื่อนแนวนอนได้
- **การ์ดร้าน:**
  - พื้น #111113, ขอบ #27272A, hover ขอบทอง + เงา glow ม่วงจางๆ
  - ดาวเป็นทอง ชื่อร้านเป็น #F5F5F5 และรายละเอียด (ประเภท, ราคาเฉลี่ย, Safety Score) เป็น #A1A1AA
  - Crowd Status มีจุดสี + ข้อความ (ว่าง / ใกล้เต็ม / โต๊ะเต็ม)
- **แถบค้นหา + ตัวกรอง (ย่าน / ประเภท / งบ / เวลาว่าง):**
  - chip ปกติขอบ #27272A ส่วน chip ที่เลือกเป็นพื้นม่วง #7C3AED ตัวอักษรขาว
- **"ร้านใกล้ฉัน":** แผนที่ธีมมืด หมุดร้านสีทอง ร้านที่โปรโมทเป็นหมุดทองมีวงม่วงรอบ
- **Sidebar ขวา (sticky):**
  - **การ์ด "ประเมินราคา & จองโต๊ะ":**
    - ฟิลด์: วันที่, เวลา, จำนวนคน, โซน, รายการเมนู
    - ยอดรวมโดยประมาณ (Estimated Total) ตัวใหญ่สีทอง
    - ปุ่มหลัก "คำนวณและจองเลย" พื้นทอง ตัวอักษรดำ
  - **การ์ด "ข้อมูลความปลอดภัย":** แต่ละรายการแสดง **สถานะเดียว** ✅ มี / ❌ ไม่มี / ⚪ ยังไม่มีข้อมูล (ไม่แสดง ✅ และ ❌ คู่กันแบบใน mockup) พร้อมป้าย "ร้านแจ้งเอง" หรือ "ยืนยันโดย NightList"
- **Footer:** เกี่ยวกับเรา, เงื่อนไขการใช้งาน, นโยบายความเป็นส่วนตัว, ติดต่อเรา และบรรทัด "20+ · ดื่มไม่ขับ · PDPA" สีเทา

**Mobile**
- **Header:** hamburger + โลโก้ + avatar
- ลำดับเนื้อหา: ช่องค้นหา → Hero ร้านแนะนำ → การ์ดอันดับร้านเรียงเป็น 1 คอลัมน์
- **Bottom bar (sticky):**
  - ปุ่มรอง "ประเมินราคา & จองโต๊ะ" ขอบทอง ตัวอักษรทอง
  - ปุ่มหลัก "คำนวณและจองโต๊ะ" พื้นทอง ตัวอักษรดำ
  - ตัวประเมินราคาเปิดเป็น bottom sheet (#18181B)

**การใช้สีตามองค์ประกอบ (สรุป)**
| องค์ประกอบ | สี |
|---|---|
| พื้นหน้า / การ์ด / modal | #09090B / #111113 / #18181B |
| ปุ่มหลัก (จอง, คำนวณ), ดาว, ยอดเงิน, ป้ายโฆษณา, Editor's Pick | ทอง #D4AF37 (hover #E9C46A) |
| ปุ่มรอง, chip ที่เลือก, focus ring, badge สไตล์ร้าน | ม่วง #7C3AED |
| ลิงก์, ข้อความเน้นบนพื้นดำ | ม่วงอ่อน #A78BFA |
| Hero / แบนเนอร์ / โลโก้ | gradient ม่วง #7C3AED → ทอง #D4AF37 หรือ ดำ → ม่วงเข้ม #2E1065 |
| Crowd Status | 🟢 #22C55E / 🟡 #EAB308 / 🔴 #EF4444 (ใส่ข้อความคู่ด้วยเสมอ) |
| ห้ามใช้ | สีส้ม/อำพัน (Amber) และม่วง #7C3AED เป็นตัวอักษรบนพื้นดำ |

**ข้อความใน UI:** ใช้ภาษาไทยให้ถูกต้องทั้งหมด (mockup มีข้อความภาษาไทยเพี้ยนหลายจุด) ส่วนชื่อร้านใน seed data ต้องเป็นชื่อสมมติ ห้ามใช้ชื่อร้านจริง

## Production Requirements
- **Security:**
  - Supabase RLS + RBAC (NestJS Guards) และตรวจ Supabase JWT ฝั่ง server ใน NestJS
  - Input validation (nestjs-zod) และ rate limiting (@nestjs/throttler)
  - CORS จำกัดเฉพาะโดเมนของ web/admin
  - ตรวจชนิดและขนาดไฟล์ (รูป/สลิป)
  - QR token แบบ signed + ใช้ครั้งเดียว
- **Booking:**
  - Reservation interval + exclusion constraint + zone capacity lock
  - Status transition rules ที่ validate ทั้งใน API และ DB
  - Price/Package snapshot
  - Auto-cancel, no-show และ pending expiry
- **Billing:** billing events แบบ idempotent (unique booking_id + event_type)
- **System:** Audit logs, error logging, backup/recovery และ notification retry + dead-letter
- **Privacy:** ตามหัวข้อนโยบายด้านบน
- **Testing:** unit test (Vitest/Jest) สำหรับ price calculator, star calculator และ status transitions, integration test ของ NestJS กับ Supabase local (`supabase start`) สำหรับ overlap/double booking (ยิงจองพร้อมกันหลาย request), E2E ด้วย Playwright
- **Infra:** `terraform plan` ต้องผ่านก่อน merge และแยก state ต่อ environment

---

## Development Phases
**MVP (Phase 1)** — ทำตามลำดับนี้
- **1A Customer:**
  - Age Gate + Consent, Auth, Onboarding
  - Ranking (ดาว) + ร้านแนะนำ (โปรโมท), Search/Filter, Restaurant Detail (Safety + Crowd)
  - Menu, Price Estimate, Availability
  - Booking (+snapshot), Deposit, Share to Gang
  - QR Check-in, Review, Favorite, Notifications
- **1B Merchant:**
  - Signup + Verification
  - จัดการร้าน, เวลาเปิด-ปิด, styles, links, เมนู, ราคา/ค่าธรรมเนียม, แพ็กเกจ, โซน/โต๊ะ, มัดจำ และ Safety
  - Booking Management, Tonight/Scanner, Crowd Status
  - Staff accounts, Analytics และหน้าซื้อโปรโมท
- **1C Admin (apps/admin):**
  - อนุมัติร้านและยืนยัน Safety
  - ดาว / Editor's Pick
  - แพ็กเกจโปรโมทและการอนุมัติ
  - Users, Booking monitoring, Review moderation
  - Commission Rules, Billing Events และ Audit Log

**Phase 2 — AI & Growth**
- AI Recommendation และ AI Chatbot แนะนำร้าน
- Campaign / UTM tracking
- เชื่อม Instagram Business ของร้าน (ร้านต้องยินยอม)
- Payment gateway อัตโนมัติ (แทนการอัปโหลดสลิป) สำหรับมัดจำและค่าโปรโมท และ Refund อัตโนมัติ
- eKYC ยืนยันอายุ
- ขยาย Tier List ไปต่างจังหวัด

## ไม่ทำใน MVP
- โปรลด แจก หรือแถมเครื่องดื่มแอลกอฮอล์ รวมถึงการใช้คำเลี่ยงเพื่อทำโปรเหล่านี้
- ถือเงินลูกค้าแทนร้าน, payment gateway และ refund อัตโนมัติ
- ดึงข้อมูลใดๆ จากโซเชียล (ใช้ External Links เท่านั้น)
- Campaign / UTM tracking
- AI ทั้งหมด (ไปอยู่ใน Phase 2)
- ระบบ referral ที่ซับซ้อน

## ลำดับการส่งงาน
1. Sitemap + User Flow (Customer / Merchant / Staff / Admin)
2. Wireframe หน้าหลัก: Home (ร้านแนะนำ + Ranking ดาว), Restaurant Detail, Booking + Deposit, บัตรจองที่แชร์, Staff Scanner
3. Setup monorepo (pnpm + Turborepo) ตามโครงสร้าง `night-list/`: React (Vite) 2 แอป, NestJS, packages/config, types, ui, utils
4. `infra/terraform`: Vercel 3 projects + Supabase (dev/staging) + CI pipeline
5. `backend/database`: migrations, RLS, exclusion constraint, DB functions, pg_cron schedules
6. Seed data ร้านสมมติ 15 ร้านในกรุงเทพฯ ให้ครบ 3 ประเภท พร้อม hours, styles, safety, zones/tables และ commission rules โดยทำตามนโยบายถ้อยคำ
7. NestJS (`backend/services` + `backend/api`): auth guard → availability → booking (overlap protection + snapshot) → status transitions → deposit → check-in → billing events → promoted listings
8. NestJS jobs (`/jobs/*` เรียกจาก pg_cron): auto-cancel/no-show, pending expiry, notification outbox + retry, คำนวณดาว, เปิด/ปิดโปรโมท
9. `apps/web` ฝั่งลูกค้า: Search → Restaurant Detail → Pricing → Booking → Deposit → Share → QR → Review + OG/SEO function
10. `apps/web/merchant`: Dashboard + Tonight + Crowd Status (Realtime) + Promote
11. `apps/admin`: Backoffice ทั้งหมด
12. PWA, Testing, Production Deployment (terraform apply prod + manual approval) และ README

เริ่มจากข้อ 1 แล้วถามฉันก่อนถ้ามีจุดที่ไม่ชัดเจน
