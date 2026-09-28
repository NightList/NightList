import { createBrowserRouter, RouterProvider } from 'react-router';
import { DashboardPage } from '@/routes/DashboardPage';
import { LoginPage } from '@/routes/LoginPage';
import {
  AuditLogsPage,
  BarsPage,
  BillingPage,
  BookingsPage,
  MerchantsPage,
  PromotionsPage,
  RankingPage,
  ReviewsPage,
  SafetyPage,
  SettingsPage,
  UsersPage,
} from '@/routes/pages';
import { AdminLayout } from './AdminLayout';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'merchants', element: <MerchantsPage /> },
      { path: 'bars', element: <BarsPage /> },
      { path: 'safety', element: <SafetyPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'promotions', element: <PromotionsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
