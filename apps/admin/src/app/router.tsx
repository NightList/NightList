import { createBrowserRouter, RouterProvider } from 'react-router';
import { DashboardPage } from '@/routes/DashboardPage';
import { PlaceholderPage } from '@/routes/PlaceholderPage';
import { AdminLayout } from './AdminLayout';
import { ADMIN_ROUTES } from './menu';

const router = createBrowserRouter([
  { path: '/login', element: <PlaceholderPage title="เข้าสู่ระบบ (email + password + MFA)" /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      ...ADMIN_ROUTES.filter((r) => r.path !== '/').map((r) => ({
        path: r.path.slice(1),
        element: <PlaceholderPage title={r.name} />,
      })),
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
