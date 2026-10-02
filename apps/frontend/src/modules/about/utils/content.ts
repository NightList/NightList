/**
 * ข้อมูลหน้า /about (เกี่ยวกับเรา · ทีมงาน · ติดต่อเรา) — แก้ข้อความ/ทีมงาน/ช่องทางติดต่อที่ไฟล์นี้ไฟล์เดียว
 * ⚠️ ทีมงานคนที่ 4–8 และเบอร์/อีเมลเป็นข้อมูลตัวอย่าง — เปลี่ยนเป็นของจริงก่อนเปิดใช้งาน
 */

export interface TeamMember {
  name: string;
  role: string[];
  /** รูปใน public/ เช่น '/images/team/san.webp' (แนวตั้ง 3:4) · ไม่ใส่ → แสดงภาพเงาคนแทน */
  photo?: string;
}

export const ABOUT_TEXT = [
  'NightList ช่วยให้คุณเลือกร้านกลางคืนได้มั่นใจขึ้น ดูราคาโดยประมาณ มาตรการความปลอดภัย และความแน่นของร้านแบบสด ๆ ก่อนออกจากบ้าน แล้วจองโต๊ะได้ในไม่กี่แตะ',
  'ดาวของร้านมาจากรีวิวของคนที่เช็กอินจริงเท่านั้น ร้านจ่ายเงินเพื่อเพิ่มดาวไม่ได้ ส่วนพื้นที่โฆษณาจะติดป้าย "แนะนำ" ให้เห็นชัดเสมอ',
];

export const TEAM: TeamMember[] = [
  { name: 'แสน', role: ['Founder', 'Fullstack Developer'], photo: '/images/teams/san.webp' },
  { name: 'วิน', role: ['DevOps', 'Consultant'], photo: '/images/teams/wind.webp' },
  { name: 'เนวิน', role: ['Business Analyst'], photo: '/images/teams/newin.webp' },
  { name: 'พี', role: ['UI/UX Designer', 'Frontend Developer'], photo: '/images/teams/pee.webp' },
  { name: 'บิว', role: ['UI/UX Designer', 'Frontend Developer'], photo: '/images/teams/biw.webp' },
  { name: 'ก็อต', role: ['Co-Founder', 'Fullstack Developer'], photo: '/images/teams/got.webp' },
  { name: 'เติร์ด', role: ['Co-Founder', 'Fullstack Developer'], photo: '/images/teams/third.webp' },
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
