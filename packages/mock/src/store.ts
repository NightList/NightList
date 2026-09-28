import { createSeed, type DemoState } from './seed';

const KEY = 'nightlist-demo-v1';
const SESSION_KEY = 'nightlist-demo-session';

type Listener = () => void;

let state: DemoState | null = null;
let version = 0;
const listeners = new Set<Listener>();
const memory = new Map<string, string>();

function storage() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* blocked */
  }
  return {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => void memory.set(k, v),
    removeItem: (k: string) => void memory.delete(k),
  };
}

function load(): DemoState {
  if (state) return state;
  try {
    const raw = storage().getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed.version === 1) {
        state = parsed;
        return state;
      }
    }
  } catch {
    /* corrupted → reseed */
  }
  state = createSeed();
  persist();
  return state;
}

function persist() {
  try {
    storage().setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota (เช่นสลิปรูปใหญ่) — เก็บในหน่วยความจำต่อ */
  }
}

/** อ่าน state ปัจจุบัน (อย่าแก้ตรง — ใช้ mutate) */
export function getState(): DemoState {
  return load();
}

/** แก้ state แล้ว persist + แจ้ง subscriber */
export function mutate<T>(fn: (s: DemoState) => T): T {
  const s = load();
  const result = fn(s);
  version++;
  persist();
  listeners.forEach((l) => l());
  return result;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** ใช้กับ useSyncExternalStore */
export function getVersion(): number {
  return version;
}

export function resetDemo(): void {
  state = createSeed();
  version++;
  persist();
  listeners.forEach((l) => l());
}

export function getSessionUserId(): string | null {
  return storage().getItem(SESSION_KEY);
}

export function setSessionUserId(id: string | null): void {
  if (id) storage().setItem(SESSION_KEY, id);
  else storage().removeItem(SESSION_KEY);
  version++;
  listeners.forEach((l) => l());
}
