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
  deposit: {
    enabled: boolean;
    amount: number;
    unit: 'PER_TABLE' | 'PER_PERSON';
    promptpayId: string;
    policy: string;
  };
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
  packageId?: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  estimate: {
    subtotal: number;
    serviceCharge: number;
    vat: number;
    otherFees: number;
    estimatedTotal: number;
    perPerson: number;
  };
  deposit?: {
    amount: number;
    slipDataUrl?: string;
    status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    submittedAt: string;
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
