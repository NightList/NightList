import {
  CalendarPlus,
  Calculator,
  Clock,
  Gift,
  InstagramLogo,
  MapPin,
  TiktokLogo,
} from '@phosphor-icons/react';
import { barReviews, CATEGORY_LABELS, getBarBySlug } from '@nightlist/mock';
import { StarRating, TierBadge } from '@nightlist/ui';
import { Button, Card, Descriptions, Drawer, Empty, Result, Table, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { BarCover } from '@/features/bars/BarCard';
import { CrowdBadge } from '@/features/bars/CrowdBadge';
import { FavoriteButton } from '@/features/bars/FavoriteButton';
import { SafetyList } from '@/features/bars/SafetyList';
import { PriceEstimator, type EstimatorValue } from '@/features/booking/PriceEstimator';
import { ReviewList } from '@/features/bars/ReviewList';
import { useDemo } from '@/shared/data/useDemo';
import { baht } from '@/shared/lib/format';

const DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** /bars/:slug — หน้าร้าน */
export function BarDetailPage() {
  useDemo();
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const bar = getBarBySlug(slug);
  const [estOpen, setEstOpen] = useState(false);
  const [est, setEst] = useState<EstimatorValue>({ pax: 4, qty: {} });

  if (!bar || bar.status !== 'APPROVED') {
    return (
      <Result
        status="404"
        title="ไม่พบร้านนี้"
        extra={
          <Link to="/search">
            <Button type="primary">ค้นหาร้านอื่น</Button>
          </Link>
        }
      />
    );
  }
  const reviews = barReviews(bar.id);
  const book = () => navigate(`/bars/${bar.slug}/book`, { state: est });

  return (
    <div className="pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <BarCover bar={bar} className="h-56 md:h-72" />
        <FavoriteButton barId={bar.id} className="!absolute right-4 top-4" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {bar.tier ? <TierBadge tier={bar.tier} /> : <Tag color="purple">ร้านใหม่</Tag>}
            <Tag>{CATEGORY_LABELS[bar.category]}</Tag>
            {bar.editorsPick && <Tag color="gold">Editor&apos;s Pick</Tag>}
            {bar.promoted && <Tag>แนะนำ · โฆษณา</Tag>}
            {bar.styles.map((s) => (
              <Tag key={s} color="purple" variant="filled">
                {s}
              </Tag>
            ))}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold">{bar.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
            {bar.isNew ? (
              <span className="text-muted">ร้านใหม่ · ยังไม่มีดาว</span>
            ) : (
              <StarRating value={bar.rating} reviewCount={bar.reviewCount} />
            )}
            <span className="inline-flex items-center gap-1 text-muted">
              <MapPin /> {bar.district}
            </span>
            <CrowdBadge crowd={bar.crowd} updatedAt={bar.crowdUpdatedAt} showTime />
          </div>
          <p className="mt-4 text-muted">{bar.description}</p>

          <Tabs
            className="mt-6"
            items={[
              {
                key: 'info',
                label: 'ข้อมูลร้าน',
                children: (
                  <div className="space-y-6">
                    <Descriptions
                      column={{ xs: 1, sm: 2 }}
                      items={[
                        { key: 'a', label: 'ที่อยู่', children: bar.address },
                        {
                          key: 'p',
                          label: 'ราคาเฉลี่ย',
                          children: `~${baht(bar.avgPerPerson)} / คน`,
                        },
                        {
                          key: 's',
                          label: 'Service charge / VAT',
                          children: `${bar.fees.serviceChargeRate}% / ${bar.fees.vatRate}%`,
                        },
                        {
                          key: 'o',
                          label: 'ค่าอื่นๆ',
                          children: bar.fees.otherFees ? baht(bar.fees.otherFees) : 'ไม่มี',
                        },
                        {
                          key: 'g',
                          label: 'เก็บโต๊ะให้',
                          children: `${bar.gracePeriodMinutes} นาทีหลังเวลาจอง`,
                        },
                        {
                          key: 'd',
                          label: 'มัดจำ',
                          children: bar.deposit.enabled
                            ? `${baht(bar.deposit.amount)} / โต๊ะ`
                            : 'ไม่ต้องมัดจำ',
                        },
                      ]}
                    />
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-semibold">
                        <Clock /> เวลาเปิด-ปิด
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-sm sm:grid-cols-7">
                        {bar.hours.map((h) => (
                          <div
                            key={h.day}
                            className="rounded-lg border border-border p-2 text-center"
                          >
                            <p className="text-muted">{DAYS[h.day]}</p>
                            <p>{h.closed ? 'ปิด' : `${h.open}–${h.close}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-semibold">
                        <Gift /> สิทธิพิเศษเมื่อจองผ่าน NightList
                      </p>
                      <ul className="list-inside list-disc text-sm text-muted">
                        {bar.perks.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      {bar.links.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer noopener">
                          <Button
                            shape="circle"
                            aria-label={l.type}
                            icon={l.type === 'INSTAGRAM' ? <InstagramLogo /> : <TiktokLogo />}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: 'menu',
                label: 'เมนู & ราคา',
                children: (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {bar.packages.map((p) => (
                        <Card key={p.id} size="small">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xl font-bold text-gold-text">{baht(p.totalPrice)}</p>
                          <p className="text-xs text-muted">
                            {p.paxMin}–{p.paxMax} คน · ยังไม่รวม SC/VAT
                          </p>
                        </Card>
                      ))}
                    </div>
                    <Table
                      size="small"
                      rowKey="id"
                      pagination={false}
                      dataSource={bar.menu}
                      columns={[
                        { title: 'หมวด', dataIndex: 'category', width: 110 },
                        { title: 'รายการ', dataIndex: 'name' },
                        {
                          title: 'ราคา',
                          dataIndex: 'price',
                          align: 'right',
                          render: (v: number) => baht(v),
                        },
                      ]}
                    />
                  </div>
                ),
              },
              { key: 'safety', label: 'ความปลอดภัย', children: <SafetyList bar={bar} /> },
              {
                key: 'reviews',
                label: `รีวิว (${reviews.length})`,
                children: reviews.length ? (
                  <ReviewList reviews={reviews.slice(0, 5)} more={`/bars/${bar.slug}/reviews`} />
                ) : (
                  <Empty description="ยังไม่มีรีวิว" />
                ),
              },
            ]}
          />
        </div>

        <aside className="hidden lg:block">
          <Card className="sticky top-24" title="จองโต๊ะ">
            <p className="text-sm text-muted">ประมาณ {baht(bar.avgPerPerson)} / คน</p>
            <Button
              block
              size="large"
              className="mt-4"
              icon={<Calculator />}
              onClick={() => setEstOpen(true)}
            >
              ประเมินราคา
            </Button>
            <Button
              block
              type="primary"
              size="large"
              className="mt-3"
              icon={<CalendarPlus />}
              onClick={book}
            >
              จองเลย
            </Button>
          </Card>
        </aside>
      </div>

      {/* แถบล่าง (มือถือ) */}
      <div className="fixed inset-x-0 bottom-16 z-20 flex gap-3 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
        <Button block size="large" icon={<Calculator />} onClick={() => setEstOpen(true)}>
          ประเมินราคา
        </Button>
        <Button block type="primary" size="large" icon={<CalendarPlus />} onClick={book}>
          จองเลย
        </Button>
      </div>

      <Drawer
        open={estOpen}
        onClose={() => setEstOpen(false)}
        title={`ประเมินราคา · ${bar.name}`}
        placement="right"
        size="large"
        footer={
          <Button block type="primary" size="large" onClick={book}>
            จองด้วยรายการนี้
          </Button>
        }
      >
        <PriceEstimator bar={bar} value={est} onChange={setEst} />
      </Drawer>
    </div>
  );
}
