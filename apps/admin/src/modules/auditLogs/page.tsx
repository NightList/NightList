import { PageContainer } from '@ant-design/pro-components';
import { getState } from '@nightlist/mock';
import { Table, Tag } from 'antd';
import { dateTime } from '@/ui/utils/format';
import { useDemo } from '@/hooks/useDemo';

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
