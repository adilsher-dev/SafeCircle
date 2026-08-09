import { apiClient } from './client';
import type {
  DashboardResponse,
  JourneyStatisticsResponse,
  SafetyStatisticsResponse,
  NotificationStatisticsResponse,
  WeeklySafetyReportResponse,
  MonthlySafetyReportResponse,
  JourneyTrendResponse,
  RiskTrendResponse,
} from '@/types';

// Mirrors DashboardController (/api/dashboard)
// NOTE: unlike most controllers, these endpoints return the DTO directly (not wrapped in ApiResponse)
export const dashboardApi = {
  getDashboard: () => apiClient.get<DashboardResponse>('/dashboard').then((r) => r.data),

  getJourneyStatistics: () =>
    apiClient.get<JourneyStatisticsResponse>('/dashboard/journey').then((r) => r.data),

  getSafetyStatistics: () =>
    apiClient.get<SafetyStatisticsResponse>('/dashboard/safety').then((r) => r.data),

  getNotificationStatistics: () =>
    apiClient.get<NotificationStatisticsResponse>('/dashboard/notifications').then((r) => r.data),
};

// Mirrors AnalyticsController (/api/analytics)
// NOTE: also unwrapped, returns DTOs directly
export const analyticsApi = {
  getWeeklyReport: () =>
    apiClient.get<WeeklySafetyReportResponse>('/analytics/weekly').then((r) => r.data),

  getMonthlyReport: () =>
    apiClient.get<MonthlySafetyReportResponse>('/analytics/monthly').then((r) => r.data),

  getJourneyTrend: () =>
    apiClient.get<JourneyTrendResponse[]>('/analytics/journey-trend').then((r) => r.data),

  getRiskTrend: () =>
    apiClient.get<RiskTrendResponse[]>('/analytics/risk-trend').then((r) => r.data),
};
