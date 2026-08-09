import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/utils/cn';

// Fix default marker icons (Leaflet + Vite asset resolution quirk)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

function coloredDivIcon(color: string, pulse = false) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;width:22px;height:22px;">
        ${pulse ? `<div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.5;animation:marker-ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>` : ''}
        <div style="position:absolute;inset:3px;border-radius:9999px;background:${color};border:2px solid #020617;box-shadow:0 0 10px ${color};"></div>
      </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

const icons = {
  current: coloredDivIcon('#14B8A6', true),      // Teal
  destination: coloredDivIcon('#10B981'),        // Emerald
  sos: coloredDivIcon('#EF4444', true),          // Red
  safe: coloredDivIcon('#22C55E'),               // Green
};

export type MapMarker = {
  id: string | number;
  position: [number, number];
  type?: keyof typeof icons;
  label?: string;
  popup?: string;
};

export type MapZone = {
  id: string | number;
  center: [number, number];
  radiusMeters: number;
  kind: 'safe' | 'danger';
  label?: string;
};

function ClickHandler({ onClick }: { onClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click: (e) => onClick([e.latlng.lat, e.latlng.lng]),
  });
  return null;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.8 });
  }, [center, map]);
  return null;
}

interface DarkMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  routePositions?: [number, number][];
  zones?: MapZone[];
  followMarker?: [number, number];
  className?: string;
  heatmapPlaceholder?: boolean;
  onMapClick?: (latlng: [number, number]) => void;
}

export function DarkMap({
  center,
  zoom = 14,
  markers = [],
  routePositions,
  zones = [],
  followMarker,
  className,
  heatmapPlaceholder,
  onMapClick,
}: DarkMapProps) {
  const zoneCircles = useMemo(
    () =>
      zones.map((z) => (
        <Circle
          key={z.id}
          center={z.center}
          radius={z.radiusMeters}
          pathOptions={{
  color: z.kind === 'safe' ? '#10B981' : '#EF4444',
  fillColor: z.kind === 'safe' ? '#10B981' : '#EF4444',
  fillOpacity: z.kind === 'safe' ? 0.12 : 0.15,
  weight: 2.5,
  opacity: 0.95,
  dashArray: z.kind === 'danger' ? '8 6' : undefined,
}}
        >
          {z.label && <Popup>{z.label}</Popup>}
        </Circle>
      )),
    [zones]
  );

  return (
    <div className={cn('relative overflow-hidden rounded-[28px] border border-primary/15 shadow-[0_25px_70px_rgba(0,0,0,.45)]', className)}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {zoneCircles}
        {routePositions && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
  color: '#14B8A6',
  weight: 6,
  opacity: 0.95,
  lineCap: 'round',
  lineJoin: 'round',
}}
          />
        )}
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} icon={icons[m.type ?? 'current']}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
        {followMarker && <Recenter center={followMarker} />}
        {onMapClick && <ClickHandler onClick={onMapClick} />}
      </MapContainer>

      {heatmapPlaceholder && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-40 mix-blend-screen">
          <div className="absolute top-1/4 left-1/3 h-48 w-48 rounded-full bg-primary/25 blur-[90px]" />

<div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-ai/20 blur-[90px]" />

<div className="absolute top-1/2 right-1/3 h-32 w-32 rounded-full bg-warning/20 blur-[70px]" />
        </div>
      )}
    </div>
  );
}
