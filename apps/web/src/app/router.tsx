import { runTimeouts } from '@nightlist/mock';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router';
import {
  AcceptInvitePage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/routes/AuthMiscPages';
import { BarDetailPage } from '@/routes/BarDetailPage';
import { BarReviewsPage } from '@/routes/BarReviewsPage';
import { BookingDetailPage } from '@/routes/BookingDetailPage';
import { BookingsPage } from '@/routes/BookingsPage';
import { BookPage } from '@/routes/BookPage';
import { DepositPage } from '@/routes/DepositPage';
import { FavoritesPage } from '@/routes/FavoritesPage';
import { HomePage } from '@/routes/HomePage';
import { LoginPage } from '@/routes/LoginPage';
import { MerchantAnalyticsPage } from '@/routes/merchant/AnalyticsPage';
import { MerchantBillingPage } from '@/routes/merchant/BillingPage';
import { MerchantBookingsPage } from '@/routes/merchant/BookingsPage';
import { MerchantDashboardPage } from '@/routes/merchant/DashboardPage';
import { MerchantDepositsPage } from '@/routes/merchant/DepositsPage';
import { MerchantJoinPage, MerchantStatusPage } from '@/routes/merchant/JoinPage';
import { MerchantLayout } from '@/routes/merchant/MerchantLayout';
import { MerchantMenuPage } from '@/routes/merchant/MenuPage';
import { MerchantPricingPage } from '@/routes/merchant/PricingPage';
import { MerchantPromotePage } from '@/routes/merchant/PromotePage';
import { MerchantReviewsPage } from '@/routes/merchant/ReviewsPage';
import { MerchantSafetyPage } from '@/routes/merchant/SafetyPage';
import { MerchantSettingsPage } from '@/routes/merchant/SettingsPage';
import { MerchantStaffPage } from '@/routes/merchant/StaffPage';
import { MerchantStorePage } from '@/routes/merchant/StorePage';
import { MerchantTablesPage } from '@/routes/merchant/TablesPage';
import { TonightPage } from '@/routes/merchant/TonightPage';
import { MyReviewsPage } from '@/routes/MyReviewsPage';
import { NotFoundPage } from '@/routes/NotFoundPage';
import { NotificationsPage } from '@/routes/NotificationsPage';
import { OnboardingPage } from '@/routes/OnboardingPage';
import { ProfilePage } from '@/routes/ProfilePage';
import { RankingPage } from '@/routes/RankingPage';
import { RegisterPage } from '@/routes/RegisterPage';
import { ReviewNewPage } from '@/routes/ReviewNewPage';
import { SearchPage } from '@/routes/SearchPage';
import { SettingsPage } from '@/routes/SettingsPage';
import { SharePage } from '@/routes/SharePage';
import { StaticPage } from '@/routes/StaticPage';
import { RequireAuth, RequireRole } from '@/shared/auth/RequireAuth';
import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { MainLayout } from '@/shared/layouts/MainLayout';

// เดโม: จำลอง pg_cron — ตรวจ NO_SHOW / EXPIRED ตอนเปิดแอปและทุก 1 นาที
runTimeouts();
setInterval(runTimeouts, 60_000);

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

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
