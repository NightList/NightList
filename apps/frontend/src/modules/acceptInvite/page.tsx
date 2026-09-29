import { useNavigate } from 'react-router';
import { AuthCard } from '@/ui/components/authCard';
import { NewPasswordForm } from '@/ui/components/newPasswordForm';

/** /accept-invite — Staff ตั้งรหัสจากลิงก์เชิญ */
export function AcceptInvitePage() {
  const navigate = useNavigate();
  return (
    <AuthCard title="ยินดีต้อนรับทีมงาน" subtitle="ตั้งรหัสผ่านเพื่อเข้าใช้หน้าร้าน">
      <NewPasswordForm onDone={() => navigate('/merchant/tonight')} />
    </AuthCard>
  );
}
