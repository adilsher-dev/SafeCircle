import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Calendar, ShieldCheck, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge, PageLoader } from '@/components/ui/Feedback';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/api';
import { profileSchema, type ProfileFormValues } from '@/utils/schemas';
import { extractErrorMessage } from '@/api/client';
import { initials, formatDate } from '@/utils/format';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          profileImageUrl: user.profileImageUrl,
        }
      : undefined,
  });

  if (!user) return <PageLoader />;

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await userApi.updateProfile(values);
      if (!res.success) {
        toast.error(res.message || 'Could not update profile');
        return;
      }
      toast.success('Profile updated');
      await refreshUser();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit text-center">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-ai mx-auto flex items-center justify-center text-2xl font-bold text-slate-950 shadow-lg shadow-primary/30">
          {initials(user.fullName)}
        </div>
        <h3 className="text-lg font-bold mt-4">{user.fullName}</h3>
        <p className="text-sm text-muted">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Badge className={user.isVerified ? 'bg-safe/15 text-safe border-safe/30' : 'bg-warning/15 text-warning border-warning/30'}>
            <BadgeCheck className="h-3 w-3" /> {user.isVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge className="border-border text-muted">{user.role}</Badge>
        </div>
        <div className="mt-6 pt-6 border-t border-border/60 text-left space-y-2 text-xs text-muted">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Member since {formatDate(user.createdAt, 'MMM yyyy')}
          </p>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Edit Profile" subtitle="Keep your information up to date" icon={<User className="h-5 w-5" />} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full name" icon={<User className="h-4 w-4" />} error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Phone number" icon={<Phone className="h-4 w-4" />} error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          </div>
          <Input label="Email" icon={<Mail className="h-4 w-4" />} value={user.email} disabled />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Gender" error={errors.gender?.message} {...register('gender')}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
            <Input label="Date of birth" type="date" icon={<Calendar className="h-4 w-4" />} error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
          </div>
          <Input label="Profile image URL" placeholder="https://…" error={errors.profileImageUrl?.message} {...register('profileImageUrl')} />

          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
