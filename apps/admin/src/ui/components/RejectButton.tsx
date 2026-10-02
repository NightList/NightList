import { Button, Input, Popconfirm } from 'antd';
import { useState } from 'react';

/** ปุ่มปฏิเสธที่ต้องใส่เหตุผล (ส่งต่อให้ผู้ใช้/ร้านเห็น และลง audit log) */
export function RejectButton({
  label,
  title,
  loading,
  onReject,
}: {
  label: string;
  title: string;
  loading?: boolean;
  onReject: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <Popconfirm
      title={title}
      description={
        <Input.TextArea
          className="!mt-2 !w-64"
          rows={2}
          maxLength={500}
          placeholder="เหตุผล (ผู้เกี่ยวข้องจะเห็นข้อความนี้)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      }
      okText={label}
      cancelText="ยกเลิก"
      okButtonProps={{ danger: true, disabled: !reason.trim() }}
      onConfirm={() => {
        onReject(reason.trim());
        setReason('');
      }}
    >
      <Button danger loading={loading}>
        {label}
      </Button>
    </Popconfirm>
  );
}
