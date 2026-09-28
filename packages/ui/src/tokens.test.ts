import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { colors } from './tokens';

const css = readFileSync(new URL('./theme.css', import.meta.url), 'utf8');
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function block(selector: string): string {
  const start = css.indexOf(selector);
  return css.slice(start, css.indexOf('}', start));
}

describe('theme.css matches tokens.ts', () => {
  for (const mode of ['dark', 'light'] as const) {
    const b = block(mode === 'dark' ? ':root,' : '.light {');
    for (const [key, value] of Object.entries(colors[mode])) {
      it(`${mode} --${kebab(key)}`, () => {
        expect(b.toUpperCase()).toContain(`--${kebab(key)}: ${value}`.toUpperCase());
      });
    }
  }
});
