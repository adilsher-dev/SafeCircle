import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, MapPin, Trash2, Radio, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader, EmptyState } from '@/components/ui/Feedback';
import { JourneyStatusBadge, RiskBadge } from '@/components/dashboard/StatusBadges';
import { useFetchOnMount } from '@/hooks/useAsync';
import { journeyApi } from '@/api';
import { formatDate, formatDistance } from '@/utils/format';
import { extractErrorMessage } from '@/api/client';
import type { JourneyStatus } from '@/types';

const filters: Array<{ label: string; value: JourneyStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function JourneyHistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<JourneyStatus | 'ALL'>('ALL');
  const { data: res, loading, refetch } = useFetchOnMount(() => journeyApi.getMyJourneys(), []);
  const journeys = res?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === 'ALL') return journeys;
    return journeys.filter((j) => j.status === filter);
  }, [journeys, filter]);

  const handleEnd = async (id: number) => {
    try {
      await journeyApi.endJourney(id);
      toast.success('Journey marked as completed');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await journeyApi.deleteJourney(id);
      toast.success('Journey deleted');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading journey history…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Journey History</h2>
          <p className="text-sm text-muted mt-1">Every trip you've taken with SafeCircle, in one place.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === f.value ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted border-border hover:text-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<History className="h-6 w-6" />}
            title="No journeys found"
            description="Journeys you start will show up here with full route and risk history."
            action={
              <Button size="sm" onClick={() => navigate('/journey/start')}>
                Start a journey
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((j) => (
            <Card key={j.id} hover className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{j.source}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold mt-1">
                    <MapPin className="h-4 w-4 text-ai shrink-0" />
                    <span className="truncate">{j.destination}</span>
                  </div>
                </div>
                <JourneyStatusBadge status={j.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="glass rounded-xl p-2.5">
                  <p className="text-muted">Started</p>
                  <p className="font-medium mt-0.5">{formatDate(j.startTime, 'MMM d, h:mm a')}</p>
                </div>
                <div className="glass rounded-xl p-2.5">
                  <p className="text-muted">Distance</p>
                  <p className="font-medium mt-0.5">{formatDistance(j.distance)}</p>
                </div>
                <div className="glass rounded-xl p-2.5">
                  <p className="text-muted">Mode</p>
                  <p className="font-medium mt-0.5">{j.transportMode}</p>
                </div>
                <div className="glass rounded-xl p-2.5 flex items-center justify-between">
                  <p className="text-muted">Risk</p>
                  <RiskBadge level={j.aiRiskPrediction} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {(j.status === 'STARTED' || j.status === 'IN_PROGRESS') && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => navigate('/tracking', { state: { journeyId: j.id } })}>
                      <Radio className="h-3.5 w-3.5" /> Track Live
                    </Button>
                    <Button size="sm" variant="safe" onClick={() => handleEnd(j.id)}>
                      End Journey
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="ml-auto" onClick={() => handleDelete(j.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-danger" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/journey/history')}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
