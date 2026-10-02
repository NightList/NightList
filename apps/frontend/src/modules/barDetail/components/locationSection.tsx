import { MapPin, NavigationArrow } from '@phosphor-icons/react';
import { Button } from 'antd';
import type { BarWithTier } from '@/services/data';
import { BarMap, directionsUrl } from '@/ui/components/barMap';
import { InfoSection } from '@/ui/components/infoSection';

/** แผนที่ร้าน + ปุ่มนำทาง */
export function LocationSection({ bar }: { bar: BarWithTier }) {
  return (
    <InfoSection
      icon={<MapPin />}
      title="แผนที่"
      extra={
        <a href={directionsUrl(bar.lat, bar.lng)} target="_blank" rel="noreferrer noopener">
          <Button icon={<NavigationArrow />}>นำทาง</Button>
        </a>
      }
    >
      <BarMap bars={[bar]} className="h-64" />
    </InfoSection>
  );
}
