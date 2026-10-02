/**
 * ข้อมูลหน้า /about (เกี่ยวกับเรา · ติดต่อเรา) — แก้ข้อความ/ช่องทางติดต่อที่ไฟล์นี้ไฟล์เดียว
 * ทีมงานมาจาก Supabase (view public_team · ตาราง team_members) — ดู services/data.ts → useSiteTeam()
 * ⚠️ เบอร์/อีเมลเป็นข้อมูลตัวอย่าง — เปลี่ยนเป็นของจริงก่อนเปิดใช้งาน
 */

export const ABOUT_TEXT = [
  'NightList ช่วยให้คุณเลือกร้านกลางคืนได้มั่นใจขึ้น ดูราคาโดยประมาณ มาตรการความปลอดภัย และความแน่นของร้านแบบสด ๆ ก่อนออกจากบ้าน แล้วจองโต๊ะได้ในไม่กี่แตะ',
  'ดาวของร้านมาจากรีวิวของคนที่เช็กอินจริงเท่านั้น ร้านจ่ายเงินเพื่อเพิ่มดาวไม่ได้ ส่วนพื้นที่โฆษณาจะติดป้าย "แนะนำ" ให้เห็นชัดเสมอ',
];

export const CONTACT = {
  phone: '099-999-9999',
  email: 'test@gmail.com',
  hours: ['จันทร์ - อาทิตย์', '00:00 - 23:59'],
  address: ['กรุงเทพมหานคร', 'ประเทศไทย'],
};

export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
  { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com' },
  { key: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { key: 'youtube', label: 'YouTube', href: 'https://youtube.com' },
] as const;
