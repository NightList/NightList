import { Barricade } from '@phosphor-icons/react';
import { Result } from 'antd';

/** หน้าชั่วคราวระหว่างพัฒนา — แทนที่เมื่อทำ feature จริง */
export function PlaceholderPage({ title, path }: { title: string; path?: string }) {
  return (
    <Result
      icon={<Barricade size={64} weight="duotone" className="mx-auto text-gold-text" />}
      title={title}
      subTitle={path ? `${path} · กำลังพัฒนา` : 'กำลังพัฒนา'}
    />
  );
}
