import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/api';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/utils/schemas';
import { extractErrorMessage } from '@/api/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: emailFromState },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const res = await authApi.resetPassword(values);
      toast.success(res.message || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">Reset your password</h1>
        <p className="text-sm text-muted">Enter the OTP sent to your email and choose a new password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="OTP"
          icon={<KeyRound className="h-4 w-4" />}
          placeholder="6-digit code"
          error={errors.otp?.message}
          {...register('otp')}
        />
        <Input
          label="New password"
          type="password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
          Reset Password <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
