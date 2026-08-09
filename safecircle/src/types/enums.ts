// Mirrors com.safecircle.backend.enums.* exactly. Do not add values not present in backend.

export type AlertStatus = 'ACTIVE' | 'CANCELLED' | 'RESOLVED';

export type AlertType = 'SOS' | 'PANIC' | 'MEDICAL' | 'ACCIDENT' | 'MANUAL';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type JourneyStatus = 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type NotificationType =
  | 'INFO'
  | 'JOURNEY_STARTED'
  | 'JOURNEY_COMPLETED'
  | 'SOS_TRIGGERED'
  | 'SOS_CANCELLED'
  | 'HIGH_RISK'
  | 'EMERGENCY'
  | 'SYSTEM';

export type RelationshipType =
  | 'FATHER'
  | 'MOTHER'
  | 'BROTHER'
  | 'SISTER'
  | 'HUSBAND'
  | 'WIFE'
  | 'FRIEND'
  | 'COLLEAGUE'
  | 'GUARDIAN'
  | 'OTHER';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Role = 'USER' | 'ADMIN' | 'POLICE' | 'EMERGENCY_OPERATOR';

export const ALERT_TYPES: AlertType[] = ['SOS', 'PANIC', 'MEDICAL', 'ACCIDENT', 'MANUAL'];
export const RELATIONSHIP_TYPES: RelationshipType[] = [
  'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'HUSBAND', 'WIFE', 'FRIEND', 'COLLEAGUE', 'GUARDIAN', 'OTHER',
];
export const GENDERS: Gender[] = ['MALE', 'FEMALE', 'OTHER'];
export const TRANSPORT_MODES = ['WALKING', 'DRIVING', 'BICYCLE', 'PUBLIC_TRANSPORT', 'BIKE'] as const;
