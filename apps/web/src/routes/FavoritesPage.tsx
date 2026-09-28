import { favorites, getBar } from '@nightlist/mock';
import { Empty } from 'antd';
import { Link } from 'react-router';
import { BarCard } from '@/features/bars/BarCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { useDemo } from '@/shared/data/useDemo';

export function FavoritesPage() {
  useDemo();
  const bars = favorites()
    .map(getBar)
    .filter((b) => b !== null);
  return (
    <div>
      <PageHeader title="ร้านโปรด" />
      {bars.length === 0 ? (
        <Empty description="ยังไม่มีร้านโปรด">
          <Link to="/search">ไปหาร้าน →</Link>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bars.map((b, i) => (
            <BarCard key={b.id} bar={b} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
