/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_MAP_TILE_URL_LIGHT?: string;
  readonly VITE_MAP_TILE_URL_DARK?: string;
  readonly VITE_MAP_TILE_ATTRIBUTION?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
