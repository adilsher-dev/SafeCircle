import { Users, UserCheck, UserX, Route, AlertTriangle, Brain, Crown } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Feedback';
import { StatCard } from '@/components/dashboard/StatCard';
import { useFetchOnMount } from '@/hooks/useAsync';
import { adminApi } from '@/api';

export default function AdminDashboardPage() {
  const { data: res, loading } = useFetchOnMount(() => adminApi.getDashboard(), []);
  const d = res?.data;

  if (loading) return <PageLoader label="Loading admin overview…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-ai/15 border border-ai/30 flex items-center justify-center text-ai">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-sm text-muted mt-1">Platform-wide statistics for SafeCircle.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={d?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} accent="primary" />
        <StatCard label="Active Users" value={d?.activeUsers ?? 0} icon={<UserCheck className="h-5 w-5" />} accent="safe" />
        <StatCard label="Inactive Users" value={d?.inactiveUsers ?? 0} icon={<UserX className="h-5 w-5" />} accent="warning" />
        <StatCard label="Total Journeys" value={d?.totalJourneys ?? 0} icon={<Route className="h-5 w-5" />} accent="primary" />
        <StatCard label="Total Alerts" value={d?.totalAlerts ?? 0} icon={<AlertTriangle className="h-5 w-5" />} accent="danger" />
        <StatCard label="Risk Assessments" value={d?.totalRiskAssessments ?? 0} icon={<Brain className="h-5 w-5" />} accent="ai" />
      </div>

      <Card>
        <CardHeader title="Platform Health" icon={<Crown className="h-5 w-5" />} />
        <p className="text-sm text-muted leading-relaxed">
          {d && d.totalUsers > 0
            ? `${Math.round((d.activeUsers / d.totalUsers) * 100)}% of registered users are currently active. Manage accounts from the Users tab.`
            : 'No user data available yet.'}
        </p>
      </Card>
    </div>
  );
}
