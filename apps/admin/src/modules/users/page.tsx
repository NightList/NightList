import { PageContainer } from '@ant-design/pro-components';
import type { Db } from '@nightlist/types';
import { App, Input, Select, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { PAGE_SIZE } from '@/configs/constants';
import { useAdminAuth } from '@/services/adminAuth';
import { useAdminAction, useAdminView } from '@/services/adminData';
import { LoadError } from '@/ui/components/LoadError';
import { dateTime } from '@/ui/utils/format';
import { STAFF_ROLE, USER_ROLE } from '@/ui/utils/labels';

type Role = Db.Enums<'user_role'>;
const ROLE_OPTIONS = (Object.keys(USER_ROLE) as Role[]).map((r) => ({ value: r, label: USER_ROLE[r].text }));

/**
 * ผู้ใช้ทั้งหมด — เปลี่ยนสิทธิ์ได้ (ลงบันทึก audit)
 * ผูกบัญชีกับร้าน (เจ้าของ / ผู้จัดการ / พนักงาน) ใช้สคริปต์ user:create ดู docs/SUPABASE.md
 */
export function UsersPage() {
  const { modal } = App.useApp();
  const auth = useAdminAuth();
  const [q, setQ] = useState('');
  const { data, isLoading, error, refetch } = useAdminView('admin_users', {
    order: { column: 'created_at', ascending: false },
  });
  const act = useAdminAction();
  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return (data ?? []).filter(
      (u) => !k || u.email.toLowerCase().includes(k) || u.display_name.toLowerCase().includes(k),
    );
  }, [data, q]);

  const changeRole = (u: Db.AdminUser, role: Role) =>
    modal.confirm({
      title: `เปลี่ยนสิทธิ์ ${u.display_name}?`,
      content: `${USER_ROLE[u.role].text} → ${USER_ROLE[role].text}${role === 'ADMIN' ? ' (เข้าหลังบ้านได้ทั้งหมด)' : ''}`,
      okText: 'เปลี่ยนสิทธิ์',
      cancelText: 'ยกเลิก',
      onOk: () =>
        act.mutateAsync({
          method: 'PATCH',
          path: `users/${u.id}/role`,
          body: { role },
          success: `${u.display_name} เป็น${USER_ROLE[role].text}แล้ว`,
        }),
    });

  return (
    <PageContainer
      title="ผู้ใช้"
      extra={<Input.Search placeholder="ชื่อ / อีเมล" allowClear onSearch={setQ} className="w-64" />}
    >
      <LoadError error={error} onRetry={() => void refetch()} />
      <Table<Db.AdminUser>
        rowKey="id"
        loading={isLoading}
        dataSource={rows}
        pagination={{ pageSize: PAGE_SIZE }}
        scroll={{ x: 900 }}
        columns={[
          { title: 'ชื่อ', dataIndex: 'display_name' },
          { title: 'อีเมล', dataIndex: 'email' },
          {
            title: 'สิทธิ์',
            dataIndex: 'role',
            filters: ROLE_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
            onFilter: (v, u) => u.role === v,
            render: (role: Role, u) => (
              <Select<Role>
                size="small"
                className="w-36"
                value={role}
                options={ROLE_OPTIONS}
                disabled={u.id === auth.session?.user.id || !!u.deleted_at}
                aria-label={`สิทธิ์ของ ${u.display_name}`}
                onChange={(next) => changeRole(u, next)}
              />
            ),
          },
          {
            title: 'ร้าน',
            key: 'bars',
            render: (_, u) =>
              u.bars.length ? (
                <Space size={[4, 4]} wrap>
                  {u.bars.map((b) => (
                    <Tag key={b.id}>
                      {b.name} · {STAFF_ROLE[b.role]}
                    </Tag>
                  ))}
                </Space>
              ) : (
                '-'
              ),
          },
          {
            title: 'สมัครเมื่อ',
            dataIndex: 'created_at',
            render: (v: string, u) => (u.deleted_at ? <Tag>ลบบัญชีแล้ว</Tag> : dateTime(v)),
          },
        ]}
      />
    </PageContainer>
  );
}
