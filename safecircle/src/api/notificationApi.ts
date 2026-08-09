import { apiClient } from './client';
import type { ApiResponse, NotificationRequest, NotificationResponse } from '@/types';

// Mirrors NotificationController (/api/notifications)
export const notificationApi = {
  sendNotification: (payload: NotificationRequest) =>
    apiClient.post<ApiResponse<NotificationResponse>>('/notifications', payload).then((r) => r.data),

  getMyNotifications: () =>
    apiClient.get<ApiResponse<NotificationResponse[]>>('/notifications').then((r) => r.data),

  getNotification: (id: number) =>
    apiClient.get<ApiResponse<NotificationResponse>>(`/notifications/${id}`).then((r) => r.data),

  markAsRead: (id: number) =>
    apiClient.put<ApiResponse<NotificationResponse>>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    apiClient.put<ApiResponse<string>>('/notifications/read-all').then((r) => r.data),

  deleteNotification: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/notifications/${id}`).then((r) => r.data),
};
