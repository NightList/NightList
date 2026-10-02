import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiDocOptions {
  /** หัวข้อสั้นในรายการ Swagger */
  summary: string;
  /** อธิบายว่าเส้นนี้ทำอะไร ใครเรียกได้ เงื่อนไขสำคัญ */
  description: string;
  /** ข้อมูลที่ตอบกลับเมื่อสำเร็จ (key เป็น snake_case) */
  returns: string;
  /** สถานะเมื่อสำเร็จ (ค่าเริ่มต้น 200) */
  status?: HttpStatus;
  /** ต้องล็อกอิน (Bearer) → เพิ่มคำอธิบาย 401 */
  auth?: boolean;
  /** ต้องมีสิทธิ์เฉพาะ (ทีมร้าน / ADMIN) → เพิ่มคำอธิบาย 403 */
  forbidden?: string;
  /** มี body/params ที่ตรวจด้วย zod → เพิ่มคำอธิบาย 400 */
  validates?: boolean;
}

/**
 * คำอธิบาย endpoint ใน Swagger ครบชุดในที่เดียว: สรุป + รายละเอียด + response ที่เป็นไปได้
 * ใช้ทุกเส้น เพื่อให้ /api/docs บอกได้ว่าเส้นไหนให้ข้อมูลอะไร
 */
export function ApiDoc(o: ApiDocOptions) {
  const ok = o.status ?? HttpStatus.OK;
  const decorators = [
    ApiOperation({ summary: o.summary, description: o.description }),
    ApiResponse({ status: ok, description: o.returns }),
  ];
  if (o.validates !== false) {
    decorators.push(ApiResponse({ status: 400, description: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (ดูรายละเอียดใน `errors`)' }));
  }
  if (o.auth !== false) {
    decorators.push(ApiResponse({ status: 401, description: 'ไม่ได้ล็อกอิน หรือ token หมดอายุ' }));
  }
  if (o.forbidden) decorators.push(ApiResponse({ status: 403, description: o.forbidden }));
  return applyDecorators(...decorators);
}
