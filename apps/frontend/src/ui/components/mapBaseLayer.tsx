import L from 'leaflet';
import { useEffect, useState } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { loadGoogleStyle } from '@/ui/utils/mapStyle';
import { MAP_ATTRIBUTION, MAP_TILES, MAP_USE_RASTER, tileClass } from '@/ui/utils/mapTiles';
// MapLibre v6 หา worker จาก import.meta.url ของตัวเอง — Vite (dev: pre-bundle / build: hash) ทำให้ path เพี้ยน
// → "Worker failed to load" · ให้ Vite bundle worker เป็นไฟล์ของตัวเอง แล้วบอก URL ให้ MapLibre ตรงๆ
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

const VECTOR_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

/**
 * พื้นแผนที่ของทุกหน้า
 * ค่าเริ่มต้น: vector tiles (OpenFreeMap) + สีแบบ Google Maps ตามธีม — ฟรี ไม่ต้องมี key
 * ถ้าโหลดสไตล์ไม่ได้ หรือตั้ง VITE_MAP_TILE_URL_* ไว้ → ใช้ raster tiles แทน
 */
export function MapBaseLayer({ theme }: { theme: 'light' | 'dark' }) {
  const map = useMap();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (MAP_USE_RASTER || failed) return;
    let layer: L.MaplibreGL | null = null;
    let cancelled = false;
    // maplibre-gl (~1MB) โหลดเฉพาะตอนมีแผนที่บนจอ — ไม่ถ่วงหน้าร้าน/หน้าค้นหาตอนเปิด
    Promise.all([
      loadGoogleStyle(theme),
      import('maplibre-gl').then((m) => m.setWorkerUrl(maplibreWorkerUrl)),
      import('@maplibre/maplibre-gl-leaflet'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ])
      .then(([style]) => {
        if (cancelled) return;
        layer = L.maplibreGL({ style, attributionControl: false });
        layer.addTo(map);
        map.attributionControl?.addAttribution(VECTOR_ATTRIBUTION);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (layer) map.removeLayer(layer);
      map.attributionControl?.removeAttribution(VECTOR_ATTRIBUTION);
    };
  }, [map, theme, failed]);

  if (MAP_USE_RASTER || failed) {
    return (
      <TileLayer
        key={theme}
        url={MAP_TILES[theme]}
        attribution={MAP_ATTRIBUTION}
        className={tileClass(theme)}
        maxZoom={19}
      />
    );
  }
  return null;
}
