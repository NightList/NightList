import { MoonStars, SignOut } from '@phosphor-icons/react';
import { ProLayout } from '@ant-design/pro-components';
import { currentUser, demoLogout } from '@nightlist/mock';
import { ThemeToggle } from '@nightlist/ui';
import { Button, Tooltip } from 'antd';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useDemo } from '@/hooks/useDemo';
import { ADMIN_ROUTES } from '@/configs/menu';

/** Layout หลักของ Backoffice — เข้าได้เฉพาะ ADMIN (ของจริงต้อง MFA / AAL2) */
export function MainLayout() {
  useDemo();
  const location = useLocation();
  const navigate = useNavigate();
  const user = currentUser();
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return (
    <ProLayout
      title="NightList Admin"
      logo={<MoonStars size={28} weight="fill" color="#E8B64C" />}
      layout="mix"
      fixSiderbar
      location={{ pathname: location.pathname }}
      route={{ path: '/', routes: ADMIN_ROUTES }}
      menuItemRender={(item, dom) => <Link to={item.path ?? '/'}>{dom}</Link>}
      actionsRender={() => [
        <ThemeToggle key="theme" />,
        <Tooltip key="out" title="ออกจากระบบ">
          <Button
            type="text"
            shape="circle"
            aria-label="ออกจากระบบ"
            icon={<SignOut size={18} />}
            onClick={() => {
              demoLogout();
              navigate('/login');
            }}
          />
        </Tooltip>,
      ]}
    >
      <Outlet />
    </ProLayout>
  );
}
