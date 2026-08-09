import { apiClient } from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types';

// Mirrors AuthController (/api/auth)
export const authApi = {
  register: (payload: RegisterRequest) =>
    apiClient.post<ApiResponse>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload).then((r) => r.data),

  refreshToken: (payload: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse>('/auth/refresh-token', payload).then((r) => r.data),

  sendOtp: (email: string) =>
    apiClient
      .post<ApiResponse<string>>(`/auth/send-otp`, null, { params: { email } })
      .then((r) => r.data),

  verifyOtp: (payload: VerifyOtpRequest) =>
    apiClient.post<ApiResponse<string>>('/auth/verify-otp', payload).then((r) => r.data),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<string>>('/auth/forgot-password', payload).then((r) => r.data),

  resetPassword: (payload: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<string>>('/auth/reset-password', payload).then((r) => r.data),
};
