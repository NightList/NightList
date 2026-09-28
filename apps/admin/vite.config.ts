import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkg = (name: string) => fileURLToPath(new URL(`../../packages/${name}/src/index.ts`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // ใช้ source ของ workspace packages ตรงๆ — ไม่ต้องรอ tsup build dist (กัน error ตอน dist ถูกลบระหว่าง rebuild)
      { find: /^@nightlist\/(mock|types|utils|ui)$/, replacement: pkg('$1') },
    ],
  },
  server: { port: 5174 },
});
