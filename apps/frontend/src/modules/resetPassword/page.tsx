import { useNavigate } from 'react-router';
import { AuthCard } from '@/ui/components/authCard';
import { NewPasswordForm } from '@/ui/components/newPasswordForm';

/** /reset-password */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  return (
    <AuthCard title="ตั้งรหัสผ่านใหม่">
      <NewPasswordForm onDone={() => navigate('/login')} />
    </AuthCard>
  );
}
