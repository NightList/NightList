import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageContainer title={title}>
      <Empty description="กำลังพัฒนา" />
    </PageContainer>
  );
}
