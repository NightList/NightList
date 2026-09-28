import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from 'react-router';
import { HomePage } from '@/routes/HomePage';
import { LoginPage } from '@/routes/LoginPage';
import { NotFoundPage } from '@/routes/NotFoundPage';
import { TonightPage } from '@/routes/TonightPage';
import { RequireAuth } from '@/shared/auth/RequireAuth';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { MainLayout } from '@/shared/layouts/MainLayout';

/** หน้าชั่วคราวตาม docs/SITEMAP.md — แทนที่ทีละ feature */
const todo = (path: string, title: string): RouteObject => ({
  path,
  element: <PlaceholderPage title={title} path={`/${path}`} />,
});

const routes: RouteObject[] = [
  {
    // ---- เข้าสู่ระบบ (layout เต็มจอ ไม่มี header/bottom nav ปกติ) ----
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      todo('register', 'สมัครสมาชิก'),
      todo('verify-email', 'ยืนยันอีเมล'),
      todo('forgot-password', 'ลืมรหัสผ่าน'),
      todo('reset-password', 'ตั้งรหัสผ่านใหม่'),
      todo('accept-invite', 'รับคำเชิญ Staff'),
    ],
  },
  {
    element: <MainLayout />,
    children: [
      // ---- สาธารณะ ----
      { index: true, element: <HomePage /> },
      todo('ranking', 'จัดอันดับ'),
      todo('ranking/:category/:district?', 'จัดอันดับตามหมวด/ย่าน'),
      todo('search', 'ค้นหา'),
      todo('bars/:slug', 'หน้าร้าน'),
      todo('bars/:slug/reviews', 'รีวิวทั้งหมด'),
      todo('share/:token', 'บัตรจองที่แชร์'),
      todo('about', 'เกี่ยวกับเรา'),
      todo('terms', 'เงื่อนไขการใช้งาน'),
      todo('privacy', 'นโยบายความเป็นส่วนตัว'),
      todo('cookies', 'นโยบายคุกกี้'),

      // ---- ลูกค้า (ต้องล็อกอิน) ----
      {
        element: <RequireAuth />,
        children: [
          todo('onboarding', 'ตั้งค่าความชอบ'),
          todo('bars/:slug/book', 'จองโต๊ะ'),
          todo('bookings', 'การจองของฉัน'),
          todo('bookings/:id', 'บัตรจอง'),
          todo('bookings/:id/deposit', 'จ่ายมัดจำ'),
          todo('reviews/new', 'เขียนรีวิว'),
          todo('reviews', 'รีวิวของฉัน'),
          todo('favorites', 'ร้านโปรด'),
          todo('notifications', 'แจ้งเตือน'),
          todo('profile', 'โปรไฟล์'),
          todo('settings', 'ตั้งค่า'),

          // ---- ร้าน /merchant (TODO: <RequireRole role="MERCHANT|STAFF">) ----
          {
            path: 'merchant',
            element: <Outlet />,
            children: [
              { index: true, element: <PlaceholderPage title="แดชบอร์ดร้าน" path="/merchant" /> },
              { path: 'tonight', element: <TonightPage /> },
              todo('join', 'สมัครเป็นร้าน'),
              todo('status', 'สถานะการตรวจ'),
              todo('bookings', 'การจอง'),
              todo('bookings/:id', 'รายละเอียดการจอง'),
              todo('deposits', 'ตรวจสลิป'),
              todo('store', 'ข้อมูลร้าน'),
              todo('safety', 'ความปลอดภัย'),
              todo('menu', 'เมนู'),
              todo('pricing', 'ค่าธรรมเนียม + แพ็กเกจ'),
              todo('tables', 'โซน / โต๊ะ'),
              todo('settings', 'ตั้งค่าการจอง'),
              todo('promote', 'โปรโมทร้าน'),
              todo('reviews', 'รีวิว'),
              todo('analytics', 'สถิติ'),
              todo('billing', 'ค่าคอม'),
              todo('staff', 'พนักงาน'),
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
