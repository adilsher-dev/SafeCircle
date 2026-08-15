import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Phone, Heart, Car, Siren, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Feedback';
import { PageLoader, EmptyState } from '@/components/ui/Feedback';
import { AlertStatusBadge } from '@/components/dashboard/StatusBadges';
import { DarkMap } from '@/components/map/DarkMap';
import { useFetchOnMount } from '@/hooks/useAsync';
import { emergencyApi, journeyApi } from '@/api';
import { extractErrorMessage } from '@/api/client';
import { formatDate } from '@/utils/format';
import type { AlertMessage, AlertType } from '@/types';
import { socketService, wsTopics } from '@/services/socketService';

const sosTypes: Array<{ type: AlertType; label: string; icon: React.ReactNode }> = [
  { type: 'SOS', label: 'General SOS', icon: <ShieldAlert className="h-5 w-5" /> },
  { type: 'PANIC', label: 'Panic', icon: <Siren className="h-5 w-5" /> },
  { type: 'MEDICAL', label: 'Medical', icon: <Heart className="h-5 w-5" /> },
  { type: 'ACCIDENT', label: 'Accident', icon: <Car className="h-5 w-5" /> },
];

export default function SosCenterPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AlertType>('SOS');
  const [triggering, setTriggering] = useState(false);
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const { data: alertsRes, loading, refetch } = useFetchOnMount(() => emergencyApi.getMyAlerts(), []);
  const { data: journeysRes } = useFetchOnMount(() => journeyApi.getMyJourneys(), []);
  const alerts = alertsRes?.data ?? [];
  const journeys = journeysRes?.data ?? [];

  const activeJourney = journeys.find((j) => j.status === 'STARTED' || j.status === 'IN_PROGRESS');
  const activeSOS = useMemo(() => alerts.find((a) => a.status === 'ACTIVE'), [alerts]);

  // Listen for automatic SOS events from the backend. This updates the SOS
  // center immediately; the browser page itself is never reloaded.
  useEffect(() => {
    if (!activeJourney?.id) return;

    const unsubscribe = socketService.subscribe<AlertMessage>(
      wsTopics.alert(activeJourney.id),
      (message) => {
        if (message.status !== 'ACTIVE') return;

        setCoords([message.latitude, message.longitude]);
        toast.error('Automatic SOS triggered — SafeCircle detected a dangerous situation.');
        refetch();
      }
    );

    return unsubscribe;
  }, [activeJourney?.id, refetch]);

  const getLocation = () =>
    new Promise<[number, number]>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation unavailable'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
        () => reject(new Error('Could not access your location'))
      );
    });

  const handleTrigger = async () => {
    if (!activeJourney) {
      toast.error('You need an active journey to trigger SOS');
      return;
    }
    setTriggering(true);
    try {
      const [lat, lng] = await getLocation();
      setCoords([lat, lng]);
      const res = await emergencyApi.triggerSOS({
        journeyId: activeJourney.id,
        alertType: selectedType,
        latitude: lat,
        longitude: lng,
        sirenActivated: true,
      });
      if (!res.success) {
        toast.error(res.message || 'Could not trigger SOS');
        return;
      }
      toast.success('SOS triggered — your trusted contacts are being notified');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setTriggering(false);
    }
  };

  const handleCancel = async (alertId: number) => {
    try {
      await emergencyApi.cancelSOS(alertId);
      toast.success('SOS cancelled');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading SOS center…" />;

  return (
    <div className="space-y-6">
      {activeSOS && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-5 border-danger/40 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-danger/20 border border-danger/40 flex items-center justify-center text-danger animate-pulse">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-danger">SOS Active — {activeSOS.alertType}</p>
              <p className="text-xs text-muted">Triggered {formatDate(activeSOS.triggeredAt)}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleCancel(activeSOS.id)}>
            <X className="h-4 w-4" /> Cancel SOS
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 flex flex-col items-center justify-center text-center py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-danger/10 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-sm text-muted mb-6 max-w-xs">
              Press and confirm to instantly alert your trusted contacts with your live location.
            </p>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setConfirmOpen(true)}
              disabled={!activeJourney}
              className="relative h-40 w-40 rounded-full bg-gradient-to-br from-danger to-red-700 shadow-2xl shadow-danger/40 flex items-center justify-center text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 rounded-full bg-danger/40 animate-marker-ping" />
              <span className="relative flex flex-col items-center gap-1">
                <ShieldAlert className="h-9 w-9" />
                SOS
              </span>
            </motion.button>
            {!activeJourney && <p className="text-xs text-warning mt-6">Start a journey to enable SOS triggering.</p>}
          </div>
        </Card>

        <Card className="lg:col-span-3" noPadding>
          <div className="p-5 md:p-6 pb-0">
            <CardHeader title="Emergency Location" icon={<MapPin className="h-5 w-5" />} />
          </div>
          <div className="h-72 px-5 md:px-6 pb-5 md:pb-6">
            <DarkMap
              className="h-full w-full"
              center={coords ?? [28.6139, 77.209]}
              zoom={coords ? 15 : 4}
              markers={coords ? [{ id: 'sos', position: coords, type: 'sos', popup: 'Your last known location' }] : []}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Emergency Contact" icon={<Phone className="h-5 w-5" />} subtitle="Reach local emergency services directly" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Police', number: '100' },
            { label: 'Ambulance', number: '102' },
            { label: 'Women Helpline', number: '1091' },
            { label: 'Fire', number: '101' },
          ].map((c) => (
            <a
              key={c.label}
              href={`tel:${c.number}`}
              className="glass rounded-2xl p-4 text-center hover:border-danger/30 transition-colors"
            >
              <p className="text-lg font-bold">{c.number}</p>
              <p className="text-xs text-muted mt-1">{c.label}</p>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="SOS History" icon={<ShieldAlert className="h-5 w-5" />} />
        {alerts.length === 0 ? (
          <EmptyState title="No SOS alerts" description="Your triggered SOS alerts will appear here." />
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-border/60">
                <div>
                  <p className="text-sm font-medium">{a.alertType}</p>
                  <p className="text-xs text-muted">{formatDate(a.triggeredAt)}</p>
                </div>
                <AlertStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Emergency Alert" maxWidth="max-w-lg">
        <p className="text-sm text-muted mb-5">Choose the type of emergency. This will immediately notify your trusted contacts with your live location.</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {sosTypes.map((t) => (
            <button
              key={t.type}
              onClick={() => setSelectedType(t.type)}
              className={`flex items-center gap-2 p-3 rounded-2xl border text-sm transition-colors ${
                selectedType === t.type ? 'bg-danger/15 border-danger/40 text-danger' : 'border-border text-muted hover:text-text'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth loading={triggering} onClick={handleTrigger}>
            Confirm & Trigger SOS
          </Button>
        </div>
      </Modal>
    </div>
  );
}
