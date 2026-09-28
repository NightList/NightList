import { z } from 'zod';

/** รายการที่ลูกค้าเลือกในตัวประเมินราคา */
export const PriceItem = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});
export type PriceItem = z.infer<typeof PriceItem>;

/** ค่าธรรมเนียมของร้าน (เป็น %) + ค่าอื่นๆ (บาท) */
export const BarFees = z.object({
  serviceChargeRate: z.number().min(0).max(100).default(0),
  vatRate: z.number().min(0).max(100).default(0),
  otherFees: z.number().nonnegative().default(0),
});
export type BarFees = z.infer<typeof BarFees>;

export const PriceEstimateInput = z.object({
  items: z.array(PriceItem),
  fees: BarFees,
  pax: z.number().int().positive(),
});
export type PriceEstimateInput = z.infer<typeof PriceEstimateInput>;

export interface PriceEstimate {
  subtotal: number;
  serviceCharge: number;
  vat: number;
  otherFees: number;
  estimatedTotal: number;
  perPerson: number;
}
