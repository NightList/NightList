import { MoonStars } from '@phosphor-icons/react';
import { Card, Flex, Typography } from 'antd';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** การ์ดกระจก + ไอคอนแอปลอย ใช้ร่วมกันทุกหน้า Auth */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative w-full max-w-[440px] pt-10"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="animate-float absolute left-1/2 top-0 z-10 -translate-x-1/2">
        <div className="grid h-20 w-20 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-purple via-[#7C3AED] to-gold shadow-[0_12px_40px_-8px_var(--purple)]">
          <MoonStars size={40} weight="fill" className="text-white drop-shadow" />
        </div>
      </div>
      <Card
        variant="borderless"
        classNames={{ root: 'glass-card !rounded-3xl', body: '!px-7 !pb-8 !pt-14 sm:!px-9' }}
      >
        <Flex vertical align="center" className="mb-7 text-center">
          <Typography.Title level={2} className="!mb-1 !font-display">
            {title}
          </Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </Flex>
        {children}
      </Card>
      {footer && <div className="mt-6 text-center text-xs text-muted">{footer}</div>}
    </motion.div>
  );
}
