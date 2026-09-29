import { getAntdTheme } from '@nightlist/ui';
import { Button, ConfigProvider, type ThemeConfig } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';
import { AgeGate } from '@/ui/components/ageGate';

/**
 * ธีมเฉพาะหน้า Auth (Figma: Login/Register → login 2)
 * พื้นหลังเป็นภาพกลางคืนเสมอ จึงล็อกเป็น dark ไม่ขึ้นกับสวิตช์ธีม
 * ช่องกรอก: พื้นดำโปร่ง ขอบเทา #323232 มุม 10px · ปุ่มหลัก/checkbox: ม่วง
 */
const base = getAntdTheme('dark');
const authTheme: ThemeConfig = {
  ...base,
  cssVar: { key: 'nightlist-auth' },
  token: {
    ...base.token,
    colorPrimary: '#8b4fe3',
    colorTextLightSolid: '#ffffff',
    colorLink: '#b98cff',
    borderRadius: 10,
  },
  components: {
    ...base.components,
    Input: {
      colorBgContainer: 'rgba(9, 9, 9, 0.55)',
      colorBorder: '#323232',
      hoverBorderColor: '#6d4bb0',
      activeBorderColor: '#8b4fe3',
      activeShadow: '0 0 0 3px rgba(139, 79, 227, 0.25)',
      controlHeightLG: 52,
      paddingInlineLG: 18,
    },
    DatePicker: {
      colorBgContainer: 'rgba(9, 9, 9, 0.55)',
      colorBorder: '#323232',
      controlHeightLG: 52,
    },
    Button: { primaryColor: '#ffffff', controlHeightLG: 52, fontWeight: 600 },
  },
};

/**
 * Layout ของหน้า Auth ทั้งหมด (login / register / forgot / reset / verify / invite)
 * Desktop: การ์ดอยู่ครึ่งขวา ให้ภาพพื้นหลังโชว์ฝั่งซ้าย · Mobile: การ์ดกลางจอ
 */
export function AuthLayout() {
  const { pathname } = useLocation();
  const onRegister = pathname === '/register';

  return (
    <ConfigProvider theme={authTheme}>
      <div className="dark relative isolate min-h-dvh overflow-hidden bg-[#07070d] text-[#f5f1e8]">
        <AgeGate />
        <img
          src="/images/login/bg.jpg"
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover object-[30%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-black/70" />

        <header className="flex h-16 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 !text-[#f5f1e8]" aria-label="กลับหน้าแรก NightList">
            <img src="/images/common/logo.png" alt="" width={36} height={35} className="size-9" />
            <span className="font-display text-lg font-bold text-gold">NightList</span>
          </Link>
          <Link to={onRegister ? '/login' : '/register'}>
            <Button type="primary">{onRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</Button>
          </Link>
        </header>

        <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 pb-12 lg:justify-end lg:pr-[9vw]">
          <Outlet />
        </main>
      </div>
    </ConfigProvider>
  );
}
