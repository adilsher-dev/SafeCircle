import type { AlertStatus, AlertType, RiskLevel } from './enums';

// AlertController / EmergencyController
export interface AlertRequest {
  journeyId: number;
  alertType: AlertType;
  latitude: number;
  longitude: number;
  address?: string;
  message?: string;
  batteryLevel?: number;
  sirenActivated?: boolean;
  deviceInfo?: string;
}

export interface AlertResponse {
  id: number;
  alertType: AlertType;
  status: AlertStatus;
  latitude: number;
  longitude: number;
  address?: string;
  message?: string;
  batteryLevel?: number;
  sirenActivated?: boolean;
  contactsNotified?: boolean;
  policeNotified?: boolean;
  deviceInfo?: string;
  triggeredAt: string;
  resolvedAt?: string;
  journeyId: number;
}

export interface AlertMessage {
  alertId: number;
  journeyId: number;
  userId: number;
  alertType: AlertType;
  status: AlertStatus;
  message?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

// AIRiskPredictionController
export interface RiskPredictionRequest {
  journeyId: number;
  latitude: number;
  longitude: number;
  batteryLevel?: number;
  travellingAlone?: boolean;
  nightTime?: boolean;
  unfamiliarArea?: boolean;
}

export interface RiskPredictionResponse {
  riskAssessmentId: number;
  journeyId: number;
  riskScore: number;
  riskLevel: RiskLevel;
  predictionReason: string;
  recommendation: string;
  createdAt: string;
}
