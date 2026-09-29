import { Heart } from '@phosphor-icons/react';
import { favorites, toggleFavorite } from '@nightlist/mock';
import { App, Button } from 'antd';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/services/auth';
import { useDemo } from '@/hooks/useDemo';

export function FavoriteButton({ barId, className }: { barId: string; className?: string }) {
  useDemo();
  const { user } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const active = favorites().includes(barId);
  return (
    <Button
      shape="circle"
      className={className}
      aria-label={active ? 'เอาออกจากร้านโปรด' : 'บันทึกเป็นร้านโปรด'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return navigate('/login');
        const added = toggleFavorite(barId);
        message.success(added ? 'บันทึกเป็นร้านโปรดแล้ว' : 'เอาออกจากร้านโปรดแล้ว');
      }}
      icon={
        <motion.span
          key={String(active)}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 0.3 }}
          className="inline-flex"
        >
          <Heart
            weight={active ? 'fill' : 'regular'}
            className={active ? 'text-gold' : undefined}
          />
        </motion.span>
      }
    />
  );
}
