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
  build: {
    // แยก vendor ออกเป็น chunk ของตัวเอง — เบราว์เซอร์ cache ไว้ได้ข้าม deploy และโหลดขนานกัน
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) return 'vendor-react';
          // antd ไม่รวมเป็นก้อนเดียว — ให้ Rollup แยกตามหน้าที่ใช้ หน้าแรกจะได้ไม่ต้องโหลด Table/DatePicker/Upload ที่ยังไม่ใช้
          if (/[\\/]node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/.test(id)) return 'vendor-motion';
          if (id.includes('@supabase')) return 'vendor-supabase';
        },
      },
    },
  },
  server: { port: 5173 },
});
