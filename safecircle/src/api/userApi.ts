import { apiClient } from './client';
import type { ApiResponse, UserResponse, UpdateProfileRequest } from '@/types';

// Mirrors UserController (/api/users)
export const userApi = {
  getCurrentUser: () =>
    apiClient.get<ApiResponse<UserResponse>>('/users/me').then((r) => r.data),

  updateProfile: (payload: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserResponse>>('/users/update', payload).then((r) => r.data),

  deleteAccount: () =>
    apiClient.delete<ApiResponse<string>>('/users/delete').then((r) => r.data),
};
