import { Card } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  about: {
    title: 'เกี่ยวกับ NightList',
    body: [
      'NightList ช่วยให้คุณเลือกร้านกลางคืนได้มั่นใจขึ้น — ดูราคาโดยประมาณ ความปลอดภัย และความแน่นของร้าน ก่อนออกจากบ้าน',
      'ดาวและ Tier คำนวณจากรีวิวของคนที่เช็กอินจริง ร้านจ่ายเงินเพื่อเพิ่มดาวไม่ได้ พื้นที่โฆษณาจะติดป้าย "แนะนำ · โฆษณา" เสมอ',
    ],
  },
  terms: {
    title: 'เงื่อนไขการใช้งาน',
    body: [
      'ร่างสำหรับเดโม — ต้องให้ทนายตรวจก่อนเปิดใช้งานจริง',
      'ผู้ใช้ต้องมีอายุ 20 ปีขึ้นไป',
      'ราคาในแอปเป็นราคาโดยประมาณ ไม่ใช่ราคาสุดท้าย',
      'มัดจำโอนเข้าบัญชีร้านโดยตรง เป็นไปตามนโยบายของแต่ละร้าน',
    ],
  },
  privacy: {
    title: 'นโยบายความเป็นส่วนตัว',
    body: [
      'ร่างสำหรับเดโม (PDPA)',
      'เราขอตำแหน่งเฉพาะตอนใช้ "ร้านใกล้ฉัน" และไม่บันทึกพิกัด',
      'สลิปมัดจำเก็บเท่าที่จำเป็นและลบตามรอบที่กำหนด',
      'ขอลบบัญชีได้ในหน้า ตั้งค่า',
    ],
  },
  cookies: {
    title: 'นโยบายคุกกี้',
    body: ['ร่างสำหรับเดโม', 'ใช้ localStorage เก็บธีม การยืนยันอายุ และ session'],
  },
};

export function StaticPage({ page }: { page: keyof typeof CONTENT }) {
  const c = CONTENT[page]!;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={c.title} />
      <Card>
        <div className="space-y-3">
          {c.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}
