import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC ให้ decorator metadata ทำงาน (NestJS DI) ใน vitest
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],
    env: { JOB_SECRET: 'test-job-secret', NODE_ENV: 'test' },
  },
});
