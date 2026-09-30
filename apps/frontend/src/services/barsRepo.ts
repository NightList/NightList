import { mutate, type Bar, type DemoState } from '@nightlist/mock';
import { supabase } from '@/services/supabase';

/**
 * ร้านจาก Supabase → รูปแบบ Bar ที่หน้าเว็บใช้
 *
 * ข้อมูลร้านมาจาก view `bar_detail` ใน Supabase เท่านั้น — ร้านเดโมใน @nightlist/mock ถูกแทนทั้งหมด
 * (main.tsx รอโหลดเสร็จก่อน render · โหลดไม่ได้ → หน้าแจ้ง error ไม่ใช้ร้านเดโมแทน)
 * หน้าเว็บยังเรียก listBars() / getBarBySlug() เหมือนเดิม เพราะไฟล์นี้เอาร้านจาก DB ไปใส่ store
 * ส่วนการจอง / รีวิว / ผู้ใช้ ยังเป็นเดโม (localStorage) จนกว่าจะย้ายทีละหน้าผ่าน NestJS
 */

/** รูปแบบ key ตาม view bar_detail (snake_case ตามหลังบ้าน — ดู Db.BarDetail ใน @nightlist/types) */
interface BarDetailRow {
  id: string;
  slug: string;
  name: string;
  category: Bar['category'];
  lat: number;
  lng: number;
  cover_image_url: string | null;
  cover_style: string | null;
  district: { id: string; slug: string; name_th: string } | null;
  styles: string[];
  has_pr: boolean;
  pr_counts: { male: number; female: number; lgbtq: number };
  rating_avg: number | null;
  rating_count: number;
  avg_price_per_person: number | null;
  score: number | null;
  current_crowd: Bar['crowd'] | null;
  crowd_updated_at: string | null;
  is_editor_pick: boolean;
  is_promoted: boolean;
  description: string | null;
  address: string;
  perks: string[];
  hours: { day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }[];
  links: { type: string; url: string }[];
  booking_settings: {
    deposit_amount: number;
    deposit_unit: Bar['deposit']['unit'];
    deposit_policy: string | null;
    grace_minutes: number;
  } | null;
  fees: { fee_type: string; calc: string; value: number }[];
  menu: { id: string; category: string | null; name: string; price: number; is_available: boolean }[];
  packages: {
    id: string;
    name: string;
    pax_min: number;
    pax_max: number;
    total_price: number;
    items: { menu_item_id: string | null; quantity: number }[];
  }[];
  promotions: { id: string; title: string; description: string | null; cutoff_time: string | null; days_of_week: number[] }[];
  zones: {
    id: string;
    name: string;
    capacity_pax: number;
    default_duration_minutes: number;
    tables: { id: string; name: string; seats: number }[];
  }[];
  safety: { key: string; value: 'YES' | 'NO' | 'UNKNOWN'; source: 'SELF_DECLARED' | 'ADMIN_VERIFIED' | null }[];
}

const DEFAULT_COVER = 'linear-gradient(135deg,#2E1065 0%,#A738F5 55%,#E8B64C 100%)';
const LINK_TYPES = ['INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'WEBSITE'] as const;
/** view ส่ง key ของสไตล์ (ตัวใหญ่) → ชื่อที่หน้าเว็บแสดง */
const STYLE_LABELS: Record<string, string> = {
  LIVE_MUSIC: 'Live Music',
  CHILL: 'Chill',
  PUB_DANCE: 'Pub/Dance',
  ROOFTOP: 'Rooftop',
  FOOD_FOCUSED: 'Food-focused',
  QUIET: 'Quiet',
  OUTDOOR: 'Outdoor',
  PRIVATE_ROOM: 'Private Room',
  BUFFET: 'Buffet',
};

function toBar(r: BarDetailRow, previous?: Bar): Bar {
  const pct = (type: string) => r.fees.find((f) => f.fee_type === type && f.calc === 'PERCENTAGE')?.value ?? 0;
  const settings = r.booking_settings;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    district: r.district?.name_th ?? '',
    address: r.address,
    lat: Number(r.lat),
    lng: Number(r.lng),
    description: r.description ?? '',
    styles: r.styles.map((k) => STYLE_LABELS[k] ?? k),
    cover: r.cover_style ?? DEFAULT_COVER,
    coverUrl: r.cover_image_url ?? undefined,
    hours: r.hours.map((h) => ({
      day: h.day_of_week,
      open: h.open_time ?? '00:00',
      close: h.close_time ?? '00:00',
      closed: h.is_closed,
    })),
    menu: r.menu.map((m) => ({
      id: m.id,
      category: (m.category ?? 'อาหาร') as Bar['menu'][number]['category'],
      name: m.name,
      price: Number(m.price),
      available: m.is_available,
    })),
    packages: r.packages.map((p) => ({
      id: p.id,
      name: p.name,
      paxMin: p.pax_min,
      paxMax: p.pax_max,
      totalPrice: Number(p.total_price),
      items: p.items
        .filter((it) => it.menu_item_id)
        .map((it) => ({ menuItemId: it.menu_item_id!, quantity: it.quantity })),
    })),
    promotions: r.promotions.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      cutoffTime: p.cutoff_time ?? undefined,
      days: p.days_of_week.length >= 7 ? undefined : p.days_of_week,
      active: true, // view ส่งมาเฉพาะโปรที่ active + ผ่านการตรวจแล้ว
    })),
    // TODO(ui): pr_counts.lgbtq ยังไม่มีที่แสดงในหน้าเว็บ
    pr: { male: r.pr_counts.male, female: r.pr_counts.female },
    zones: r.zones.map((z) => ({
      id: z.id,
      name: z.name,
      capacityPax: z.capacity_pax,
      defaultDurationMinutes: z.default_duration_minutes,
      tables: z.tables,
    })),
    fees: {
      serviceChargeRate: Number(pct('SERVICE_CHARGE')),
      vatRate: Number(pct('VAT')),
      otherFees: r.fees.filter((f) => f.calc === 'FIXED_PER_TABLE').reduce((s, f) => s + Number(f.value), 0),
    },
    safety: r.safety.map((s) => ({
      key: s.key as Bar['safety'][number]['key'],
      value: s.value,
      source: s.source ?? 'SELF_DECLARED',
    })),
    links: r.links
      .filter((l): l is { type: Bar['links'][number]['type']; url: string } =>
        (LINK_TYPES as readonly string[]).includes(l.type),
      )
      .map((l) => ({ type: l.type, url: l.url })),
    // ร้านยังไม่เคยอัปเดตความแน่น (null) → เวลาเก่ามาก ให้หน้าเว็บแสดง "ไม่ทราบสถานะ"
    crowd: r.current_crowd ?? 'AVAILABLE',
    crowdUpdatedAt: r.crowd_updated_at ?? new Date(0).toISOString(),
    score: Number(r.score ?? 0),
    rating: Number(r.rating_avg ?? 0),
    reviewCount: r.rating_count,
    avgPerPerson: Number(r.avg_price_per_person ?? 0),
    status: 'APPROVED', // bar_detail มีเฉพาะร้าน APPROVED
    promoted: r.is_promoted,
    editorsPick: r.is_editor_pick,
    deposit: {
      amount: Number(settings?.deposit_amount ?? 0),
      unit: settings?.deposit_unit ?? 'PER_TABLE',
      policy: settings?.deposit_policy ?? '',
    },
    // เลขบัญชีร้านไม่ส่งมาหน้าเว็บ (เข้ารหัสใน DB) — หน้า merchant เดโมใช้ค่าเดิมไปก่อน
    payout: previous?.payout ?? { bankName: '', accountNo: '', accountName: '' },
    gracePeriodMinutes: settings?.grace_minutes ?? 30,
    perks: r.perks,
  };
}

/** แทนร้านทั้งหมดใน store ด้วยร้านจาก DB แล้วแก้/ล้าง id ที่ข้อมูลเดโมอื่นอ้างถึง */
function applyToDemoState(s: DemoState, rows: BarDetailRow[]): void {
  const idMap = new Map<string, string>();
  const oldBySlug = new Map(s.bars.map((b) => [b.slug, b]));
  const match = <T extends { id: string }>(olds: T[], news: T[], key: (x: T) => string) => {
    for (const o of olds) {
      const found = news.find((n) => key(n) === key(o));
      if (found && found.id !== o.id) idMap.set(o.id, found.id);
    }
  };

  // ร้านใน store = ร้านจาก DB เท่านั้น (ร้านเดโมที่ไม่มีใน DB ถูกตัดทิ้ง)
  s.bars = rows.map((row) => {
    const old = oldBySlug.get(row.slug);
    const bar = toBar(row, old);
    if (old) {
      if (bar.id !== old.id) idMap.set(old.id, bar.id);
      match(old.zones, bar.zones, (z) => z.name);
      for (const oz of old.zones) {
        const nz = bar.zones.find((z) => z.name === oz.name);
        if (nz) match(oz.tables, nz.tables, (t) => t.name);
      }
      match(old.menu, bar.menu, (m) => m.name);
      match(old.packages, bar.packages, (p) => p.name);
      match(old.promotions, bar.promotions, (p) => p.title);
    }
    return bar;
  });

  // การจอง/รีวิวเดโม: ชี้ไปร้านใน DB · ของร้านที่ไม่มีใน DB แล้วลบทิ้ง (กันหน้าเว็บหาร้านไม่เจอ)
  const m = <T extends string | undefined>(id: T): T => ((id && idMap.get(id)) ?? id) as T;
  const barIds = new Set(s.bars.map((b) => b.id));
  s.bookings = s.bookings
    .map((b) => ({ ...b, barId: m(b.barId), zoneId: m(b.zoneId), tableId: m(b.tableId), promotionId: m(b.promotionId) }))
    .filter((b) => barIds.has(b.barId));
  s.reviews = s.reviews.map((r) => ({ ...r, barId: m(r.barId) })).filter((r) => barIds.has(r.barId));
  s.promotions = s.promotions.map((p) => ({ ...p, barId: m(p.barId) })).filter((p) => barIds.has(p.barId));
  s.users.forEach((u) => {
    const id = m(u.barId);
    u.barId = id && barIds.has(id) ? id : undefined;
  });
  for (const uid of Object.keys(s.favorites))
    s.favorites[uid] = (s.favorites[uid] ?? []).map((id) => m(id)).filter((id) => barIds.has(id));
}

/** เรียกตอนเปิดแอป (main.tsx รอให้เสร็จก่อน render) — ดึงไม่ได้จะ throw ให้หน้า error จัดการ */
export async function loadBarsFromSupabase(): Promise<number> {
  if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase (.env)');
  // view bar_detail = ร้าน APPROVED พร้อมทุกอย่างที่หน้าร้านใช้ (หนึ่งการเรียก)
  const { data, error } = await supabase.from('bar_detail').select('*').order('name');
  if (error) throw error;
  const rows = (data ?? []) as unknown as BarDetailRow[];
  mutate((s) => applyToDemoState(s, rows));
  console.info(`[NightList] โหลดร้านจาก Supabase ${rows.length} ร้าน`);
  return rows.length;
}
