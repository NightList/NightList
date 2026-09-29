import { PageContainer } from '@ant-design/pro-components';
import { STYLES } from '@nightlist/mock';
import { Card, Space, Tag } from 'antd';

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
