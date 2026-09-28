import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './AuthProvider';

/** Layout route: ต้องล็อกอินก่อน ไม่งั้นส่งไป /login?next=... */
export function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spin fullscreen />;
  if (!session) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <Outlet />;
}
