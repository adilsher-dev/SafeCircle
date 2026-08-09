import { AlertTriangle, Trash2, CheckCircle2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader, EmptyState } from '@/components/ui/Feedback';
import { AlertStatusBadge } from '@/components/dashboard/StatusBadges';
import { useFetchOnMount } from '@/hooks/useAsync';
import { alertApi } from '@/api';
import { extractErrorMessage } from '@/api/client';
import { formatDate } from '@/utils/format';

export default function AlertsPage() {
  const { data: res, loading, refetch } = useFetchOnMount(() => alertApi.getMyAlerts(), []);
  const alerts = res?.data ?? [];

  const handleResolve = async (id: number) => {
    try {
      await alertApi.resolveAlert(id);
      toast.success('Alert resolved');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await alertApi.deleteAlert(id);
      toast.success('Alert deleted');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading alerts…" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Alerts</h2>
        <p className="text-sm text-muted mt-1">All safety alerts triggered across your journeys.</p>
      </div>

      <Card>
        {alerts.length === 0 ? (
          <EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="No alerts" description="You haven't triggered any alerts yet." />
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-border/60 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{a.alertType} {a.message ? `— ${a.message}` : ''}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {a.address ?? `${a.latitude.toFixed(4)}, ${a.longitude.toFixed(4)}`} · {formatDate(a.triggeredAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <AlertStatusBadge status={a.status} />
                  {a.status === 'ACTIVE' && (
                    <Button size="sm" variant="safe" onClick={() => handleResolve(a.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
