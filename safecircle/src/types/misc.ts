import type { Gender, RelationshipType, Role } from './enums';

// ContactController
export interface ContactRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  relationship: RelationshipType;
  primaryContact?: boolean;
}

export interface ContactResponse {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  relationship: RelationshipType;
  primaryContact?: boolean;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

// NotificationController
export interface NotificationRequest {
  title: string;
  message: string;
  type: string;
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isSent: boolean;
  createdAt: string;
}

export interface NotificationStatisticsResponse {
  totalNotifications: number;
  readNotifications: number;
  unreadNotifications: number;
}

// DashboardController
export interface DashboardResponse {
  fullName: string;
  totalJourneys: number;
  activeJourneys: number;
  completedJourneys: number;
  cancelledJourneys: number;
  totalTrustedContacts: number;
  totalAlerts: number;
  totalNotifications: number;
  unreadNotifications: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
}

export interface JourneyStatisticsResponse {
  totalJourneys: number;
  activeJourneys: number;
  completedJourneys: number;
  cancelledJourneys: number;
  totalDistance: number;
  averageDistance: number;
}

export interface SafetyStatisticsResponse {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
  totalAlerts: number;
}

// AnalyticsController
export interface WeeklySafetyReportResponse {
  totalJourneys: number;
  completedJourneys: number;
  cancelledJourneys: number;
  alertsTriggered: number;
  highRiskEvents: number;
  safetyScore: number;
}

export interface MonthlySafetyReportResponse {
  totalJourneys: number;
  completedJourneys: number;
  cancelledJourneys: number;
  alertsTriggered: number;
  highRiskEvents: number;
  safetyScore: number;
}

export interface JourneyTrendResponse {
  month: string;
  totalJourneys: number;
}

export interface RiskTrendResponse {
  month: string;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
}

// AdminController
export interface AdminDashboardResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalJourneys: number;
  totalAlerts: number;
  totalRiskAssessments: number;
}

export interface AdminUserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface UserStatusRequest {
  userId: number;
  active: boolean;
}

// OpenStreetMapController
export interface AddressResponse {
  displayName: string;
  latitude: number;
  longitude: number;
}

export interface RouteRequest {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}

export interface RouteResponse {
  distance: number;
  duration: number;
  geometry: string;
  status: string;
}
