import { PageContainer } from '@ant-design/pro-components';
import {
  billingEvents,
  CATEGORY_LABELS,
  deleteReview,
  getBar,
  getState,
  reviewPromotion,
  SAFETY_LABELS,
  setBarStatus,
  setReviewReported,
  STYLES,
  tierList,
  updateBar,
  verifySafety,
  withTier,
} from '@nightlist/mock';
import type { Tier } from '@nightlist/types';
import { TierBadge } from '@nightlist/ui';
import { App, Button, Card, Input, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { useState } from 'react';
import { baht, dateTime } from '@/shared/format';
import { useDemo } from '@/shared/useDemo';

const ADMIN = 'admin@nightlist.app';
const BAR_STATUS_COLOR: Record<string, string> = {
  APPROVED: 'green',
  PENDING_REVIEW: 'gold',
  REJECTED: 'red',
  SUSPENDED: 'volcano',
  DRAFT: 'default',
};

export function MerchantsPage() {
  useDemo();
  const { message } = App.useApp();
  const rows = getState().bars.filter((b) => b.status === 'PENDING_REVIEW' || b.status === 'DRAFT');
  return (
    <PageContainer title="ร้านรออนุมัติ">
      <Table
        rowKey="id"
        dataSource={rows}
        locale={{ emptyText: 'ไม่มีร้านรอตรวจ' }}
        columns={[
          { title: 'ร้าน', dataIndex: 'name' },
          {
            title: 'ประเภท',
            dataIndex: 'category',
            render: (c: keyof typeof CATEGORY_LABELS) => CATEGORY_LABELS[c],
          },
          { title: 'ย่าน', dataIndex: 'district' },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => <Tag color={BAR_STATUS_COLOR[s]}>{s}</Tag>,
          },
          {
            title: '',
            key: 'a',
            render: (_, b) => (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setBarStatus(b.id, 'APPROVED', ADMIN);
                    message.success(`อนุมัติ ${b.name}`);
                  }}
                >
                  อนุมัติ
                </Button>
                <Button danger onClick={() => setBarStatus(b.id, 'REJECTED', ADMIN)}>
                  ไม่อนุมัติ
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}

export function BarsPage() {
  useDemo();
  const [q, setQ] = useState('');
  const rows = getState()
    .bars.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()))
    .map(withTier);
  return (
    <PageContainer
      title="จัดการร้าน"
      extra={<Input.Search placeholder="ค้นหาชื่อร้าน" allowClear onSearch={setQ} />}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        scroll={{ x: 900 }}
        columns={[
          { title: 'ร้าน', dataIndex: 'name' },
          { title: 'ย่าน', dataIndex: 'district' },
          {
            title: 'Tier',
            key: 't',
            render: (_, b) => (b.tier ? <TierBadge tier={b.tier} /> : <Tag>ร้านใหม่</Tag>),
          },
          { title: 'คะแนน', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => <Tag color={BAR_STATUS_COLOR[s]}>{s}</Tag>,
          },
          {
            title: "Editor's Pick",
            dataIndex: 'editorsPick',
            render: (v: boolean, b) => (
              <Switch
                size="small"
                checked={v}
                onChange={(editorsPick) => updateBar(b.id, { editorsPick }, ADMIN)}
              />
            ),
          },
          {
            title: '',
            key: 'a',
            render: (_, b) =>
              b.status === 'SUSPENDED' ? (
                <Button size="small" onClick={() => setBarStatus(b.id, 'APPROVED', ADMIN)}>
                  เปิดใช้งาน
                </Button>
              ) : (
                <Popconfirm
                  title={`ระงับ ${b.name}?`}
                  okText="ระงับ"
                  cancelText="ยกเลิก"
                  onConfirm={() => setBarStatus(b.id, 'SUSPENDED', ADMIN)}
                >
                  <Button size="small" danger>
                    ระงับ
                  </Button>
                </Popconfirm>
              ),
          },
        ]}
      />
    </PageContainer>
  );
}

export function SafetyPage() {
  useDemo();
  const rows = getState().bars.flatMap((b) =>
    b.safety
      .filter((s) => s.source === 'SELF_DECLARED' && s.value === 'YES')
      .map((s) => ({ id: `${b.id}-${s.key}`, barId: b.id, bar: b.name, key: s.key })),
  );
  return (
    <PageContainer
      title="ยืนยัน Safety"
      content="รายการที่ร้านแจ้งว่า “มี” แต่ทีมยังไม่ได้ตรวจหลักฐาน"
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'ร้าน', dataIndex: 'bar' },
          {
            title: 'มาตรการ',
            dataIndex: 'key',
            render: (k: keyof typeof SAFETY_LABELS) => SAFETY_LABELS[k],
          },
          {
            title: '',
            key: 'a',
            render: (_, r) => (
              <Button
                type="primary"
                size="small"
                onClick={() => verifySafety(r.barId, r.key, ADMIN)}
              >
                ยืนยันแล้ว
              </Button>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}

export function RankingPage() {
  useDemo();
  const tiers = tierList();
  const rows = (['S', 'A', 'B', 'C'] as Tier[]).flatMap((t) =>
    tiers[t].map((b) => ({ ...b, tierKey: t })),
  );
  return (
    <PageContainer
      title="ดาว / Tier"
      content="คำนวณจากคะแนนรวม (รีวิวเช็กอินจริง · จำนวนเช็กอิน · Safety · ข้อมูลราคา) — การโปรโมทไม่มีผลต่อดาว"
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'Tier', dataIndex: 'tierKey', render: (t: Tier) => <TierBadge tier={t} /> },
          { title: 'ร้าน', dataIndex: 'name' },
          { title: 'คะแนนรวม', dataIndex: 'score' },
          { title: 'ดาว', dataIndex: 'stars' },
          { title: 'รีวิว', dataIndex: 'reviewCount' },
          {
            title: 'โปรโมท',
            dataIndex: 'promoted',
            render: (v: boolean) => (v ? <Tag>โฆษณา</Tag> : '-'),
          },
        ]}
      />
    </PageContainer>
  );
}

export function PromotionsPage() {
  useDemo();
  const { message } = App.useApp();
  return (
    <PageContainer title="โปรโมท">
      <Table
        rowKey="id"
        dataSource={getState().promotions}
        columns={[
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'แพ็กเกจ', dataIndex: 'packageName' },
          { title: 'ราคา', dataIndex: 'price', render: (v: number) => baht(v) },
          { title: 'สั่งเมื่อ', dataIndex: 'createdAt', render: (v: string) => dateTime(v) },
          {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'ACTIVE' ? 'green' : s === 'REJECTED' ? 'red' : 'gold'}>{s}</Tag>
            ),
          },
          {
            title: '',
            key: 'a',
            render: (_, p) =>
              p.status === 'PAYMENT_SUBMITTED' && (
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      reviewPromotion(p.id, true, ADMIN);
                      message.success('เปิดโปรโมทแล้ว');
                    }}
                  >
                    สลิปผ่าน
                  </Button>
                  <Button danger size="small" onClick={() => reviewPromotion(p.id, false, ADMIN)}>
                    ไม่ผ่าน
                  </Button>
                </Space>
              ),
          },
        ]}
      />
    </PageContainer>
  );
}

export function UsersPage() {
  useDemo();
  return (
    <PageContainer title="ผู้ใช้">
      <Table
        rowKey="id"
        dataSource={getState().users}
        columns={[
          { title: 'ชื่อ', dataIndex: 'displayName' },
          { title: 'อีเมล', dataIndex: 'email' },
          {
            title: 'Role',
            dataIndex: 'role',
            filters: ['CUSTOMER', 'MERCHANT', 'STAFF', 'ADMIN'].map((r) => ({ text: r, value: r })),
            onFilter: (v, r) => r.role === v,
            render: (r: string) => (
              <Tag color={r === 'ADMIN' ? 'red' : r === 'CUSTOMER' ? 'default' : 'gold'}>{r}</Tag>
            ),
          },
          {
            title: 'ร้าน',
            dataIndex: 'barId',
            render: (id?: string) => (id ? getBar(id)?.name : '-'),
          },
          { title: 'สมัครเมื่อ', dataIndex: 'createdAt', render: (v: string) => dateTime(v) },
        ]}
      />
    </PageContainer>
  );
}

export function BookingsPage() {
  useDemo();
  const [q, setQ] = useState('');
  const rows = getState().bookings.filter(
    (b) => !q || b.code.includes(q.toUpperCase()) || b.userName.includes(q),
  );
  return (
    <PageContainer
      title="การจอง"
      extra={<Input.Search placeholder="รหัสจอง / ชื่อลูกค้า" allowClear onSearch={setQ} />}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender: (b) => (
            <ul className="text-sm">
              {b.history.map((h) => (
                <li key={h.at + h.to}>
                  {dateTime(h.at)} · {h.from ?? '—'} → {h.to} · {h.by}
                </li>
              ))}
            </ul>
          ),
        }}
        columns={[
          { title: 'รหัส', dataIndex: 'code' },
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'ลูกค้า', dataIndex: 'userName' },
          { title: 'เวลา', dataIndex: 'datetime', render: (v: string) => dateTime(v) },
          { title: 'คน', dataIndex: 'pax' },
          { title: 'สถานะ', dataIndex: 'status', render: (s: string) => <Tag>{s}</Tag> },
        ]}
      />
    </PageContainer>
  );
}

export function ReviewsPage() {
  useDemo();
  const rows = getState().reviews.filter((r) => r.reported);
  return (
    <PageContainer title="รีวิวที่ถูกรายงาน">
      <Table
        rowKey="id"
        dataSource={rows}
        locale={{ emptyText: 'ไม่มีรีวิวที่ถูกรายงาน' }}
        columns={[
          { title: 'ร้าน', dataIndex: 'barId', render: (id: string) => getBar(id)?.name },
          { title: 'ผู้รีวิว', dataIndex: 'userName' },
          { title: 'คะแนน', dataIndex: 'rating' },
          { title: 'ความเห็น', dataIndex: 'comment' },
          {
            title: '',
            key: 'a',
            render: (_, r) => (
              <Space>
                <Button size="small" onClick={() => setReviewReported(r.id, false)}>
                  เก็บไว้
                </Button>
                <Popconfirm
                  title="ลบรีวิวนี้?"
                  okText="ลบ"
                  cancelText="ยกเลิก"
                  onConfirm={() => deleteReview(r.id, ADMIN)}
                >
                  <Button size="small" danger>
                    ลบ
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}

export function BillingPage() {
  useDemo();
  const rows = billingEvents();
  return (
    <PageContainer
      title="ค่าคอม"
      content={`Commission rule เดโม: 10% ของยอดประเมิน · NO_SHOW = WAIVED · รวม ${baht(rows.reduce((s, r) => s + r.amount, 0))}`}
    >
      <Table
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: 'ร้าน', dataIndex: 'barName' },
          { title: 'รหัสจอง', dataIndex: 'bookingCode' },
          {
            title: 'Event',
            dataIndex: 'type',
            render: (t: string) => <Tag color={t === 'CHECK_IN' ? 'green' : 'default'}>{t}</Tag>,
          },
          { title: 'ยอดฐาน', dataIndex: 'baseAmount', render: (v: number) => baht(v) },
          { title: 'ค่าคอม', dataIndex: 'amount', render: (v: number) => baht(v) },
          { title: 'สถานะ', dataIndex: 'status' },
          { title: 'เวลา', dataIndex: 'at', render: (v: string) => dateTime(v) },
        ]}
      />
    </PageContainer>
  );
}

export function AuditLogsPage() {
  useDemo();
  return (
    <PageContainer title="Audit Log">
      <Table
        rowKey="id"
        dataSource={getState().audit}
        columns={[
          { title: 'เวลา', dataIndex: 'at', render: (v: string) => dateTime(v) },
          { title: 'ผู้ทำ', dataIndex: 'actor' },
          { title: 'Action', dataIndex: 'action', render: (a: string) => <Tag>{a}</Tag> },
          { title: 'เป้าหมาย', dataIndex: 'target' },
        ]}
      />
    </PageContainer>
  );
}

export function SettingsPage() {
  return (
    <PageContainer title="ตั้งค่าระบบ">
      <Card title="Styles (master)">
        <Space wrap>
          {STYLES.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </Space>
      </Card>
    </PageContainer>
  );
}
