import { Badge } from '@/components/ui/Feedback';
import { riskLevelBg, alertStatusBg, journeyStatusBg } from '@/utils/format';
import type { RiskLevel, AlertStatus, JourneyStatus } from '@/types';

export function RiskBadge({ level }: { level?: RiskLevel }) {
  if (!level) return <Badge className="border-border text-muted">Unknown</Badge>;
  return <Badge className={riskLevelBg[level]}>{level}</Badge>;
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return <Badge className={alertStatusBg[status]}>{status}</Badge>;
}

export function JourneyStatusBadge({ status }: { status: JourneyStatus }) {
  return <Badge className={journeyStatusBg[status]}>{status.replace('_', ' ')}</Badge>;
}
