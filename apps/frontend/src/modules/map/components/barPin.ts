import type { BarWithTier } from '@/services/data';
import { divIcon } from 'leaflet';
import { barImage } from '@/ui/utils/barImage';

const CROWD_RING: Record<BarWithTier['crowd'], string> = {
  AVAILABLE: '#22c55e',
  ALMOST_FULL: '#f59e0b',
  FULL: '#ef4444',
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * หมุดวงกลมรูปร้าน + หางแหลม (แบบแผนที่ในตัวอย่าง)
 * ขอบสีตามความแน่น (เขียว/เหลือง/แดง) · ร้านโปรโมทมีวงทอง · ร้านที่เลือกขยายใหญ่ขึ้น
 */
export function barPin(bar: BarWithTier, active: boolean) {
  const size = active ? 60 : 48;
  const ring = CROWD_RING[bar.crowd];
  const photo = `background-image:url('${esc(barImage(bar))}');background-size:cover;background-position:center`;
  const initial = '';
  return divIcon({
    className: '',
    html: `<div class="nl-avatar-pin${active ? ' is-active' : ''}${bar.promoted ? ' is-promoted' : ''}" style="--ring:${ring};--size:${size}px">
      <div class="nl-avatar-pin__img" style="${photo}">${initial}</div>
      <span class="nl-avatar-pin__tail"></span>
    </div>`,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
  });
}

/** จุดฟ้า "ตำแหน่งของฉัน" */
export const meIcon = divIcon({
  className: '',
  html: '<div class="nl-me-dot"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
