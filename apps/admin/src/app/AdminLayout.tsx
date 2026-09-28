import { MoonStars } from '@phosphor-icons/react';
import { ProLayout } from '@ant-design/pro-components';
import { ThemeToggle } from '@nightlist/ui';
import { Link, Outlet, useLocation } from 'react-router';
import { ADMIN_ROUTES } from './menu';

/** Layout หลักของ Backoffice (ProLayout) — TODO: ตรวจ role ADMIN + MFA (AAL2) */
export function AdminLayout() {
  const location = useLocation();
  return (
    <ProLayout
      title="NightList Admin"
      logo={<MoonStars size={28} weight="fill" color="#E8B64C" />}
      layout="mix"
      fixSiderbar
      location={{ pathname: location.pathname }}
      route={{ path: '/', routes: ADMIN_ROUTES }}
      menuItemRender={(item, dom) => <Link to={item.path ?? '/'}>{dom}</Link>}
      actionsRender={() => [<ThemeToggle key="theme" />]}
    >
      <Outlet />
    </ProLayout>
  );
}
