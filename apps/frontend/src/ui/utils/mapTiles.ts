/**
 * พื้นแผนที่ — ค่าเริ่มต้นใช้ OpenStreetMap (ฟรี ไม่ต้องมี key) แล้วใช้ CSS filter
 * ทำให้เป็นโทนเทาเรียบ (ธีมสว่าง) หรือกลับสีเป็นโทนมืด (ธีมมืด) — ดู .nl-map-tiles ใน index.css
 *
 * ถ้าจะใช้ผู้ให้บริการที่มี key (MapTiler / Stadia / CARTO) ให้ตั้ง env:
 *   VITE_MAP_TILE_URL_LIGHT, VITE_MAP_TILE_URL_DARK (+ VITE_MAP_TILE_ATTRIBUTION)
 * เมื่อตั้งแล้วระบบจะไม่ใส่ filter ให้ (ใช้สีของผู้ให้บริการตรงๆ)
 */
const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const env = import.meta.env;

export const MAP_TILES = {
  light: env.VITE_MAP_TILE_URL_LIGHT || OSM,
  dark: env.VITE_MAP_TILE_URL_DARK || OSM,
} as const;

export const MAP_ATTRIBUTION =
  env.VITE_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** ใช้ OSM + filter เองอยู่ไหม */
export const MAP_USES_FILTER = !env.VITE_MAP_TILE_URL_LIGHT;

/** className ของ TileLayer ตามธีม */
export const tileClass = (theme: 'light' | 'dark') =>
  MAP_USES_FILTER ? `nl-map-tiles nl-map-tiles--${theme}` : undefined;
