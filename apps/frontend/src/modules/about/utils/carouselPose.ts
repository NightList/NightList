/**
 * ตำแหน่งการ์ดในโคราเซลทีมงาน — ค่าทั้งหมดเป็นหน่วย Figma (กว้าง 1600) แล้วคูณ s ตอนใช้
 */
export const CARD = { w: 350, h: 490, r: 60 };
export const FRAME = { w: 450, h: 583, r: 60 };
/** ขนาดจริงเทียบ Figma (Figma ใหญ่ไปเมื่อเปิดบนจอจริง) */
export const SCALE = 0.6;
/** skill animate: ease-in-out สำหรับของที่เคลื่อนบนจอ — ใช้ทั้งการ์ดและป้ายชื่อ ให้ขยับพร้อมกัน */
export const EASE_MOVE = 'cubic-bezier(0.77, 0, 0.175, 1)';

export interface Pose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  z: number;
  /** ตัดบน-ล่างให้การ์ดข้าง ๆ ออกมาเกือบเหลี่ยมจัตุรัสเหมือน Figma (clip-path ไม่ทำให้ layout ขยับ) */
  clipY: number;
}

export function poseFor(offset: number): Pose {
  const side = Math.sign(offset);
  const d = Math.abs(offset);
  if (d === 0) return { x: 0, y: 0, rot: 0, scale: 1, opacity: 1, z: 30, clipY: 0 };
  if (d === 1) return { x: 505 * side, y: 92, rot: 16 * side, scale: 0.8, opacity: 1, z: 20, clipY: 48 };
  if (d === 2) return { x: 900 * side, y: 300, rot: 32 * side, scale: 0.62, opacity: 0, z: 10, clipY: 48 };
  return { x: 1150 * side, y: 420, rot: 40 * side, scale: 0.5, opacity: 0, z: 0, clipY: 48 };
}

/** ระยะห่างแบบวงกลม: ช่วง [-n/2, n/2) */
export function circularOffset(i: number, active: number, n: number) {
  return ((((i - active) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
}
