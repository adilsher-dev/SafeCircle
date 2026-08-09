import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radio, Gauge, Clock, TrendingUp, ShieldAlert, MapPin, Battery } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { PageLoader, EmptyState } from '@/components/ui/Feedback';
import { DarkMap } from '@/components/map/DarkMap';
import { RiskBadge } from '@/components/dashboard/StatusBadges';
import { journeyApi, liveTrackingApi, locationApi } from '@/api';
import { socketService, wsTopics, wsDestinations } from '@/services/socketService';
import { useFetchOnMount } from '@/hooks/useAsync';
import { formatDistance, formatDuration, formatSpeed } from '@/utils/format';
import type { JourneyProgressResponse, LiveLocationMessage } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function LiveTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initialJourneyId = (location.state as { journeyId?: number })?.journeyId;

  const [journeyId, setJourneyId] = useState<number | undefined>(initialJourneyId);
  const [progress, setProgress] = useState<JourneyProgressResponse | null>(null);
  const [liveCoords, setLiveCoords] = useState<[number, number] | null>(null);
  const [sharing, setSharing] = useState(false);

  const { data: journeysRes, loading: journeysLoading } = useFetchOnMount(() => journeyApi.getMyJourneys(), []);
  const journeys = journeysRes?.data ?? [];
  const activeJourneys = useMemo(
    () => journeys.filter((j) => j.status === 'STARTED' || j.status === 'IN_PROGRESS'),
    [journeys]
  );

  useEffect(() => {
    if (!journeyId && activeJourneys.length > 0) {
      setJourneyId(activeJourneys[0].id);
    }
  }, [activeJourneys, journeyId]);

  const currentJourney = journeys.find((j) => j.id === journeyId);

  // Poll journey progress
  useEffect(() => {
    if (!journeyId) return;
    let cancelled = false;

    const fetchProgress = async () => {
      try {
        const res = await liveTrackingApi.getJourneyProgress(journeyId);
        if (!cancelled) setProgress(res.data);
      } catch {
        // journey may not have progress data yet
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [journeyId]);

  // Subscribe to live location broadcast for this journey
  useEffect(() => {
    if (!journeyId) return;
    const unsubscribe = socketService.subscribe<LiveLocationMessage>(wsTopics.liveLocation(journeyId), (msg) => {
      setLiveCoords([msg.latitude, msg.longitude]);
    });
    return unsubscribe;
  }, [journeyId]);

  // Share device location: send to backend + publish over websocket
  useEffect(() => {
    if (!sharing || !journeyId || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed, accuracy } = pos.coords;
        setLiveCoords([latitude, longitude]);

        socketService.publish(wsDestinations.sendLocation, {
          journeyId,
          userId: user?.id,
          latitude,
          longitude,
          speed: speed ?? 0,
          accuracy: accuracy ?? 0,
          timestamp: new Date().toISOString(),
        });

        try {
          await locationApi.updateLocation({
            journeyId,
            latitude,
            longitude,
            accuracy: accuracy ?? undefined,
            speed: speed ?? undefined,
            recordedAt: new Date().toISOString(),
          });
        } catch {
          // best-effort background sync
        }
      },
      () => toast.error('Unable to access your live location'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sharing, journeyId, user?.id]);

  if (journeysLoading) return <PageLoader label="Loading journeys…" />;

  if (activeJourneys.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Radio className="h-6 w-6" />}
          title="No active journey to track"
          description="Start a journey to enable live tracking and share your route in real time."
          action={
            <Button size="sm" onClick={() => navigate('/journey/start')}>
              Start Journey
            </Button>
          }
        />
      </Card>
    );
  }

  const mapCenter: [number, number] =
    liveCoords ??
    (currentJourney?.sourceLatitude && currentJourney?.sourceLongitude
      ? [currentJourney.sourceLatitude, currentJourney.sourceLongitude]
      : [28.6139, 77.209]);

  const markers = [
    ...(mapCenter ? [{ id: 'live', position: mapCenter, type: 'current' as const, popup: 'You are here' }] : []),
    ...(currentJourney?.destinationLatitude && currentJourney?.destinationLongitude
      ? [{ id: 'dest', position: [currentJourney.destinationLatitude, currentJourney.destinationLongitude] as [number, number], type: 'destination' as const, popup: currentJourney.destination }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-safe animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight">Live Tracking</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={journeyId} onChange={(e) => setJourneyId(Number(e.target.value))} className="w-56">
            {activeJourneys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.source} → {j.destination}
              </option>
            ))}
          </Select>
          <Button variant={sharing ? 'danger' : 'safe'} onClick={() => setSharing((s) => !s)}>
            <Radio className="h-4 w-4" /> {sharing ? 'Stop Sharing' : 'Share Live Location'}
          </Button>
          <Button variant="danger" onClick={() => navigate('/sos')}>
            <ShieldAlert className="h-4 w-4" /> SOS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" noPadding>
          <div className="h-[520px]">
            <DarkMap
              className="h-full w-full rounded-3xl"
              center={mapCenter}
              zoom={15}
              markers={markers}
              followMarker={liveCoords ?? undefined}
              routePositions={
                currentJourney?.sourceLatitude && currentJourney?.sourceLongitude && currentJourney?.destinationLatitude && currentJourney?.destinationLongitude
                  ? [
                      [currentJourney.sourceLatitude, currentJourney.sourceLongitude],
                      [currentJourney.destinationLatitude, currentJourney.destinationLongitude],
                    ]
                  : undefined
              }
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Journey Progress" icon={<TrendingUp className="h-5 w-5" />} />
            {progress ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1.5">
                    <span>Progress</span>
                    <span>{Math.round(progress.progressPercentage)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-ai rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, progress.progressPercentage)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="glass rounded-xl p-2.5">
                    <p className="text-muted flex items-center gap-1"><MapPin className="h-3 w-3" /> Travelled</p>
                    <p className="font-semibold mt-1">{formatDistance(progress.travelledDistance)}</p>
                  </div>
                  <div className="glass rounded-xl p-2.5">
                    <p className="text-muted flex items-center gap-1"><MapPin className="h-3 w-3" /> Remaining</p>
                    <p className="font-semibold mt-1">{formatDistance(progress.remainingDistance)}</p>
                  </div>
                  <div className="glass rounded-xl p-2.5">
                    <p className="text-muted flex items-center gap-1"><Gauge className="h-3 w-3" /> Avg Speed</p>
                    <p className="font-semibold mt-1">{formatSpeed(progress.averageSpeed)}</p>
                  </div>
                  <div className="glass rounded-xl p-2.5">
                    <p className="text-muted flex items-center gap-1"><Clock className="h-3 w-3" /> ETA</p>
                    <p className="font-semibold mt-1">{formatDuration(progress.estimatedArrivalSeconds)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between glass rounded-xl p-3">
                  <span className="text-xs text-muted">Current Risk</span>
                  <RiskBadge level={progress.currentRisk as never} />
                </div>
                {progress.sosTriggered && (
                  <div className="rounded-xl bg-danger/15 border border-danger/30 text-danger text-xs p-3 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" /> SOS has been triggered on this journey
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted">Waiting for the first location update…</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Device" icon={<Battery className="h-5 w-5" />} />
            <p className="text-sm text-muted">
              {sharing ? 'Your live location is currently being shared with trusted contacts monitoring this journey.' : 'Enable "Share Live Location" to start broadcasting your position.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
