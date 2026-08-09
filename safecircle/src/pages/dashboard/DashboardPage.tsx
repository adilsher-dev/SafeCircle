import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Route,
  ShieldCheck,
  Bell,
  AlertTriangle,
  Users,
  Brain,
  MapPin,
  Clock,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader, EmptyState } from '@/components/ui/Feedback';
import { StatCard } from '@/components/dashboard/StatCard';
import { SafetyScoreGauge } from '@/components/dashboard/SafetyScoreGauge';
import { JourneyStatusBadge, AlertStatusBadge } from '@/components/dashboard/StatusBadges';
import { DarkMap } from '@/components/map/DarkMap';
import { useFetchOnMount } from '@/hooks/useAsync';
import { dashboardApi, journeyApi, alertApi, notificationApi } from '@/api';
import { formatDate, formatRelative, formatDistance } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: dashboard, loading: dashboardLoading } = useFetchOnMount(() => dashboardApi.getDashboard(), []);
  const { data: journeysRes, loading: journeysLoading } = useFetchOnMount(() => journeyApi.getMyJourneys(), []);
  const { data: alertsRes } = useFetchOnMount(() => alertApi.getMyAlerts(), []);
  const { data: notificationsRes } = useFetchOnMount(() => notificationApi.getMyNotifications(), []);

  const journeys = journeysRes?.data ?? [];
  const alerts = alertsRes?.data ?? [];
  const notifications = notificationsRes?.data ?? [];

  const activeJourney = useMemo(
    () => journeys.find((j) => j.status === 'STARTED' || j.status === 'IN_PROGRESS'),
    [journeys]
  );

  const recentJourneys = useMemo(() => journeys.slice(0, 5), [journeys]);
  const recentAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);
  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  const safetyScore = useMemo(() => {
    if (!dashboard) return 75;
    const totalRiskEvents =
      dashboard.lowRiskCount + dashboard.mediumRiskCount + dashboard.highRiskCount + dashboard.criticalRiskCount;
    if (totalRiskEvents === 0) return 85;
    const weighted =
      dashboard.lowRiskCount * 100 +
      dashboard.mediumRiskCount * 65 +
      dashboard.highRiskCount * 30 +
      dashboard.criticalRiskCount * 5;
    return Math.round(weighted / totalRiskEvents);
  }, [dashboard]);

  const aiRecommendation = useMemo(() => {
    if (!dashboard) return null;
    if (dashboard.criticalRiskCount > 0)
      return {
        text: 'Critical risk events detected recently. Avoid travelling alone at night and keep live tracking enabled at all times.',
      };
    if (dashboard.highRiskCount > 0)
      return {
        text: 'Some journeys were flagged high-risk. Consider sharing your route with a trusted contact before you leave.',
      };
    if (activeJourney)
      return {
        text: `Your journey to ${activeJourney.destination} looks safe so far. Stay on the suggested route for optimal safety.`,
      };
    return {
      text: "No active risk signals. You're all set — start a journey whenever you're ready to head out.",
    };
  }, [dashboard, activeJourney]);

  if (dashboardLoading && journeysLoading) return <PageLoader label="Loading your safety dashboard…" />;

  return (
    <div className="space-y-6">
      {/* Welcome + quick action */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] ?? 'there'} 👋</h2>
          <p className="text-sm text-muted mt-1">Here's what's happening across your safety network today.</p>
        </div>
        <Button onClick={() => navigate('/journey/start')} size="lg">
          <Route className="h-4 w-4" /> Start New Journey
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Journeys"
          value={dashboard?.totalJourneys ?? 0}
          icon={<Route className="h-5 w-5" />}
          accent="primary"
          trend={`${dashboard?.activeJourneys ?? 0} active now`}
        />
        <StatCard
          label="Trusted Contacts"
          value={dashboard?.totalTrustedContacts ?? 0}
          icon={<Users className="h-5 w-5" />}
          accent="ai"
          delay={0.05}
        />
        <StatCard
          label="Total Alerts"
          value={dashboard?.totalAlerts ?? 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="warning"
          delay={0.1}
        />
        <StatCard
          label="Unread Notifications"
          value={dashboard?.unreadNotifications ?? 0}
          icon={<Bell className="h-5 w-5" />}
          accent="danger"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map / Active Journey */}
        <Card className="lg:col-span-2" noPadding>
          <div className="p-5 md:p-6 pb-0">
            <CardHeader
              title={activeJourney ? 'Active Journey — Live Map' : 'Live Map'}
              subtitle={activeJourney ? `${activeJourney.source} → ${activeJourney.destination}` : 'No active journey right now'}
              icon={<Navigation className="h-5 w-5" />}
              action={
                activeJourney && (
                  <Button size="sm" variant="outline" onClick={() => navigate('/tracking')}>
                    View Tracking
                  </Button>
                )
              }
            />
          </div>
          <div className="h-80 px-5 md:px-6 pb-5 md:pb-6">
            <DarkMap
              className="h-full w-full"
              center={
                activeJourney?.sourceLatitude && activeJourney?.sourceLongitude
                  ? [activeJourney.sourceLatitude, activeJourney.sourceLongitude]
                  : [28.6139, 77.209]
              }
              zoom={activeJourney ? 13 : 11}
              markers={
                activeJourney?.sourceLatitude && activeJourney?.sourceLongitude
                  ? [
                      { id: 'src', position: [activeJourney.sourceLatitude, activeJourney.sourceLongitude], type: 'current', popup: activeJourney.source },
                      ...(activeJourney.destinationLatitude && activeJourney.destinationLongitude
                        ? [{ id: 'dest', position: [activeJourney.destinationLatitude, activeJourney.destinationLongitude] as [number, number], type: 'destination' as const, popup: activeJourney.destination }]
                        : []),
                    ]
                  : []
              }
              routePositions={
                activeJourney?.sourceLatitude && activeJourney?.sourceLongitude && activeJourney?.destinationLatitude && activeJourney?.destinationLongitude
                  ? [
                      [activeJourney.sourceLatitude, activeJourney.sourceLongitude],
                      [activeJourney.destinationLatitude, activeJourney.destinationLongitude],
                    ]
                  : undefined
              }
            />
          </div>
        </Card>

        {/* Safety Score */}
        <Card>
          <CardHeader title="Safety Score" icon={<ShieldCheck className="h-5 w-5" />} />
          <SafetyScoreGauge score={safetyScore} />
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="glass rounded-xl p-2.5 text-center">
              <p className="text-safe font-semibold">{dashboard?.lowRiskCount ?? 0}</p>
              <p className="text-muted mt-0.5">Low Risk</p>
            </div>
            <div className="glass rounded-xl p-2.5 text-center">
              <p className="text-warning font-semibold">{dashboard?.mediumRiskCount ?? 0}</p>
              <p className="text-muted mt-0.5">Medium</p>
            </div>
            <div className="glass rounded-xl p-2.5 text-center">
              <p className="text-danger font-semibold">{dashboard?.highRiskCount ?? 0}</p>
              <p className="text-muted mt-0.5">High</p>
            </div>
            <div className="glass rounded-xl p-2.5 text-center">
              <p className="text-danger font-semibold">{dashboard?.criticalRiskCount ?? 0}</p>
              <p className="text-muted mt-0.5">Critical</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendation */}
        <Card className="lg:col-span-1 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-ai/20 blur-3xl" />
          <CardHeader title="AI Recommendation" icon={<Brain className="h-5 w-5" />} />
          {aiRecommendation && (
            <div className="relative">
              <p className="text-sm text-text/90 leading-relaxed">{aiRecommendation.text}</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => navigate('/ai-risk')}>
                Run Risk Analysis <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader
            title="Recent Alerts"
            icon={<AlertTriangle className="h-5 w-5" />}
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate('/alerts')}>
                View all
              </Button>
            }
          />
          {recentAlerts.length === 0 ? (
            <EmptyState title="No alerts" description="You haven't triggered any alerts." />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-border/60">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.alertType}</p>
                    <p className="text-xs text-muted">{formatRelative(a.triggeredAt)}</p>
                  </div>
                  <AlertStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Notification Feed */}
        <Card>
          <CardHeader
            title="Notifications"
            icon={<Bell className="h-5 w-5" />}
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate('/notifications')}>
                View all
              </Button>
            }
          />
          {recentNotifications.length === 0 ? (
            <EmptyState title="All caught up" description="No notifications yet." />
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-border/60">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-muted' : 'bg-primary'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted line-clamp-1">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Journey Timeline / Recent Activities */}
      <Card>
        <CardHeader
          title="Journey Timeline"
          subtitle="Your most recent journeys"
          icon={<Clock className="h-5 w-5" />}
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate('/journey/history')}>
              View all
            </Button>
          }
        />
        {recentJourneys.length === 0 ? (
          <EmptyState
            icon={<MapPin className="h-6 w-6" />}
            title="No journeys yet"
            description="Start your first journey to see your timeline here."
            action={
              <Button size="sm" onClick={() => navigate('/journey/start')}>
                Start Journey
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {recentJourneys.map((j, idx) => (
              <div key={j.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {idx !== recentJourneys.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-medium">
                      {j.source} <span className="text-muted">→</span> {j.destination}
                    </p>
                    <JourneyStatusBadge status={j.status} />
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {formatDate(j.startTime)} · {formatDistance(j.distance)} · {j.transportMode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
