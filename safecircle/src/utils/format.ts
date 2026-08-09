import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { RiskLevel, AlertStatus, JourneyStatus } from '@/types';

export function formatDate(iso?: string, fmt = 'MMM d, yyyy h:mm a') {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), fmt);
  } catch {
    return iso;
  }
}

export function formatRelative(iso?: string) {
  if (!iso) return '—';
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function formatDistance(km?: number) {
  if (km == null) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

export function formatDuration(seconds?: number) {
  if (seconds == null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatSpeed(kmh?: number) {
  if (kmh == null) return '—';
  return `${kmh.toFixed(1)} km/h`;
}

export const riskLevelColor: Record<RiskLevel, string> = {
  LOW: 'text-safe',
  MEDIUM: 'text-warning',
  HIGH: 'text-danger',
  CRITICAL: 'text-danger',
};

export const riskLevelBg: Record<RiskLevel, string> = {
  LOW: 'bg-safe/15 text-safe border-safe/30',
  MEDIUM: 'bg-warning/15 text-warning border-warning/30',
  HIGH: 'bg-danger/15 text-danger border-danger/30',
  CRITICAL: 'bg-danger/25 text-danger border-danger/50',
};

export const alertStatusBg: Record<AlertStatus, string> = {
  ACTIVE: 'bg-danger/15 text-danger border-danger/30',
  RESOLVED: 'bg-safe/15 text-safe border-safe/30',
  CANCELLED: 'bg-muted/15 text-muted border-muted/30',
};

export const journeyStatusBg: Record<JourneyStatus, string> = {
  STARTED: 'bg-primary/15 text-primary border-primary/30',
  IN_PROGRESS: 'bg-primary/15 text-primary border-primary/30',
  COMPLETED: 'bg-safe/15 text-safe border-safe/30',
  CANCELLED: 'bg-muted/15 text-muted border-muted/30',
};

export function initials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}
