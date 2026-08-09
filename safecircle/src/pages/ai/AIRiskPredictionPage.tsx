import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Brain, MapPin, Battery, Moon, Users, MapPinned, Sparkles, LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Feedback';
import { RiskBadge } from '@/components/dashboard/StatusBadges';
import { useFetchOnMount } from '@/hooks/useAsync';
import { aiApi, journeyApi } from '@/api';
import { extractErrorMessage } from '@/api/client';
import type { RiskPredictionResponse } from '@/types';
import { formatDate } from '@/utils/format';

interface FormValues {
  journeyId: number;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  travellingAlone: boolean;
  nightTime: boolean;
  unfamiliarArea: boolean;
}

export default function AIRiskPredictionPage() {
  const [result, setResult] = useState<RiskPredictionResponse | null>(null);
  const [locating, setLocating] = useState(false);
  const { data: journeysRes } = useFetchOnMount(() => journeyApi.getMyJourneys(), []);
  const journeys = journeysRes?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { batteryLevel: 100, travellingAlone: false, nightTime: false, unfamiliarArea: false },
  });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitude', pos.coords.latitude);
        setValue('longitude', pos.coords.longitude);
        setLocating(false);
      },
      () => {
        toast.error('Could not get your location');
        setLocating(false);
      }
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await aiApi.predictRisk({
        journeyId: Number(values.journeyId),
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        batteryLevel: Number(values.batteryLevel),
        travellingAlone: values.travellingAlone,
        nightTime: values.nightTime,
        unfamiliarArea: values.unfamiliarArea,
      });
      if (!res.success) {
        toast.error(res.message || 'Prediction failed');
        return;
      }
      setResult(res.data);
      toast.success('Risk prediction generated');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2 h-fit">
        <CardHeader title="Run Risk Prediction" subtitle="AI-driven safety analysis for your journey" icon={<Brain className="h-5 w-5" />} />

        {journeys.length === 0 ? (
          <EmptyState title="No journeys available" description="Start a journey first to run a risk prediction against it." />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select label="Journey" error={errors.journeyId?.message} {...register('journeyId', { required: true, valueAsNumber: true })}>
              <option value="">Select a journey</option>
              {journeys.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.source} → {j.destination}
                </option>
              ))}
            </Select>

            <div className="flex items-end gap-2">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  icon={<MapPin className="h-4 w-4" />}
                  error={errors.latitude?.message}
                  {...register('latitude', { required: true, valueAsNumber: true })}
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  icon={<MapPin className="h-4 w-4" />}
                  error={errors.longitude?.message}
                  {...register('longitude', { required: true, valueAsNumber: true })}
                />
              </div>
              <Button type="button" variant="outline" size="icon" loading={locating} onClick={useCurrentLocation}>
                <LocateFixed className="h-4 w-4" />
              </Button>
            </div>

            <Input
              label="Battery level (%)"
              type="number"
              min={0}
              max={100}
              icon={<Battery className="h-4 w-4" />}
              {...register('batteryLevel', { valueAsNumber: true })}
            />

            <div className="space-y-2 pt-1">
              <Controller
                name="travellingAlone"
                control={control}
                render={({ field }) => <ToggleRow icon={<Users className="h-4 w-4" />} label="Travelling alone" checked={field.value} onChange={field.onChange} />}
              />
              <Controller
                name="nightTime"
                control={control}
                render={({ field }) => <ToggleRow icon={<Moon className="h-4 w-4" />} label="Night time" checked={field.value} onChange={field.onChange} />}
              />
              <Controller
                name="unfamiliarArea"
                control={control}
                render={({ field }) => <ToggleRow icon={<MapPinned className="h-4 w-4" />} label="Unfamiliar area" checked={field.value} onChange={field.onChange} />}
              />
            </div>

            <Button type="submit" fullWidth loading={isSubmitting}>
              <Sparkles className="h-4 w-4" /> Predict Risk
            </Button>
          </form>
        )}
      </Card>

      <div className="lg:col-span-3">
        {result ? (
          <Card className="h-full relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-ai/15 blur-3xl" />
            <CardHeader title="Prediction Result" icon={<Brain className="h-5 w-5" />} />
            <div className="relative space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-ai/20 to-primary/10 border border-ai/20 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{result.riskScore}</span>
                  <span className="text-[10px] text-muted">/ 100</span>
                </div>
                <div>
                  <RiskBadge level={result.riskLevel} />
                  <p className="text-xs text-muted mt-2">Generated {formatDate(result.createdAt)}</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-muted mb-1.5 font-medium">Reasoning</p>
                <p className="text-sm text-text/90 leading-relaxed">{result.predictionReason}</p>
              </div>

              <div className="glass rounded-2xl p-4 border-primary/20">
                <p className="text-xs text-primary mb-1.5 font-medium">Recommendation</p>
                <p className="text-sm text-text/90 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <EmptyState
              icon={<Brain className="h-6 w-6" />}
              title="No prediction yet"
              description="Fill in the journey context on the left and run a prediction to see AI-generated risk insights here."
            />
          </Card>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full min-w-0 box-border flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl glass hover:border-primary/30 transition-colors"
    >
      <span className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="truncate">{label}</span>
      </span>

      <span
        className={`h-5 w-9 min-w-9 shrink-0 rounded-full transition-colors relative ${
          checked ? "bg-primary" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}