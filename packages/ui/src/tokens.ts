/**
 * Midnight Gold — design tokens (single source of truth)
 * ใช้สร้างทั้ง antd theme (antd-theme.ts) และ CSS variables (theme.css)
 * ถ้าแก้ค่าที่นี่ ต้องแก้ theme.css ให้ตรงกัน (มี test ตรวจ)
 */
export type ResolvedTheme = 'dark' | 'light';

export interface ColorTokens {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  gold: string;
  goldHighlight: string;
  goldText: string;
  onGold: string;
  purple: string;
  link: string;
  crowdAvailable: string;
  crowdAlmostFull: string;
  crowdFull: string;
}

export const colors: Record<ResolvedTheme, ColorTokens> = {
  dark: {
    background: '#07070D',
    surface: '#11111A',
    card: '#171520',
    border: '#34283F',
    text: '#F5F1E8',
    muted: '#A7A1B3',
    gold: '#E8B64C',
    goldHighlight: '#FFD77A',
    goldText: '#E8B64C',
    onGold: '#07070D',
    purple: '#A738F5',
    link: '#B86BFA',
    crowdAvailable: '#22C55E',
    crowdAlmostFull: '#EAB308',
    crowdFull: '#EF4444',
  },
  light: {
    background: '#FAF8F3',
    surface: '#FFFFFF',
    card: '#F4F1EA',
    border: '#E4DCCF',
    text: '#1A1523',
    muted: '#5E5670',
    gold: '#E8B64C',
    goldHighlight: '#F5C85E',
    goldText: '#8A5A00',
    onGold: '#1A1523',
    purple: '#A738F5',
    link: '#7E22CE',
    crowdAvailable: '#16A34A',
    crowdAlmostFull: '#CA8A04',
    crowdFull: '#DC2626',
  },
};

/** สีพื้นป้าย Tier + สีตัวอักษรที่ผ่าน contrast */
export const tierColors = {
  S: { bg: '#E8B64C', fg: '#07070D', label: 'Legendary' },
  A: { bg: '#963BE8', fg: '#F5F1E8', label: 'Excellent' },
  B: { bg: '#5869C8', fg: '#F5F1E8', label: 'Good' },
  C: { bg: '#74788B', fg: '#07070D', label: 'Normal' },
} as const;

/** Motion tokens */
export const motionTokens = {
  duration: { fast: 0.15, base: 0.25, slow: 0.4 },
  ease: { out: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  spring: { sheet: { type: 'spring' as const, stiffness: 380, damping: 32 } },
} as const;

export const radius = { base: 12, pill: 9999 } as const;
