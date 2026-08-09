import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Feedback';
import { StatCard } from '@/components/dashboard/StatCard';
import { useFetchOnMount } from '@/hooks/useAsync';
import { analyticsApi } from '@/api';

const tooltipStyle = {
  backgroundColor: '#13241E',
  border: '1px solid rgba(16,185,129,0.25)',
  borderRadius: '16px',
  fontSize: '13px',
  color: '#F8FAFC',
  boxShadow: '0 15px 35px rgba(0,0,0,0.45)',
};

export default function AnalyticsPage() {
  const { data: weekly, loading: l1 } = useFetchOnMount(() => analyticsApi.getWeeklyReport(), []);
  const { data: monthly, loading: l2 } = useFetchOnMount(() => analyticsApi.getMonthlyReport(), []);
  const { data: journeyTrend, loading: l3 } = useFetchOnMount(() => analyticsApi.getJourneyTrend(), []);
  const { data: riskTrend, loading: l4 } = useFetchOnMount(() => analyticsApi.getRiskTrend(), []);

  if (l1 || l2 || l3 || l4) return <PageLoader label="Crunching your safety analytics…" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted mt-1">Trends and reports across your journeys and risk exposure.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Weekly Safety Score" value={weekly?.safetyScore?.toFixed(0) ?? '—'} icon={<ShieldCheck className="h-5 w-5" />} accent="safe" />
        <StatCard label="Monthly Safety Score" value={monthly?.safetyScore?.toFixed(0) ?? '—'} icon={<TrendingUp className="h-5 w-5" />} accent="primary" />
        <StatCard label="Alerts (Month)" value={monthly?.alertsTriggered ?? 0} icon={<AlertTriangle className="h-5 w-5" />} accent="warning" />
        <StatCard label="High Risk Events" value={monthly?.highRiskEvents ?? 0} icon={<BarChart3 className="h-5 w-5" />} accent="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover
    className="border border-primary/10 hover:border-primary/30 transition-all duration-300">
          <CardHeader title="Weekly Report" icon={<ShieldCheck className="h-5 w-5" />} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <ReportStat label="Total Journeys" value={weekly?.totalJourneys} />
            <ReportStat label="Completed" value={weekly?.completedJourneys} />
            <ReportStat label="Cancelled" value={weekly?.cancelledJourneys} />
            <ReportStat label="Alerts Triggered" value={weekly?.alertsTriggered} />
          </div>
        </Card>
        <Card hover
    className="border border-primary/10 hover:border-primary/30 transition-all duration-300">
          <CardHeader title="Monthly Report" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <ReportStat label="Total Journeys" value={monthly?.totalJourneys} />
            <ReportStat label="Completed" value={monthly?.completedJourneys} />
            <ReportStat label="Cancelled" value={monthly?.cancelledJourneys} />
            <ReportStat label="Alerts Triggered" value={monthly?.alertsTriggered} />
          </div>
        </Card>
      </div>

      <Card hover
    className="border border-primary/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader title="Journey Trend" subtitle="Journeys taken per month" icon={<BarChart3 className="h-5 w-5" />} />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={journeyTrend ?? []}>
              <defs>
                <linearGradient id="journeyGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#10B981" stopOpacity={0.65}/>
    <stop offset="40%" stopColor="#14B8A6" stopOpacity={0.35}/>
    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0}/>
</linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
  type="monotone"
  dataKey="totalJourneys"
  stroke="#14B8A6"
  strokeWidth={3}
  fill="url(#journeyGradient)"
  name="Journeys"
  activeDot={{
    r: 7,
    fill: "#10B981",
    stroke: "#ffffff",
    strokeWidth: 2,
  }}
/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card hover
    className="border border-primary/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader title="Risk Trend" subtitle="Risk level distribution per month" icon={<AlertTriangle className="h-5 w-5" />} />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar
    dataKey="lowRisk"
    stackId="risk"
    fill="#10B981"
    radius={[0,0,8,8]}
/>

<Bar
    dataKey="mediumRisk"
    stackId="risk"
    fill="#F59E0B"
/>

<Bar
    dataKey="highRisk"
    stackId="risk"
    fill="#DC2626"
/>

<Bar
    dataKey="criticalRisk"
    stackId="risk"
    fill="#14B8A6"
    radius={[8,8,0,0]}
/>


            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="glass rounded-2xl p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold mt-1">{value ?? 0}</p>
    </div>
  );
}
