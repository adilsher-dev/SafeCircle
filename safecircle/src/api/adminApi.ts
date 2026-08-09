import { apiClient } from './client';
import type { ApiResponse, AdminDashboardResponse, AdminUserResponse, UserStatusRequest } from '@/types';

// Mirrors AdminController (/api/admin) — requires ROLE_ADMIN
export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<AdminDashboardResponse>>('/admin/dashboard').then((r) => r.data),

  getAllUsers: () =>
    apiClient.get<ApiResponse<AdminUserResponse[]>>('/admin/users').then((r) => r.data),

  getUser: (id: number) =>
    apiClient.get<ApiResponse<AdminUserResponse>>(`/admin/user/${id}`).then((r) => r.data),

  updateUserStatus: (payload: UserStatusRequest) =>
    apiClient.put<ApiResponse<string>>('/admin/user/status', payload).then((r) => r.data),

  deleteUser: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/admin/user/${id}`).then((r) => r.data),
};
