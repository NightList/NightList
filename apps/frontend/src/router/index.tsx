import { runTimeouts } from '@nightlist/mock';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { DEMO_TIMEOUT_INTERVAL } from '@/configs/app';
import { AuthLayout } from '@/layouts/auth';
import { MainLayout } from '@/layouts/main';
import { MerchantLayout } from '@/layouts/merchant';
import { HomePage } from '@/modules/home/page';
import { RequireAuth, RequireRole } from './middleware';

// เดโม: จำลอง pg_cron — ตรวจ NO_SHOW / EXPIRED ตอนเปิดแอปและทุก 1 นาที
runTimeouts();
setInterval(runTimeouts, DEMO_TIMEOUT_INTERVAL);

/**
 * route ทั้งหมดตาม docs/SITEMAP.md
 * ทุกหน้ายกเว้น Home โหลดแบบ lazy (แยก chunk ต่อหน้า) — bundle แรกเล็กลง หน้าแรกขึ้นไว
 */
const routes: RouteObject[] = [
  // แผนที่เต็มจอ (ไม่มี navbar — มีปุ่มลอยของตัวเอง)
  { path: 'map', lazy: () => import('@/modules/map/page').then((m) => ({ Component: m.MapPage })) },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', lazy: () => import('@/modules/login/page').then((m) => ({ Component: m.LoginPage })) },
      { path: 'register', lazy: () => import('@/modules/register/page').then((m) => ({ Component: m.RegisterPage })) },
      { path: 'verify-email', lazy: () => import('@/modules/verifyEmail/page').then((m) => ({ Component: m.VerifyEmailPage })) },
      { path: 'forgot-password', lazy: () => import('@/modules/forgotPassword/page').then((m) => ({ Component: m.ForgotPasswordPage })) },
      { path: 'reset-password', lazy: () => import('@/modules/resetPassword/page').then((m) => ({ Component: m.ResetPasswordPage })) },
      { path: 'accept-invite', lazy: () => import('@/modules/acceptInvite/page').then((m) => ({ Component: m.AcceptInvitePage })) },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      // ---- สาธารณะ ----
      { index: true, element: <HomePage /> },
      { path: 'ranking', handle: { fullBleed: true }, lazy: () => import('@/modules/ranking/page').then((m) => ({ Component: m.RankingPage })) },
      { path: 'search', lazy: () => import('@/modules/search/page').then((m) => ({ Component: m.SearchPage })) },
      { path: 'bars/:slug', lazy: () => import('@/modules/barDetail/page').then((m) => ({ Component: m.BarDetailPage })) },
      { path: 'bars/:slug/reviews', lazy: () => import('@/modules/barReviews/page').then((m) => ({ Component: m.BarReviewsPage })) },
      { path: 'share/:token', lazy: () => import('@/modules/share/page').then((m) => ({ Component: m.SharePage })) },
      { path: 'about', lazy: () => import('@/modules/static/page').then((m) => ({ Component: () => <m.StaticPage page="about" /> })) },
      { path: 'terms', lazy: () => import('@/modules/static/page').then((m) => ({ Component: () => <m.StaticPage page="terms" /> })) },
      { path: 'privacy', lazy: () => import('@/modules/static/page').then((m) => ({ Component: () => <m.StaticPage page="privacy" /> })) },
      { path: 'cookies', lazy: () => import('@/modules/static/page').then((m) => ({ Component: () => <m.StaticPage page="cookies" /> })) },

      // ---- ลูกค้า (ต้องล็อกอิน) ----
      {
        element: <RequireAuth />,
        children: [
          { path: 'onboarding', lazy: () => import('@/modules/onboarding/page').then((m) => ({ Component: m.OnboardingPage })) },
          { path: 'bars/:slug/book', lazy: () => import('@/modules/book/page').then((m) => ({ Component: m.BookPage })) },
          { path: 'bookings', lazy: () => import('@/modules/bookings/page').then((m) => ({ Component: m.BookingsPage })) },
          { path: 'bookings/:id', lazy: () => import('@/modules/bookingDetail/page').then((m) => ({ Component: m.BookingDetailPage })) },
          { path: 'bookings/:id/deposit', lazy: () => import('@/modules/deposit/page').then((m) => ({ Component: m.DepositPage })) },
          { path: 'reviews/new', lazy: () => import('@/modules/reviewNew/page').then((m) => ({ Component: m.ReviewNewPage })) },
          { path: 'reviews', lazy: () => import('@/modules/myReviews/page').then((m) => ({ Component: m.MyReviewsPage })) },
          { path: 'favorites', lazy: () => import('@/modules/favorites/page').then((m) => ({ Component: m.FavoritesPage })) },
          { path: 'notifications', lazy: () => import('@/modules/notifications/page').then((m) => ({ Component: m.NotificationsPage })) },
          { path: 'profile', lazy: () => import('@/modules/profile/page').then((m) => ({ Component: m.ProfilePage })) },
          { path: 'settings', lazy: () => import('@/modules/settings/page').then((m) => ({ Component: m.SettingsPage })) },
          { path: 'merchant/join', lazy: () => import('@/modules/merchant/join/page').then((m) => ({ Component: m.MerchantJoinPage })) },
          { path: 'merchant/status', lazy: () => import('@/modules/merchant/status/page').then((m) => ({ Component: m.MerchantStatusPage })) },

          // ---- ร้าน /merchant ----
          {
            element: <RequireRole roles={['MERCHANT', 'STAFF']} />,
            children: [
              {
                path: 'merchant',
                element: <MerchantLayout />,
                children: [
                  { index: true, lazy: () => import('@/modules/merchant/dashboard/page').then((m) => ({ Component: m.MerchantDashboardPage })) },
                  { path: 'tonight', lazy: () => import('@/modules/merchant/tonight/page').then((m) => ({ Component: m.TonightPage })) },
                  { path: 'bookings', lazy: () => import('@/modules/merchant/bookings/page').then((m) => ({ Component: m.MerchantBookingsPage })) },
                  { path: 'deposits', lazy: () => import('@/modules/merchant/deposits/page').then((m) => ({ Component: m.MerchantDepositsPage })) },
                  { path: 'store', lazy: () => import('@/modules/merchant/store/page').then((m) => ({ Component: m.MerchantStorePage })) },
                  { path: 'menu', lazy: () => import('@/modules/merchant/menu/page').then((m) => ({ Component: m.MerchantMenuPage })) },
                  { path: 'promotions', lazy: () => import('@/modules/merchant/promotions/page').then((m) => ({ Component: m.MerchantPromotionsPage })) },
                  { path: 'tables', lazy: () => import('@/modules/merchant/tables/page').then((m) => ({ Component: m.MerchantTablesPage })) },
                  { path: 'safety', lazy: () => import('@/modules/merchant/safety/page').then((m) => ({ Component: m.MerchantSafetyPage })) },
                  { path: 'settings', lazy: () => import('@/modules/merchant/settings/page').then((m) => ({ Component: m.MerchantSettingsPage })) },
                  { path: 'promote', lazy: () => import('@/modules/merchant/promote/page').then((m) => ({ Component: m.MerchantPromotePage })) },
                  { path: 'reviews', lazy: () => import('@/modules/merchant/reviews/page').then((m) => ({ Component: m.MerchantReviewsPage })) },
                  { path: 'analytics', lazy: () => import('@/modules/merchant/analytics/page').then((m) => ({ Component: m.MerchantAnalyticsPage })) },
                  { path: 'billing', lazy: () => import('@/modules/merchant/billing/page').then((m) => ({ Component: m.MerchantBillingPage })) },
                  { path: 'staff', lazy: () => import('@/modules/merchant/staff/page').then((m) => ({ Component: m.MerchantStaffPage })) },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        handle: { fullBleed: true, hideFooter: true },
        lazy: () => import('@/modules/notFound/page').then((m) => ({ Component: m.NotFoundPage })),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
