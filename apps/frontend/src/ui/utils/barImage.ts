/** รูปแทนระหว่างที่ร้านยังไม่อัปโหลดรูปจริง */
export const BAR_PLACEHOLDER = '/images/bars/placeholder.webp';

/** รูปปกร้าน: รูปจริง (coverUrl) ถ้ามี ไม่งั้นใช้รูปแทน */
export const barImage = (bar: { coverUrl?: string }) => bar.coverUrl || BAR_PLACEHOLDER;
