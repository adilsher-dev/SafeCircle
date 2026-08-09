import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input, Select, TextArea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DarkMap } from '@/components/map/DarkMap';
import { journeyApi, osmApi } from '@/api';
import { journeySchema, type JourneyFormValues } from '@/utils/schemas';
import { extractErrorMessage } from '@/api/client';
import { TRANSPORT_MODES } from '@/types';

export default function StartJourneyPage() {
  const navigate = useNavigate();
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.209]);
  const [sourceCoords, setSourceCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JourneyFormValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: { transportMode: 'DRIVING' },
  });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSourceCoords([latitude, longitude]);
        setCenter([latitude, longitude]);
        setValue('sourceLatitude', latitude);
        setValue('sourceLongitude', longitude);
        try {
          const addr = await osmApi.reverseGeocode(latitude, longitude);
          setValue('source', addr.displayName);
        } catch {
          setValue('source', `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      () => {
        toast.error('Could not get your location');
        setLocating(false);
      }
    );
  };

  const handleMapClick = async (latlng: [number, number]) => {
    setDestCoords(latlng);
    setValue('destinationLatitude', latlng[0]);
    setValue('destinationLongitude', latlng[1]);
    try {
      const addr = await osmApi.reverseGeocode(latlng[0], latlng[1]);
      setValue('destination', addr.displayName);
    } catch {
      setValue('destination', `${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`);
    }
  };

  const onSubmit = async (values: JourneyFormValues) => {
    try {
      const res = await journeyApi.startJourney({
        ...values,
        expectedArrivalTime: new Date(values.expectedArrivalTime).toISOString(),
        sourceLatitude: sourceCoords?.[0],
        sourceLongitude: sourceCoords?.[1],
        destinationLatitude: destCoords?.[0],
        destinationLongitude: destCoords?.[1],
      });
      if (!res.success) {
        toast.error(res.message || 'Could not start journey');
        return;
      }
      toast.success('Journey started — stay safe!');
      navigate('/tracking', { state: { journeyId: res.data.id } });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const markers = [
    ...(sourceCoords ? [{ id: 'src', position: sourceCoords, type: 'current' as const, popup: 'Source' }] : []),
    ...(destCoords ? [{ id: 'dest', position: destCoords, type: 'destination' as const, popup: 'Destination' }] : []),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2 h-fit">
        <CardHeader title="Plan Your Journey" subtitle="Fill in the details to begin live tracking" icon={<Navigation className="h-5 w-5" />} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-end gap-2">
            <Input
              label="Source"
              icon={<MapPin className="h-4 w-4" />}
              placeholder="Current location or address"
              error={errors.source?.message}
              {...register('source')}
            />
            <Button type="button" variant="outline" size="icon" loading={locating} onClick={useCurrentLocation} title="Use current location">
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>

          <Input
            label="Destination"
            icon={<MapPin className="h-4 w-4" />}
            placeholder="Where are you headed?"
            error={errors.destination?.message}
            {...register('destination')}
          />

          <Input
            label="Expected arrival time"
            type="datetime-local"
            icon={<Clock className="h-4 w-4" />}
            error={errors.expectedArrivalTime?.message}
            {...register('expectedArrivalTime')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select label="Transport mode" error={errors.transportMode?.message} {...register('transportMode')}>
              {TRANSPORT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode.replace('_', ' ')}
                </option>
              ))}
            </Select>
            <Input
              label="Distance (km)"
              type="number"
              step="0.1"
              placeholder="Optional"
              error={errors.distance?.message}
              {...register('distance', { valueAsNumber: true })}
            />
          </div>

          <TextArea
            label="Notes"
            placeholder="Anything your trusted contacts should know (optional)"
            rows={3}
            {...register('notes')}
          />

          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            <Navigation className="h-4 w-4" /> Start Journey & Enable Live Tracking
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-3" noPadding>
        <div className="p-5 md:p-6 pb-0">
          <CardHeader
            title="Route Preview"
            subtitle="Tap anywhere on the map to set your destination"
            icon={<MapPin className="h-5 w-5" />}
          />
        </div>
        <div className="h-[520px] px-5 md:px-6 pb-5 md:pb-6">
          <DarkMap
            className="h-full w-full"
            center={center}
            zoom={sourceCoords ? 14 : 5}
            markers={markers}
            routePositions={sourceCoords && destCoords ? [sourceCoords, destCoords] : undefined}
            onMapClick={handleMapClick}
          />
        </div>
      </Card>
    </div>
  );
}
