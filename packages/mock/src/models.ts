import type { BarCategory, BookingStatus, CrowdStatus, Tier, UserRole } from '@nightlist/types';

export type SafetyKey =
  | 'SECURITY'
  | 'CCTV'
  | 'FIRE_EXIT'
  | 'FIRST_AID'
  | 'ID_CHECK'
  | 'PARKING_RIDE'
  | 'FEMALE_STAFF'
  | 'LIGHTING'
  | 'EMERGENCY_CONTACT';

export type SafetyValue = 'YES' | 'NO' | 'UNKNOWN';

export interface SafetyFeature {
  key: SafetyKey;
  value: SafetyValue;
  source: 'SELF_DECLARED' | 'ADMIN_VERIFIED';
}

export interface MenuItem {
  id: string;
  category: 'เครื่องดื่ม' | 'มิกเซอร์' | 'อาหาร' | 'ของทานเล่น';
  name: string;
  price: number;
  available: boolean;
}

export interface PricePackage {
  id: string;
  name: string;
  paxMin: number;
  paxMax: number;
  items: { menuItemId: string; quantity: number }[];
  totalPrice: number;
}

export interface Zone {
  id: string;
  name: string;
  capacityPax: number;
  tables: { id: string; name: string; seats: number }[];
  defaultDurationMinutes: number;
}

/** โปรโมชันของร้านที่ลูกค้าเลือกได้ตอนจองโต๊ะ (เช่น โปรเบียร์ก่อน 2 ทุ่ม) */
export interface BarPromotion {
  id: string;
  title: string;
  description: string;
  /** ต้องเช็กอินก่อนเวลานี้ (HH:mm) — ว่าง = ทั้งคืน */
  cutoffTime?: string;
  /** วันที่ใช้ได้ (0 = อาทิตย์) — ว่าง = ทุกวัน */
  days?: number[];
  active: boolean;
}

/** PR ประจำร้าน (ร้านกรอกเอง) */
export interface BarPR {
  male: number;
  female: number;
}

/** บัญชีรับเงินของร้าน — แพลตฟอร์มโอนมัดจำให้ตามนี้ */
export interface BarPayout {
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface OpeningHours {
  /** 0 = อาทิตย์ */
  day: number;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Bar {
  id: string;
  slug: string;
  name: string;
  category: BarCategory;
  district: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  styles: string[];
  cover: string; // css gradient (ไม่มีรูปจริงในเดโม)
  hours: OpeningHours[];
  menu: MenuItem[];
  packages: PricePackage[];
  promotions: BarPromotion[];
  pr: BarPR;
  zones: Zone[];
  fees: { serviceChargeRate: number; vatRate: number; otherFees: number };
  safety: SafetyFeature[];
  links: { type: 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK' | 'WEBSITE'; url: string }[];
  crowd: CrowdStatus;
  crowdUpdatedAt: string;
  score: number;
  rating: number;
  reviewCount: number;
  avgPerPerson: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  promoted: boolean;
  editorsPick: boolean;
  /** มัดจำ — เก็บทุกการจอง เงินเข้าแพลตฟอร์มก่อน แล้วค่อยโอนให้ร้าน/เก็บเป็นเครดิต */
  deposit: {
    amount: number;
    unit: 'PER_TABLE' | 'PER_PERSON';
    policy: string;
  };
  payout: BarPayout;
  gracePeriodMinutes: number;
  perks: string[];
}

export interface Review {
  id: string;
  barId: string;
  bookingId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reported?: boolean;
  userId?: string;
}

export type DepositSettlement = 'HELD' | 'PAYOUT_PENDING' | 'PAID_OUT' | 'CREDIT' | 'REFUNDED';

export interface Booking {
  id: string;
  code: string;
  barId: string;
  userId: string;
  userName: string;
  zoneId: string;
  tableId?: string;
  datetime: string;
  pax: number;
  status: BookingStatus;
  promotionId?: string;
  promotionTitle?: string;
  /** มัดจำที่ลูกค้าโอนเข้าแพลตฟอร์ม */
  deposit?: {
    amount: number;
    slipDataUrl?: string;
    status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    submittedAt: string;
    verifiedAt?: string;
    /** เงินอยู่ที่ไหน: HELD = แพลตฟอร์มถือไว้ · PAYOUT_PENDING = รอโอนให้ร้าน · PAID_OUT = โอนแล้ว · CREDIT = เก็บเป็นเครดิตร้าน · REFUNDED = คืนลูกค้า */
    settlement?: DepositSettlement;
    settledAt?: string;
  };
  note?: string;
  createdAt: string;
  history: { from: BookingStatus | null; to: BookingStatus; by: string; at: string }[];
  checkedInAt?: string;
  shareToken: string;
  reviewed?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  createdAt: string;
  readAt?: string;
}

export interface DemoUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  /** ร้านที่ผูก (MERCHANT / STAFF) */
  barId?: string;
  createdAt: string;
  preferences: { styles: string[]; budget?: number; pax?: number; districts: string[] };
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface PromotionOrder {
  id: string;
  barId: string;
  packageName: string;
  placement: 'HOME_BANNER' | 'HOME_RECOMMENDED' | 'SEARCH_TOP';
  days: number;
  price: number;
  status: 'PAYMENT_SUBMITTED' | 'ACTIVE' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
}

export interface BarWithTier extends Bar {
  stars: number | null;
  tier: Tier | null;
  isNew: boolean;
}
