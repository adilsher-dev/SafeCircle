import { apiClient } from './client';
import type { ApiResponse, AlertRequest, AlertResponse } from '@/types';

// Mirrors AlertController (/api/alerts)
export const alertApi = {
  triggerAlert: (payload: AlertRequest) =>
    apiClient.post<ApiResponse<AlertResponse>>('/alerts/trigger', payload).then((r) => r.data),

  getMyAlerts: () =>
    apiClient.get<ApiResponse<AlertResponse[]>>('/alerts').then((r) => r.data),

  getAlert: (id: number) =>
    apiClient.get<ApiResponse<AlertResponse>>(`/alerts/${id}`).then((r) => r.data),

  resolveAlert: (id: number) =>
    apiClient.put<ApiResponse<AlertResponse>>(`/alerts/${id}/resolve`).then((r) => r.data),

  deleteAlert: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/alerts/${id}`).then((r) => r.data),
};

// Mirrors EmergencyController (/api/emergency)
export const emergencyApi = {
  triggerSOS: (payload: AlertRequest) =>
    apiClient.post<ApiResponse<AlertResponse>>('/emergency/sos', payload).then((r) => r.data),

  cancelSOS: (alertId: number) =>
    apiClient.put<ApiResponse<AlertResponse>>(`/emergency/cancel/${alertId}`).then((r) => r.data),

  getMyAlerts: () =>
    apiClient.get<ApiResponse<AlertResponse[]>>('/emergency/my-alerts').then((r) => r.data),

  getAlertById: (alertId: number) =>
    apiClient.get<ApiResponse<AlertResponse>>(`/emergency/${alertId}`).then((r) => r.data),
};
