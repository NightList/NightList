import { runTimeouts } from '@nightlist/mock';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { DEMO_TIMEOUT_INTERVAL } from '@/configs/app';
import { AuthLayout } from '@/layouts/auth';
import { MainLayout } from '@/layouts/main';
import { MerchantLayout } from '@/layouts/merchant';
import { AcceptInvitePage } from '@/modules/acceptInvite/page';
import { BarDetailPage } from '@/modules/barDetail/page';
import { BarReviewsPage } from '@/modules/barReviews/page';
import { BookPage } from '@/modules/book/page';
import { BookingDetailPage } from '@/modules/bookingDetail/page';
import { BookingsPage } from '@/modules/bookings/page';
import { DepositPage } from '@/modules/deposit/page';
import { FavoritesPage } from '@/modules/favorites/page';
import { ForgotPasswordPage } from '@/modules/forgotPassword/page';
import { HomePage } from '@/modules/home/page';
import { LoginPage } from '@/modules/login/page';
import { MerchantAnalyticsPage } from '@/modules/merchant/analytics/page';
import { MerchantBillingPage } from '@/modules/merchant/billing/page';
import { MerchantBookingsPage } from '@/modules/merchant/bookings/page';
import { MerchantDashboardPage } from '@/modules/merchant/dashboard/page';
import { MerchantDepositsPage } from '@/modules/merchant/deposits/page';
import { MerchantJoinPage } from '@/modules/merchant/join/page';
import { MerchantMenuPage } from '@/modules/merchant/menu/page';
import { MerchantPricingPage } from '@/modules/merchant/pricing/page';
import { MerchantPromotePage } from '@/modules/merchant/promote/page';
import { MerchantReviewsPage } from '@/modules/merchant/reviews/page';
import { MerchantSafetyPage } from '@/modules/merchant/safety/page';
import { MerchantSettingsPage } from '@/modules/merchant/settings/page';
import { MerchantStaffPage } from '@/modules/merchant/staff/page';
import { MerchantStatusPage } from '@/modules/merchant/status/page';
import { MerchantStorePage } from '@/modules/merchant/store/page';
import { MerchantTablesPage } from '@/modules/merchant/tables/page';
import { TonightPage } from '@/modules/merchant/tonight/page';
import { MyReviewsPage } from '@/modules/myReviews/page';
import { NotFoundPage } from '@/modules/notFound/page';
import { NotificationsPage } from '@/modules/notifications/page';
import { OnboardingPage } from '@/modules/onboarding/page';
import { ProfilePage } from '@/modules/profile/page';
import { RankingPage } from '@/modules/ranking/page';
import { RegisterPage } from '@/modules/register/page';
import { ResetPasswordPage } from '@/modules/resetPassword/page';
import { ReviewNewPage } from '@/modules/reviewNew/page';
import { SearchPage } from '@/modules/search/page';
import { SettingsPage } from '@/modules/settings/page';
import { SharePage } from '@/modules/share/page';
import { StaticPage } from '@/modules/static/page';
import { VerifyEmailPage } from '@/modules/verifyEmail/page';
import { RequireAuth, RequireRole } from './middleware';

// เดโม: จำลอง pg_cron — ตรวจ NO_SHOW / EXPIRED ตอนเปิดแอปและทุก 1 นาที
runTimeouts();
setInterval(runTimeouts, DEMO_TIMEOUT_INTERVAL);

/** route ทั้งหมดตาม docs/SITEMAP.md */
const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'accept-invite', element: <AcceptInvitePage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      // ---- สาธารณะ ----
      { index: true, element: <HomePage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'bars/:slug', element: <BarDetailPage /> },
      { path: 'bars/:slug/reviews', element: <BarReviewsPage /> },
      { path: 'share/:token', element: <SharePage /> },
      { path: 'about', element: <StaticPage page="about" /> },
      { path: 'terms', element: <StaticPage page="terms" /> },
      { path: 'privacy', element: <StaticPage page="privacy" /> },
      { path: 'cookies', element: <StaticPage page="cookies" /> },

      // ---- ลูกค้า (ต้องล็อกอิน) ----
      {
        element: <RequireAuth />,
        children: [
          { path: 'onboarding', element: <OnboardingPage /> },
          { path: 'bars/:slug/book', element: <BookPage /> },
          { path: 'bookings', element: <BookingsPage /> },
          { path: 'bookings/:id', element: <BookingDetailPage /> },
          { path: 'bookings/:id/deposit', element: <DepositPage /> },
          { path: 'reviews/new', element: <ReviewNewPage /> },
          { path: 'reviews', element: <MyReviewsPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'merchant/join', element: <MerchantJoinPage /> },
          { path: 'merchant/status', element: <MerchantStatusPage /> },

          // ---- ร้าน /merchant ----
          {
            element: <RequireRole roles={['MERCHANT', 'STAFF']} />,
            children: [
              {
                path: 'merchant',
                element: <MerchantLayout />,
                children: [
                  { index: true, element: <MerchantDashboardPage /> },
                  { path: 'tonight', element: <TonightPage /> },
                  { path: 'bookings', element: <MerchantBookingsPage /> },
                  { path: 'deposits', element: <MerchantDepositsPage /> },
                  { path: 'store', element: <MerchantStorePage /> },
                  { path: 'menu', element: <MerchantMenuPage /> },
                  { path: 'pricing', element: <MerchantPricingPage /> },
                  { path: 'tables', element: <MerchantTablesPage /> },
                  { path: 'safety', element: <MerchantSafetyPage /> },
                  { path: 'settings', element: <MerchantSettingsPage /> },
                  { path: 'promote', element: <MerchantPromotePage /> },
                  { path: 'reviews', element: <MerchantReviewsPage /> },
                  { path: 'analytics', element: <MerchantAnalyticsPage /> },
                  { path: 'billing', element: <MerchantBillingPage /> },
                  { path: 'staff', element: <MerchantStaffPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
