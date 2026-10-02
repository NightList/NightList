import type { BarPromotion } from '@/services/data';

/** คำอธิบายโปร + เงื่อนไขเวลาเช็กอิน เช่น "เบียร์ 1 แถม 1 · เช็กอินก่อน 20:00 น." */
export const promoNote = (p: Pick<BarPromotion, 'description' | 'cutoffTime'>) =>
  p.cutoffTime ? `${p.description} · เช็กอินก่อน ${p.cutoffTime} น.` : p.description;
