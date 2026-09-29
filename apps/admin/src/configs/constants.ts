/** ผู้ดำเนินการในเดโม (ใช้ลง audit log) */
export const ADMIN = 'admin@nightlist.app';

/** สีของ Tag ตามสถานะร้าน */
export const BAR_STATUS_COLOR: Record<string, string> = {
  APPROVED: 'green',
  PENDING_REVIEW: 'gold',
  REJECTED: 'red',
  SUSPENDED: 'volcano',
  DRAFT: 'default',
};
